import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { hashPassword, validatePassword } from './password';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // const isPasswordMatching = await bcrypt.compare(pass, user.password);
      const isPasswordMatching = validatePassword(pass, user.hash, user.salt);
      if (isPasswordMatching) {
        const { hash, salt, ...result } = user;
        return result;
      }
    }

    return null;
  }

  async register(user: any) {
    if (user.password.length < 8 || user.password.length > 16) {
      throw new BadRequestException({ statusCode: 400, message: 'Password length must be from 8 to 16 symbols.' })
    }
    const { hash, salt } = hashPassword(user.password);
    user.password = undefined;
    user.passwordConfirmation = undefined;
    user.termsCheck = undefined;
    user.hash = hash;
    user.salt = salt;

    try {
      const createdUser = await this.usersService.create(user);
      createdUser.password = undefined;
      createdUser.hash = undefined;
      createdUser.salt = undefined;
      return createdUser;
    } catch (e) {
      e.message = 'This email already registered.';
      throw new ForbiddenException(e, 'This email already taken.')
    }

  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, roles: user.roles };
    return {
      accessToken: this.jwtService.sign(payload),
      user
    };
  }

  async changeEmail(user, email) {
    await this.usersService.changeEmail(user.id, user.email, email);
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.usersService.findById(userId);
    if (validatePassword(oldPassword, user.hash, user.salt)) {
      const { hash, salt } = hashPassword(newPassword);
      await this.usersService.changePassword(userId, hash, salt);
    } else {
      throw new UnauthorizedException({ message: 'Wrong old password' })
    }
  }
}
