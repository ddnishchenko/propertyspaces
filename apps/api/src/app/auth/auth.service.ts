import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { randomBytes, pbkdf2Sync } from 'crypto';

function saltPassword(password, salt) {
  const iterations = parseInt(process.env.SALT_ITRATION) || 1000;
  return pbkdf2Sync(password, salt, iterations, 64, `sha512`).toString(`hex`);
}

process.env.SALT_ITRATION

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  private hashPassword(password) {
    const salt = randomBytes(16).toString('hex');

    // Hashing user's salt and password with 1000 iterations,
    const hash = saltPassword(password, salt);
    return { salt, hash };
  }

  private validatePassword(password, hash, salt) {
    return hash === saltPassword(password, salt);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // const isPasswordMatching = await bcrypt.compare(pass, user.password);
      const isPasswordMatching = this.validatePassword(pass, user.hash, user.salt);
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
    const { hash, salt } = this.hashPassword(user.password);
    user.password = undefined;
    user.passwordConfirmation = undefined;
    user.termsCheck = undefined;
    user.hash = hash;
    user.salt = salt;
    // user.hash = await bcrypt.hash(user.password, 10);
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
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
