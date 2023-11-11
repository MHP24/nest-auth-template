import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  createUser() {
    return 'createUser';
  }

  loginUser() {
    return 'loginUser';
  }
}
