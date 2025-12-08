import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from "class-validator";
import { CheckDateValidOrNot, IsMatch, IUser } from "src/common";
import { GenderEnum, RoleEnum } from "src/common/enums/user.enum";

export class ResendConfirmEmailOtp {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
export class LoginBodyDto extends ResendConfirmEmailOtp {
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class SignupBodyDto implements Partial<IUser> {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  firstName: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(2000)
  lastName: string;
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  password: string;

  @ValidateIf((data: SignupBodyDto) => {
    return Boolean(data.password);
  })
  @IsMatch(["password"])
  confirmPassword: string;

  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsDateString()
  @Validate(CheckDateValidOrNot)
  DOB: Date;

  @IsString()
  @Matches(/^(002|\+2)?01[0125][0-9]{8}$/)
  mobileNumber: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}

export class ConfirmEmailBodyDto extends ResendConfirmEmailOtp {
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  otp: number;
}

export class ResetPasswordBodyDto extends ConfirmEmailBodyDto {
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class VerifyGmail {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
