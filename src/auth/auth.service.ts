import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpUserDto } from './dto';
import { Hasher } from '../common/adapters';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');

  constructor(
    private readonly prisma: PrismaService,
    private readonly hasher: Hasher,
  ) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    try {
      const { password, ...rest } = data;
      return await this.prisma.user.create({
        data: {
          password: await this.hasher.hashPassword(password),
          ...rest,
        },
      });
      // TODO: add JWT sign
    } catch (error) {
      this.handleDatabaseErrors(error);
    }
  }

  async loginUser(data: SignUpUserDto) {
    const { email, password } = data;

    const user = await this.prisma.user.findUnique({ where: { email } });
    const isValidPassword = await this.hasher.comparePassword(
      password,
      user?.password ?? '',
    );
    if (!user || !isValidPassword)
      throw new BadRequestException('Invalid email or password');

    return { logged: true };
    // TODO: add JWT sign
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
