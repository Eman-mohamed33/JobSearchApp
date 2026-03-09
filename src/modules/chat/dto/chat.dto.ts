import { IsMongoId, IsNotEmpty, IsString, Validate } from "class-validator";
import { Types } from "mongoose";
import { IChat, IMessages } from "src/common";

export class ChatParamDto {
  @IsMongoId()
  chatId: Types.ObjectId;
}

export class MessagesBodyDto implements IMessages {
  @IsString()
  @IsNotEmpty()
  message: string;
  @IsMongoId()
  senderId: Types.ObjectId;
}

export class ChatBodyDto implements Partial<IChat> {
  @Validate(MessagesBodyDto)
  messages: IMessages[];
}
