import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { Role } from './roles/role.enum';
console.log(process.env.MAIL_USER);
@Controller()
export class AppController {
  constructor() {

  }
  @UseGuards(JwtAuthGuard)
  @Get('') index(@Req() req) {
    return req.user.roles.includes(Role.Admin) ? {} : {};
  }
}
