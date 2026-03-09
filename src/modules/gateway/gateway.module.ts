import { Module } from "@nestjs/common";
import { RealTimeGateway } from "./gateway";
import { ChatService } from "../chat/chat.service";

@Module({
  providers: [RealTimeGateway,
  //ChatService
  ],
})
export class RealTimeModule {}
