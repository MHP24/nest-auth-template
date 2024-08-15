import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { AuthRefresh, GetUserId } from './decorators';
import { Response } from 'express';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

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

  @Post('refresh')
  @AuthRefresh()
  refresh(@GetUserId() userId: string) {
    return this.authService.refreshToken(userId);
  }

  @Get('callback/google')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.oAuthLogin(req.user);
    console.log({ token });
    res.status(200).json({ token })
  }
}
