import { Types } from 'mongoose';
import { ICompany } from './company.interface';
import { IUser } from './user.interface';
import { JobLocationEnum, SeniorityLevelEnum, WorkingTimeEnum } from '../enums';

export interface IJob {
  _id?: Types.ObjectId;
  companyId: Types.ObjectId | ICompany;
  addedBy: Types.ObjectId | IUser;
  updatedBy: Types.ObjectId | IUser;

  jobTitle: string;
  jobDescription: string;
  technicalSkills: string[];
  softSkills: string[];

  closed: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  jobLocation: JobLocationEnum;
  workingTime: WorkingTimeEnum;
  seniorityLevel: SeniorityLevelEnum;
}
