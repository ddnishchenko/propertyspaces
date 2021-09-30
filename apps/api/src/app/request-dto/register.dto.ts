import { Equals, IsEmail, IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { PASSWORD_REGEX } from "./regex";

export class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX)
  password: string;
  passwordConfirmation: string;
  @Equals(true)
  termsCheck: boolean;
}
