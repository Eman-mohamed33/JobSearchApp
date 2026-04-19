import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { getSocketAuth, type ISocketAuth } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { TokenEnum } from "src/common/enums/token.enum";
import { RoleEnum } from "src/common/enums/user.enum";
import { TokenService } from "src/common/services/token.service";
import { connectedSockets } from "src/DB/models/user.model";
import { ChatService } from "../chat/chat.service";
import { ChatRepository, CompanyRepository } from "src/DB";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { UserRepository } from "src/DB/repositories/user.repository";
@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
    //, OnGatewayConnection, OnGatewayDisconnect
export class RealTimeGateway implements OnGatewayInit , OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    private readonly server: Server;
    constructor(private readonly companyRepository: CompanyRepository,
        private readonly chatRepository: ChatRepository,
        private readonly chatService: ChatService,
        private readonly tokenService: TokenService,
               private readonly userRepository: UserRepository,
    ) { }
    afterInit() {
        console.log("RealTime gateway Started ✨");
    }

    async handleConnection(client: ISocketAuth) {
        try {
            const authorization = getSocketAuth(client);
            const { user, decoded } = await this.tokenService.decodeToken({ authorization, tokenType: TokenEnum.Access });
            const userTabs = connectedSockets.get(user._id.toString()) || [];
            userTabs.push(client.id);
            connectedSockets.set(user._id.toString(), userTabs);
            client.credentials = { user, decoded };
            const userId = user?._id?.toString();
            if (userId) {
                client.join(userId.toString());
            }
        } catch (error) {
            client.emit("exception", error.message || "something went wrong");
        }
         
    }
    
    handleDisconnect(client: Socket) {
        // const userId = client.credentials?.user._id?.toString() as string;
        // if (userId) {
        // client.join(userId.toString()); // هنا بنعمل الأوضة برقم الـ ID
        // console.log(`User ${userId} joined their private room`);
        // }
        
        // const remainingTabs = connectedSockets.get(userId)?.filter(tab => {
        //     return tab !== client.id;
        // });

        // if (remainingTabs?.length) {
        //     connectedSockets.set(userId, remainingTabs);
        // } else {
        //     connectedSockets.delete(userId);
        //     this.server.emit("offline_user", userId);
        // }

        // console.log({ afterDisconnect: connectedSockets });
            // console.log(`Logout ::: ${client.id}`);
             console.log('Client disconnected:', client.id);
    }


    Submitting_Notification(hrId: string,
        notification: {
            title: string,
            message: string,
            payload: {
                jobId: Types.ObjectId,
                applicationId: Types.ObjectId,
                seekerId: Types.ObjectId
            },
            timestamp: Date,
        }) {
        this.server.to(hrId.toString()).emit("SubmittingNotification", notification);
    }

    @Auth([RoleEnum.User, RoleEnum.Admin])
    @SubscribeMessage("sendMessage")
    async sendMessagesBetweenHrAndUser(@ConnectedSocket() client: ISocketAuth,
        @MessageBody() data: { message: string, receiverId: string }) {
        const createdBy = client.credentials.user._id;
        const checkCreatedBy = await this.companyRepository.findOne({
            filter: {
                $or: [
                    { createdBy: createdBy },
                    { hRs: createdBy },
                ]
            }
        });

        const isReceiverCompanyStaff = await this.companyRepository.findOne({
            filter: {
                $or: [
                    { createdBy: Types.ObjectId.createFromHexString(data.receiverId) },
                    { hRs: Types.ObjectId.createFromHexString(data.receiverId) },
                ]
            }
        });
        
        
        if (!checkCreatedBy && !isReceiverCompanyStaff) {
            throw new BadRequestException("user not Company Owner or Company Hrs");
        }

        const user = await this.userRepository.findOne({
            filter: {
                _id: Types.ObjectId.createFromHexString(data.receiverId),
            }
        });
        
        if (!user) {
            throw new NotFoundException("User not found");
        }
        

        const chat = await this.chatRepository.findOneAndUpdate({
            filter: {
                $or: [
                    { senderId: createdBy, receiverId: Types.ObjectId.createFromHexString(data.receiverId) },
                    { senderId: Types.ObjectId.createFromHexString(data.receiverId), receiverId: createdBy }
                ]
                
            },
            update: {
                senderId: createdBy,
                receiverId: Types.ObjectId.createFromHexString(data.receiverId),
                $addToSet: {
                    messages: [{
                        message: data.message,
                        senderId: createdBy,
                    }]
                }
               
            }
        });


        if (!chat) {
        
            const newChat = await this.chatRepository.create({
                data: [{
                    createdBy,
                    senderId: createdBy,
                    receiverId: Types.ObjectId.createFromHexString(data.receiverId),
                    messages: [{
                        senderId: createdBy,
                        message: data.message,
                    }]
                }]
            });
           
            if (!newChat) {
                throw new BadRequestException("Fail to create chat");
            }
             
        }
        
        this.server.to(connectedSockets.get(createdBy.toString()) as string[]).emit("successMessage", { message: data.message });
        
        this.server.to(connectedSockets.get(data.receiverId) as string[]).emit("newMessage", { message: data.message, from: client.credentials.user });
    }

}
