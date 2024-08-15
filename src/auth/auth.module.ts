import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { CommonModule } from '../common/common.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { envs } from '../common/config';
import { PrismaModule } from '../prisma/prisma.module';
import { GoogleStrategy } from './strategies/google-oauth.strategy';

@Module({
  controllers: [AuthController],
  imports: [
    ConfigModule,
    PrismaModule,
    CommonModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: envs.jwt.secret,
      signOptions: { expiresIn: envs.jwt.expireText },
    }),
  ],
  providers: [AuthService, JwtStrategy, GoogleStrategy],
  exports: [PassportModule],
})
export class AuthModule {}
