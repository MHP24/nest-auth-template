import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtPayload } from '../interfaces';
import { envs } from '../../common/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      secretOrKey: envs.jwt.secret,
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { id } = payload;

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.isActive)
      throw new UnauthorizedException('Invalid access');

    delete user['password'];
    return user;
  }
}
