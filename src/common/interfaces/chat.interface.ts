import { Types } from "mongoose";
import { IUser } from "./user.interface";
import { ISocketAuth } from "../utils";
import { Server } from "socket.io";

export interface IChatHistory {
  message: string;
  senderId: Types.ObjectId;
  _id: Types.ObjectId;
}
export interface ISendMessage {
  socket: ISocketAuth;
  io: Server;
  receiverId: string;
  message: string;
}
export interface IMessages {
  message: string;
  senderId: Types.ObjectId;
}
export interface IChat {
  _id?: Types.ObjectId;
  createdBy: Types.ObjectId;
  senderId: Types.ObjectId | IUser;
  receiverId: Types.ObjectId | IUser;

  messages: IMessages[];

  createdAt?: Date;
  updatedAt?: Date;
}
