import { Body, Controller, Get, Param, Patch, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatService, IChatHistory } from "./chat.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleEnum } from "src/common/enums/user.enum";
import { IResponse, successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { ChatBodyDto, ChatParamDto } from "./dto/chat.dto";
import { ChatHistoryResponse, ChatResponse } from "./entities/chat.entity";
import { GetAllDto } from "../job/dto/job.dto";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) { }
    
    @Auth([RoleEnum.User])
    @Get("/:chatId")
    async getChat(
        @User() user: UserDocument,
        @Param() param: ChatParamDto,
        @Query() query: GetAllDto,
    ): Promise<IResponse<{ chatHistory: IChatHistory[] }>> {
        const chatHistory = await this.chatService.getChat(user, param.chatId, query);
        return successResponse<{ chatHistory: IChatHistory[] }>({ status: 200, data: { chatHistory } });
    }

}