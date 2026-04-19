import { BadRequestException, Injectable } from "@nestjs/common";
import { Types } from "mongoose";
import { ChatRepository } from "src/DB";
import { UserDocument } from "src/DB/models/user.model";
import { GetAllDto } from "../job/dto/job.dto";
import { IChatHistory } from "src/common";


@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
    ) { }
    
    async getChat(user: UserDocument, chatId: Types.ObjectId, query: GetAllDto):
        Promise<IChatHistory[]> {
        const { size, page } = query;
        const skip = (page - 1) * size;
        
        const chatID = new Types.ObjectId(chatId);
        const chat = await this.chatRepository.aggregate({
            pipeline: [
                {
                    $match: { _id: chatID },
                },{
                    $project: {
                        messages: { $slice: ["$messages", skip, size] },
            senderId: 1,
            receiverId: 1
                    }
                }
            ]
        })

        if (!chat) {
            throw new BadRequestException("Fail to find this chat");
        }
      
        return chat;
    }
}
