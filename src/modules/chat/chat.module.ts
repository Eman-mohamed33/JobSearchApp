import { Module } from "@nestjs/common";
import { ChatModel, ChatRepository, CompanyModel, CompanyRepository } from "src/DB";
import { ChatController } from "./chat.controller";
import { ChatService } from "./chat.service";
import { UserRepository } from "src/DB/repositories/user.repository";
import { UserModel } from "src/DB/models/user.model";

@Module({
  imports: [ChatModel, CompanyModel, UserModel],
  controllers: [ChatController],
  providers: [ChatRepository, ChatService, CompanyRepository, UserRepository],
  exports: [ChatService],
})
export class ChatModule {}
