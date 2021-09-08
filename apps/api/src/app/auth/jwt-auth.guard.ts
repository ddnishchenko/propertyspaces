import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      if (info) {
        console.log('Info:');
        console.log(info);
      }
      if (err) {

      }
      console.log('Error:');
      console.log(err);
      throw new UnauthorizedException(info, info.message);
    }
    return user;
  }
}
