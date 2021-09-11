import { Body, Controller, Delete, Get, Patch, Req, Request, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const { hash, salt, ...user } = await this.usersService.findById(req.user.id)
    return user;
  }
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req, @Body() body) {
    const result = await this.usersService.update(req.user.id, body);
    return result.Attributes;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteProfile(@Req() req) {
    await this.usersService.delete(req.user);
    req.logout();
  }
}
