import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign_up')
  register(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.createUser(signUpUserDto);
  }

  @Post('sign_in')
  login(@Body() signInUserDto: SignInUserDto) {
    return this.authService.loginUser(signInUserDto);
  }
}
