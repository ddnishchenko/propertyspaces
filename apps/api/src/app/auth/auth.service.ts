import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  private hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations,
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
    return { salt, hash };
  }

  private validatePassword(password, hash, salt) {
    return hash === crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    // const isPasswordMatching = await bcrypt.compare(pass, user.password);
    const isPasswordMatching = this.validatePassword(pass, user.hash, user.salt);
    if (isPasswordMatching) {
      const { hash, salt, ...result } = user;
      return result;
    }
    return null;
  }

  async register(user: any) {
    const { hash, salt } = this.hashPassword(user.password);
    user.password = undefined;
    user.passwordConfirmation = undefined;
    user.termsCheck = undefined;
    user.hash = hash;
    user.salt = salt;
    // user.hash = await bcrypt.hash(user.password, 10);
    const createdUser = await this.usersService.create(user);
    createdUser.password = undefined;
    createdUser.hash = undefined;
    createdUser.salt = undefined;
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
