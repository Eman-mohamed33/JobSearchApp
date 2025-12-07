import { Types } from 'mongoose';
import { IUser } from './user.interface';

export interface IMessages {
  message: string;
  senderId: Types.ObjectId;
}
export interface IChat {
  _id?: Types.ObjectId;

  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;

  messages: IMessages[];

  createdAt?: Date;
  updatedAt?: Date;
}
