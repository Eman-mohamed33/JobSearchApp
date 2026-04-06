import { Module } from "@nestjs/common";
import { RealTimeGateway } from "./gateway";
import { ChatModel, ChatRepository, CompanyModel, CompanyRepository } from "src/DB";
import { UserModel } from "src/DB/models/user.model";
import { TokenService } from "src/common/services/token.service";
import { ChatModule } from "../chat/chat.module";
import { UserRepository } from "src/DB/repositories/user.repository";
@Module({
  imports: [ChatModel, UserModel, CompanyModel, ChatModule],

  providers: [
    RealTimeGateway,
    // ChatService,
  ChatRepository,
   UserRepository,
   CompanyRepository,
    TokenService,
  ],
  exports: [RealTimeGateway],
})
export class RealTimeModule {}
