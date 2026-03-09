import { Type } from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Types } from "mongoose";
import { IJob, JobLocationEnum, SeniorityLevelEnum, WorkingTimeEnum } from "src/common";

export class JobParamDto {
  @IsMongoId()
  @IsOptional()
  @Type(() => Types.ObjectId)
  jobId: Types.ObjectId;
  @IsMongoId()
  @Type(() => Types.ObjectId)
  companyId: Types.ObjectId;
  @IsMongoId()
  @Type(() => Types.ObjectId)
  @IsOptional()
  userId: Types.ObjectId;
}
export class CreateJobBodyDto implements Partial<IJob> {
  @IsString()
  @IsNotEmpty()
  jobTitle: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50000)
  jobDescription: string;

  @IsArray()
  technicalSkills: string[];
  @IsArray()
  softSkills: string[];

  @IsEnum(JobLocationEnum)
  jobLocation: JobLocationEnum;
  @IsEnum(WorkingTimeEnum)
  workingTime: WorkingTimeEnum;
  @IsEnum(SeniorityLevelEnum)
  seniorityLevel: SeniorityLevelEnum;
}

export class UpdateJobBodyDto implements Partial<IJob> {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  jobTitle: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50000)
  @IsOptional()
  jobDescription: string;

  @IsArray()
  @IsOptional()
  technicalSkills: string[];
  @IsArray()
  @IsOptional()
  softSkills: string[];

  @IsEnum(JobLocationEnum)
  @IsOptional()
  jobLocation: JobLocationEnum;
  @IsEnum(WorkingTimeEnum)
  @IsOptional()
  workingTime: WorkingTimeEnum;
  @IsEnum(SeniorityLevelEnum)
  @IsOptional()
  seniorityLevel: SeniorityLevelEnum;
}

export class GetAllDto {
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsOptional()
  page: number;
  @Type(() => Number)
  @IsPositive()
  @IsNumber()
  @IsOptional()
  size: number;
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  search: string;
}
