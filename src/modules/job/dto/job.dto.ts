import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, MinLength } from "class-validator";
import { IApplication, IJob, JobLocationEnum, SeniorityLevelEnum, WorkingTimeEnum } from "src/common";

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
  @IsString()
  technicalSkills: string[];
  @IsArray()
  @IsString()
  softSkills: string[];

  @IsEnum(JobLocationEnum)
  jobLocation: JobLocationEnum;
  @IsEnum(WorkingTimeEnum)
  workingTime: WorkingTimeEnum;
  @IsEnum(SeniorityLevelEnum)
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
