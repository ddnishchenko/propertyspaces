import { Controller, Get } from '@nestjs/common';

// import { Message } from '@propertyspaces/api-interfaces';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) { }
  @Get('') index() {
    return { appName: 'Lidarama' };
  }
  @Get('hello')
  getData(): any {
    return this.appService.getData();
  }
}
