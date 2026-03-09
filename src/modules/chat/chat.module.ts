import { Module } from "@nestjs/common";
import { ChatModel, ChatRepository } from "src/DB";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { RealTimeGateway } from "../gateway/gateway";

@Module({
  imports: [ChatModel],
  controllers: [ChatController],
  providers: [ChatRepository, ChatService, RealTimeGateway],
  exports: [],
})
export class ChatModule {}
