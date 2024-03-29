import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ChangeEmailDto } from '../request-dto/change-email.dto';
import { ChangePasswordDto } from '../request-dto/change-password.dto';
import { RegisterDto } from '../request-dto/register.dto';
import { ResetPasswordDto } from '../request-dto/reset-password.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {

  constructor(
    private authService: AuthService
  ) { }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req) {
    return this.authService.login(req.user);
  }

  @Get('logout')
  logout(@Req() req) {
    req.logout();
  }

  @HttpCode(200)
  @Post('forgot-password')
  async forgotPassword(@Res() res, @Body() body: ChangeEmailDto) {
    await this.authService.forgotPassword(body.email);
    res.json({ message: 'Check you email please!' });
  }

  @HttpCode(200)
  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    await this.authService.resetPassword(body);
    return { message: 'password changed' }
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('change-email')
  async changeEmail(@Req() req, @Body() body: ChangeEmailDto) {
    await this.authService.changeEmail(req.user, body.email);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Body() body: ChangePasswordDto) {
    await this.authService.changePassword(req.user.id, body.currentPassword, body.newPassword);
  }



}
