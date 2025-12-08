import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { UserDocument } from "src/DB/models/user.model";
import { TokenEnum } from "../enums/token.enum";

export interface IToken {
  _id?: Types.ObjectId;
  jti: string;
  expiredAt: Date;
  createdBy: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface ICredentials {
  user: UserDocument;
  decoded: JwtPayload;
}

export interface IAuthRequest extends Request {
  credentials: ICredentials;
  tokenType?: TokenEnum;
}
