import { Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ChangeEmailDto } from '../request-dto/change-email.dto';
import { SubscriptionDto } from '../request-dto/subscripion.dto';
import { Role } from '../roles/role.enum';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Req() req) {
    if (req.user.roles.includes(Role.Admin)) {
      return this.usersService.list();
    }
    throw new ForbiddenException();
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
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

  @UseGuards(JwtAuthGuard)
  @Patch('profile/change-email')
  async changeEmail(@Req() req, @Body() body: ChangeEmailDto) {
    if (body.email) {
      await this.usersService.changeEmail(req.user.id, req.user.email, body.email);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile/subscription')
  async subscribe(@Req() req, @Body() body: SubscriptionDto) {
    return await this.usersService.updateSubsciption(req.user.id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUser(@Req() req, @Param('id') id) {
    if (req.user.roles.includes(Role.Admin)) {
      const { hash, salt, ...user } = await this.usersService.findById(id);
      return user;
    }
    throw new ForbiddenException();
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateUser(@Req() req, @Param('id') id, @Body() body) {
    if (req.user.roles.includes(Role.Admin)) {
      return this.usersService.update(id, body);
    }
    throw new ForbiddenException();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Req() req, @Param('id') id, @Body() body) {
    if (req.user.roles.includes(Role.Admin)) {
      return this.usersService.delete(id);
    }
    throw new ForbiddenException();
  }


}
