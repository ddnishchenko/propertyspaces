import { IsNotEmpty, IsEmail } from 'class-validator';

export class ChangeEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
