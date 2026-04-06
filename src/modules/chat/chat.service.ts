import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { ChatDocument, ChatRepository, CompanyRepository, lean } from "src/DB";
import { connectedSockets, UserDocument } from "src/DB/models/user.model";
import { UserRepository } from "src/DB/repositories/user.repository";
import { ISocketAuth } from "src/common";
import { Server } from "socket.io";
import { GetAllDto } from "../job/dto/job.dto";

export interface IChatHistory {
    message: string;
    senderId: Types.ObjectId;
    _id: Types.ObjectId;
}
export interface ISendMessage {
    socket: ISocketAuth,
    io: Server,
    receiverId: string,
    message: string
};
@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
         private readonly userRepository: UserRepository,
        // private readonly jobRepository: JobRepository,
        // private readonly applicationRepository: ApplicationRepository,
         private readonly companyRepository: CompanyRepository,


    ) { }
    
    async getChat(user: UserDocument, chatId: Types.ObjectId, query: GetAllDto):
        Promise<IChatHistory[]> {
        const { size, page } = query;
        const skip = (page - 1) * size;
        console.log( typeof chatId);
        
        const chatID = new Types.ObjectId(chatId);
         console.log( typeof chatId);
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

    async sendMessagesBetweenHrAndUser({ socket, io, receiverId, message }: ISendMessage) {
try {
        console.log("Socket : ", socket);

        const createdBy = socket.credentials.user._id;
        console.log("CreatedBY :", createdBy);

        const checkCreatedBy = await this.companyRepository.findOne({
            filter: {
                $or: [
                    createdBy,
                    { hRs: createdBy },
                ]
            }
        });

        if (!checkCreatedBy) {
            throw new BadRequestException("user not Company Owner or Company Hrs");
        }

        const user = await this.userRepository.findOne({
            filter: {
                _id: Types.ObjectId.createFromHexString(receiverId),
            }
        });

        if (!user) {
            throw new NotFoundException("User not found");
        }


        const chat = await this.chatRepository.findOneAndUpdate({
            filter: {
                $or: [
                    { senderId: createdBy },
                    { receiverId: Types.ObjectId.createFromHexString(receiverId) }

                ]
                
            },
            update: {
                senderId: createdBy,
                receiverId: Types.ObjectId.createFromHexString(receiverId),
                $addToSet: {
                    messages: [{
                        message,
                        senderId: createdBy,
                    }]
                }
               
            }
        });

    

        if (!chat) {
        
            const newChat = await this.chatRepository.create({
                data: [{
                    senderId: createdBy,
                    receiverId: Types.ObjectId.createFromHexString(receiverId),
                    messages: [{
                        senderId: createdBy,
                        message,
                    }]
                }]
            });
           
            if (!newChat) {
                throw new BadRequestException("Fail to create chat");
            }
        }

        io?.to(connectedSockets.get(createdBy.toString()) as string[]).emit("successMessage", { message });
        io?.to(connectedSockets.get(receiverId) as string[]).emit("newMessage", { message, from: socket.credentials.user });

        
} catch (error) {
    console.error("الخطأ الحقيقي ظهر هنا 🔥:", error);
        throw new InternalServerErrorException(error.message);
}
    
    }


}
