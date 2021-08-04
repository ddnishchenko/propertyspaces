import { Injectable } from '@nestjs/common';
// import { Message } from '@propertyspaces/api-interfaces';

@Injectable()
export class AppService {
  getData(): any {
    return { message: 'Welcome to api!' };
  }
}
