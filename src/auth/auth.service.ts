import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserDto } from './dto';
import { Hasher } from '../common/adapters';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly hasher: Hasher,
    private readonly jwtService: JwtService,
  ) {}

  // * Register user and return JWT (auto sign in on register)
  async createUser(data: Prisma.UserCreateInput) {
    try {
      const { password, ...rest } = data;
      // * User creation
      const user = await this.prisma.user.create({
        data: {
          password: await this.hasher.hash(password),
          ...rest,
        },
      });
      const token = this.signToken(user.id);
      // * Store token on db
      await this.applyToken(user.id, token);

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

    const token = this.signToken(user.id);
    await this.applyToken(user.id, token);

    return {
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles,
      },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    const isValidPassword = await this.hasher.compareHash(
      password,
      user?.password ?? '',
    );

    if (!user || !isValidPassword)
      throw new UnauthorizedException('Invalid email or password');

    return user;
  }

  /* */
  signToken(id: string) {
    return this.jwtService.sign({ id });
  }

  // * This method stores current token on db
  async applyToken(userId: string, token: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        // * Token must be saved hashed
        accessToken: await this.hasher.hash(token),
      },
    });
  }

  handleDatabaseErrors(error: any) {
    const badRequestCodes = {
      P2002: 'This email already exists',
    };

    const requestError = badRequestCodes[error.code];
    if (requestError) throw new BadRequestException(requestError);

    this.logger.error(error);
    throw new InternalServerErrorException('Internal server error');
  }
}
