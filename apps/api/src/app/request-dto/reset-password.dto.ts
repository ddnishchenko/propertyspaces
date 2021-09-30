import { MaxLength, MinLength, Matches, IsNotEmpty } from "class-validator";
import { PASSWORD_REGEX } from "./regex";

export class ResetPasswordDto {
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX)
  password: string;
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX)
  passwordConfirmation: string;
  @IsNotEmpty()
  resetToken: string;
}
