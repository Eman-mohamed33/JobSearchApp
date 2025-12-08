import { Types } from 'mongoose';
import { IPicture, IUser } from './user.interface';

export interface ICompany {
  _id?: Types.ObjectId;
  createdBy: Types.ObjectId | IUser;
  hRs: Types.ObjectId[] | IUser[];

  companyName: string;
  description: string;
  industry: string;
  address: string;
  numberOfEmployees: number;
  companyEmail: string;

  logo: IPicture;
  coverPic: IPicture[];
  legalAttachment: IPicture;

  approvedByAdmin: boolean;

  deletedAt?: Date;
  bannedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
