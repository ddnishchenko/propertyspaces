import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DynamoDB } from 'aws-sdk';
import { randomUUID } from 'crypto';
import { environment } from '../../environments/environment';
import { ResetPasswordDto } from '../request-dto/reset-password.dto';
// import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { hashPassword, validatePassword } from './password';
import { sendEmail } from './send-email';


const db = new DynamoDB.DocumentClient({});


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
      const url = environment.frontentUrl + '/auth';
      try {
        /* await sendEmail({
          recipients: [user.email],
          subject: 'Reset password from Lidarama',
          bodyText: `
          Please do not replay on this email
          `,
          bodyHtml: `
          Login to lidarama
          <a href="${url}" target="_blank">Lidarama</a>
          `
        }); */
      } catch (e) {
        console.error(e.message);
      }
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

  async forgotPassword(email) {
    // 1. find user
    const user = await this.usersService.findByEmail(email);
    if (user) {
      // 2. create reset password token
      const resetPasswordToken = randomUUID();
      await db.put({
        TableName: 'uniques',
        ConditionExpression: 'attribute_not_exists(#pk)',
        ExpressionAttributeNames: {
          '#pk': 'value',
        },
        Item: {
          value: resetPasswordToken,
          type: 'resetPasswordToken',
          userId: user.id
        }
      }).promise();
      // 3. Send email with reset token link
      const url = environment.frontentUrl + '/auth/reset-password?resetToken=' + resetPasswordToken;
      try {
        /* await sendEmail({
          recipients: [email],
          subject: 'Reset password from Lidarama',
          bodyText: `
          Please do not replay on this email
          `,
          bodyHtml: `
          Follow this link to reset tour password
          <a href="${url}">${url}</a>
          `
        }); */
      } catch (e) {
        console.error(e.message);
      }

    } else {
      throw new NotFoundException();
    }

  }

  async resetPassword(body: ResetPasswordDto) {
    // 1. Check reset token
    const unique = await db.get({
      TableName: 'uniques',
      Key: { value: body.resetToken }
    }).promise();

    // 2. Remove tokens
    const scan = await db.scan({
      TableName: 'uniques',
      FilterExpression: ':userId = userId and #type = :type',
      ExpressionAttributeValues: {
        ':userId': unique.Item.userId,
        ':type': 'resetPasswordToken'
      },
      ExpressionAttributeNames: {
        '#type': 'type'
      }
    }).promise();

    for (let item of scan.Items) {
      await db.delete({
        TableName: 'uniques',
        Key: { value: item.value }
      }).promise();
    }

    // 3. Change password
    const { hash, salt } = hashPassword(body.password);
    await this.usersService.changePassword(unique.Item.userId, hash, salt);
  }
}
