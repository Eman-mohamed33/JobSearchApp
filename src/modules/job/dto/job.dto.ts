import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";
import { Types } from "mongoose";
import { IJob, JobLocationEnum, SeniorityLevelEnum, WorkingTimeEnum } from "src/common";

export class CreateJobBodyDto implements Partial<IJob> {
  @IsMongoId()
  companyId: Types.ObjectId;
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
