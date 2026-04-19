import { Body, Controller, Get, Param, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleEnum } from "src/common/enums/user.enum";
import { IChatHistory, IResponse, successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { ChatParamDto } from "./dto/chat.dto";
import { GetAllDto } from "../job/dto/job.dto";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) { }
    
    @Auth([RoleEnum.User, RoleEnum.Admin])
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