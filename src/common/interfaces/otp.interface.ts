import { Types } from "mongoose";
import { TypeEnum } from "../enums";
import { IUser } from "./user.interface";

export interface IOtp {
  _id?: Types.ObjectId;

  code: string;
  expiresIn: Date;
  type: TypeEnum;

  createdAt?: Date;
  updatedAt?: Date;

  createdBy: Types.ObjectId | IUser;
}
