import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Types } from "mongoose";
import { ApplicationRepository, ChatDocument, ChatRepository, CompanyRepository, JobRepository, lean } from "src/DB";
import { UserDocument } from "src/DB/models/user.model";
import { UserRepository } from "src/DB/repositories/user.repository";
import { ChatBodyDto } from "./dto/chat.dto";

@Injectable()
export class ChatService {
    constructor(
        private readonly chatRepository: ChatRepository,
        // private readonly userRepository: UserRepository,
        // private readonly jobRepository: JobRepository,
        // private readonly applicationRepository: ApplicationRepository,
        // private readonly companyRepository: CompanyRepository,


    ) { }
    
    async getChat(user: UserDocument, userId: Types.ObjectId):
        Promise<ChatDocument | lean<ChatDocument>> {
    
        const chat = await this.chatRepository.findOne({
            filter: {
                senderId: user._id,
                receiverId: userId,
            }
        });

        if (!chat) {
            throw new BadRequestException("Fail to find this chat");
        }
      
        return chat;
    }

    // async sendMessagesBetweenHrAndUser(sender: UserDocument, receiverId: string, message:string){

     
    //     if (!(await this.userRepository.findOne({
    //         filter: {
    //             _id: sender._id,
    //         }
    //     }))) {
    //         throw new NotFoundException("User not found");
    //     }


    //     const chat = await this.chatRepository.findOneAndUpdate({
    //         filter: {
    //             $or: [
    //                 { senderId: sender._id },
    //                 { receiverId: sender._id }

    //             ]
                
    //         },
    //         update: {
    //                senderId: sender._id,
    //             receiverId,
    //             $addToSet: {
    //                 messages: [{
    //                     message,
    //                     senderId: sender._id,
    //                     }]
    //                 }
               
    //         }
    //     });

    

    //     if (!chat) {
    //           const company = await this.companyRepository.findOne({
    //         filter: {
    //             $or: [
    //                 { createdBy: sender._id },
    //                 { hRs: sender._id },
    //             ]
    //         }
    //     });
        
    //         if (!company) {
    //             throw new BadRequestException("user not Company Owner or Company Hrs")
    //         }
    //         const newChat = await this.chatRepository.create({
    //             data: [{
    //                 senderId: sender._id,
    //                 receiverId,
    //                 messages: [{
    //                     senderId: sender._id,
    //                     message,
    //                 }]
    //             }]
    //         });
           
    //     }
        
    // }


}