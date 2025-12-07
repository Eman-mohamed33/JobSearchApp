import { Types } from 'mongoose';
import { IPicture, IUser } from './user.interface';
import { StatusEnum } from '../enums';
import { IJob } from './job.interface';

export interface IApplication {
  _id?: Types.ObjectId;
  userId: Types.ObjectId | IUser;
  jobId: Types.ObjectId | IJob;

  userCv: IPicture;
  status: StatusEnum;

  createdAt?: Date;
  updatedAt?: Date;
}
