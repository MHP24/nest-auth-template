import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { AuthRefresh, GetUserId } from './decorators';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // * Local auth
  @Post('sign_up')
  register(@Body() signUpUserDto: SignUpUserDto) {
    return this.authService.createUser(signUpUserDto);
  }

  @Post('sign_in')
  login(@Body() signInUserDto: SignInUserDto) {
    return this.authService.loginUser(signInUserDto);
  }

  @Post('refresh')
  @AuthRefresh()
  refresh(@GetUserId() userId: string) {
    return this.authService.refreshToken(userId);
  }

  // * oAuth Implementations
  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  googleAuthCallback(@Req() req) {
    return this.authService.oAuthLogin(req.user);
  }
}
