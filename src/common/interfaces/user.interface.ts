import { Types } from 'mongoose';
import { GenderEnum, ProviderEnum, RoleEnum } from '../enums';
import { IOtp } from './otp.interface';

export interface IPicture {
  secure_url: string;
  public_id: string;
}
export interface IUser {
  _id?: Types.ObjectId;
  updatedBy?: Types.ObjectId | IUser;

  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  password?: string;
  mobileNumber: string;
  isConfirmed?: boolean;

  DOB: Date;
  deletedAt?: Date;
  bannedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  changeCredentialTime?: Date;

  profilePic: IPicture;
  coverPic: IPicture;

  role: RoleEnum;
  provider: ProviderEnum;
  gender: GenderEnum;

  otp: Types.ObjectId[] | IOtp[];
}
