import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    const isPasswordMatching = await bcrypt.compare(pass, user.password);
    if (isPasswordMatching) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: any) {
    user.password = await bcrypt.hash(user.password, 10);
    const createdUser = await this.usersService.create(user);
    createdUser.password = undefined;
    return createdUser;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async logout() {

  }
}
