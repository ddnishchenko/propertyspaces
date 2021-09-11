import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Role } from './roles/role.enum';

@Controller()
export class AppController {
  constructor() { }
  @UseGuards(JwtAuthGuard)
  @Get('') index(@Req() req) {
    return req.user.roles.includes(Role.Admin) ? { ...process.env } : {};
  }
}
