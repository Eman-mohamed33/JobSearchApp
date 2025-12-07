import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IChat, IMessages } from 'src/common';

@Schema({
  timestamps: true,
})
export class Messages implements IMessages {
  @Prop({ type: String, required: true })
  message: string
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  senderId: Types.ObjectId
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
  },
  toObject: {
    virtuals: true,
  },
  strictQuery: true,
})
export class Chat implements IChat {
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  senderId: Types.ObjectId
  @Prop({ type: Types.ObjectId, ref: "User", required: true })
  receiverId: Types.ObjectId
  @Prop([{ type: Messages, required: true }])
  messages: Messages[]
}

export type ChatDocument = HydratedDocument<Chat>;
const chatSchema = SchemaFactory.createForClass(Chat);
export const ChatModel = MongooseModule.forFeature([
  {
    name: Chat.name,
    schema: chatSchema,
  },
]);
