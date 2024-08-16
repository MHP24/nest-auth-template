import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserDto } from './dto';
import { Hasher } from '../common/adapters';
import { envs } from '../common/config';
import { OAuthSession } from './types';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly hasher: Hasher,
    private readonly jwtService: JwtService,
  ) {}

  // * Register user and return JWT (auto sign in on register)
  async createUser(data: SignUpUserDto & { provider?: string }) {
    try {
      const { password, ...rest } = data;
      // * User creation
      const user = await this.prismaService.user.create({
        data: {
          password: await this.hasher.hash(password),
          ...rest,
        },
      });
      const token = await this.handleToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          roles: user.roles,
        },
        token,
      };
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  /*
   * Makes validation using validateUser and
   * if the user is valid generates JWT
   */
  async loginUser(data: SignUpUserDto) {
    const { email, password } = data;
    const user = await this.validateUser(email, password);

    const token = await this.handleToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  // * Valiadate user credentials vs db
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: { email, provider: 'local' },
    });
    const isValidPassword = await this.hasher.compareHash(
      password,
      user?.password ?? '',
    );

    if (!user || !isValidPassword)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  // * Sign token using JWT Strategy
  signToken(id: string) {
    return {
      accessToken: this.jwtService.sign({ id }),
      refreshToken: this.jwtService.sign(
        { id },
        {
          expiresIn: envs.jwt.refreshExpireText,
          secret: envs.jwt.refreshSecret,
        },
      ),
      expiresIn: new Date().setTime(
        new Date().getTime() + envs.jwt.expireSeconds * 1000,
      ),
    };
  }

  // * This method stores current token on db
  async applyToken(userId: string, token: string) {
    await this.prismaService.user.update({
      where: { id: userId },
      data: {
        // ! Token must be saved hashed
        accessToken: await this.hasher.hash(token),
      },
    });
  }

  // * Handler for creation and saving
  async handleToken(userId: string) {
    const token = this.signToken(userId);
    await this.applyToken(userId, token.accessToken);
    return token;
  }

  async refreshToken(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        roles: true,
      },
    });

    return {
      user,
      token: await this.handleToken(user.id),
    };
  }

  // * oAuth implementations
  async oAuthLogin(session: OAuthSession) {
    if (!session) {
      throw new ForbiddenException('User not available');
    }

    const user = await this.prismaService.user.findUnique({
      where: { email: session.email },
    });

    if (!user) {
      const newUser = await this.createUser({
        email: session.email,
        password: '',
        provider: session.provider,
      });

      return newUser;
    }

    const token = await this.handleToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  // * Handler for service
  handleDatabaseErrors(error: any) {
    const badRequestCodes = {
      P2002: 'This email already exists',
    };

    const requestError = badRequestCodes[error.code];
    if (requestError) throw new BadRequestException(requestError);

    this.logger.error(error);
    throw new BadRequestException();
  }
}
