import { MaxLength, MinLength, Matches } from "class-validator";


const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\d\w]).{8,16}$/;

export class ChangePasswordDto {
  oldPassword: string;
  @MinLength(8)
  @MaxLength(16)
  @Matches(PASSWORD_REGEX)
  newPassword: string;
}
