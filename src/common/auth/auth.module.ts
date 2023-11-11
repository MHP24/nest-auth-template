import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommonModule } from '../common.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [PrismaModule, CommonModule],
})
export class AuthModule {}
