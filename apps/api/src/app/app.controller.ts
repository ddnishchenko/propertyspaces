import { Controller, Get, Res, UseGuards } from '@nestjs/common';

import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private appService: AppService) { }
  @UseGuards(JwtAuthGuard)
  @Get('') index(@Res() res) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized' })
  }
}
