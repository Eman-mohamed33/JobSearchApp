import { Body, Controller, Get, Param, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Auth } from "src/common/decorators/auth.decorator";
import { RoleEnum } from "src/common/enums/user.enum";
import { IResponse, successResponse, User } from "src/common";
import { type UserDocument } from "src/DB/models/user.model";
import { ChatBodyDto, ChatParamDto } from "./dto/chat.dto";
import { ChatResponse } from "./entities/chat.entity";

@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("chat")
export class ChatController {
    constructor(private readonly chatService: ChatService) { }
    
    @Auth([RoleEnum.User])
    @Get("/:chatId")
    async getChat(
        @User() user: UserDocument,
        @Param() param: ChatParamDto,
    ): Promise<IResponse<ChatResponse>> {
        const chat = await this.chatService.getChat(user, param.chatId);
        return successResponse<ChatResponse>({ status: 200, data: { chat } });
    }

    // @Auth([RoleEnum.Admin, RoleEnum.User])
    // @Patch("send-messages")
    // async sendMessagesBetweenHrAndUser(
    //     @User() user: UserDocument,
    //     @Body() body: ChatBodyDto,
    // )
    // : //Promise<IResponse<ChatResponse>> {
    //     //const chat = await this.chatService.sendMessagesBetweenHrAndUser(user, body);
    //     // return successResponse<ChatResponse>({ status:200, data: { chat } });
    // }
}