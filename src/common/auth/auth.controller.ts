import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  register() {
    return this.authService.createUser();
  }

  @Post('sign_in')
  login() {
    return this.authService.loginUser();
  }
}
