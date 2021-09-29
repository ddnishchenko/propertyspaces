import { MaxLength, MinLength, Matches } from "class-validator";
import { PASSWORD_REGEX } from "./regex";

export class ChangePasswordDto {
  currentPassword: string;
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX)
  newPassword: string;
}
