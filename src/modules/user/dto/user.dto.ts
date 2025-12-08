import {
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  Matches,
  MaxLength,
  MinLength,
  Validate,
} from "class-validator";
import { Types } from "mongoose";
import { CheckDateValidOrNot } from "src/common";
import { GenderEnum } from "src/common/enums/user.enum";

export class UpdateAccountBodyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  firstName: string;
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  lastName: string;
  @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsDateString()
  @Validate(CheckDateValidOrNot)
  DOB: Date;

  @IsString()
  @Matches(/^(002|\+2)?01[0125][0-9]{8}$/)
  mobileNumber: string;
}

export class UpdatePasswordBodyDto {
  @IsStrongPassword()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  oldPassword: string;

  @IsStrongPassword()
  @IsNotEmpty()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
  newPassword: string;
}

export class UserParamDto {
  @IsMongoId()
  userId: Types.ObjectId;
}
