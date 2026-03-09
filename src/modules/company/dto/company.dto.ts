import { Type } from "class-transformer";
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  MaxLength,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { Types } from "mongoose";
import { ICompany, type IPicture } from "src/common";

@ValidatorConstraint({ name: "match-between-fields", async: false })
export class MongoDBIds implements ValidatorConstraintInterface {
  validate(ids: Types.ObjectId[], args: ValidationArguments) {
    for (const id of ids) {
      if (!Types.ObjectId.isValid(id)) {
          return false;
}
    }
    return true;
  }

  defaultMessage(args: ValidationArguments): string {
    return `fail to match src field :: ${args?.property} with target field :: ${args?.constraints[0]}`;
  }
}

export class AddCompanyBodyDto implements Partial<ICompany> {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(1000)
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50000)
  description: string | undefined;

  @IsString()
  @IsNotEmpty()
  industry: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  numberOfEmployees: number;

  @IsEmail()
  @IsNotEmpty()
  companyEmail: string;

  @Validate(MongoDBIds)
  hRs: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  legalAttachment: IPicture;
}

export class UpdateCompanyBodyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  @IsOptional()
  companyName: string;

  @IsString()
  @MinLength(10)
  @MaxLength(50000)
  @IsOptional()
  description: string | undefined;

  @IsString()
  @IsOptional()
  industry: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsNumber()
  @Length(11, 20)
  @IsOptional()
  numberOfEmployees: number;

  @IsEmail()
  @IsOptional()
  companyEmail: string;

  @Validate(MongoDBIds)
  @IsOptional()
  hRs: Types.ObjectId[];
}
export class CompanyParamDto {
  @IsMongoId()
  @Type(() => Types.ObjectId)
  companyId: Types.ObjectId;
}

export class SearchQueryDto {
  @IsString()
  search: string;
}
