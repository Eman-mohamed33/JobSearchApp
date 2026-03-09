import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { getSocketAuth, User, type ISocketAuth } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { TokenEnum } from "src/common/enums/token.enum";
import { RoleEnum } from "src/common/enums/user.enum";
import { TokenService } from "src/common/services/token.service";
import { connectedSockets, type UserDocument } from "src/DB/models/user.model";
import { ChatService } from "../chat/chat.service";
@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
    //, OnGatewayConnection, OnGatewayDisconnect
export class RealTimeGateway implements OnGatewayInit , OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    private readonly server: Server;
   // private readonly chatService: ChatService
    constructor(private readonly tokenService: TokenService,
    ) { }
    afterInit(server: Server) {
        console.log("RealTime gateway Started ✨");
        server.on("connection", (socket: Socket) => {
            console.log(socket.id);
        });
    }

    async handleConnection(client: ISocketAuth) {
      try{
         const authorization = getSocketAuth(client);

        console.log({authorization});
        const { user, decoded } = await this.tokenService.decodeToken({ authorization, tokenType: TokenEnum.Access });
            console.log("User,decode",{ user, decoded });
            const userTabs = connectedSockets.get(user._id.toString()) || [];
            userTabs.push(client.id);
            connectedSockets.set(user._id.toString(), userTabs);
           client.credentials = { user, decoded };
          console.log("User Connected:", client.id);
            const userId = user?._id?.toString() as string;
        if (userId) {
        client.join(userId.toString()); // هنا بنعمل الأوضة برقم الـ ID
        console.log(`User ${userId} joined their private room`);
        }
            //this.j();
            //console.log({ userTabs, connectedSockets });
         
          
          // client.join(`user_${user._id.toString() as string}`);
      } catch (error) {
           client.emit("exception", error.message || "something went wrong");
            }
          console.log('Client connected:', client.id);
    }


    @Auth([RoleEnum.User])
    @SubscribeMessage("sendMessage")
    sayHi(
         @ConnectedSocket() client: ISocketAuth,
        @MessageBody() data: any,
      //  @User() user: UserDocument
    ) {
        console.log({ data });
        client.emit("receiveMessage",{
        sender: "Server",    // بدل msg خليها sender
        message: "man"       // بدل receivedData خليها message
    }
        );
       return "received Date"
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

//     j() {
//         console.log("J function is running");
//         console.log("Emitting Notification...")
//         this.server.sockets.emit("SubmittingNotification", {
//     title: "تقديم جديد على وظيفة!",
//     message: "قام أحمد محمد بالتقديم على وظيفة Frontend Developer",
//     payload: {
//         applicationId: "APP_9955",
//         jobId: "JOB_101"
//             }
    
// });
//     }

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

    async send_Messages(
         
            senderId: string,
            receiverId: string,
        message: string,
        socket: ISocketAuth
        
    ) {
        // this.server.to(receiverId).on("sendMessages", { senderId, receiverId, messages });
     //   await this.chatService.sendMessagesBetweenHrAndUser(socket.credentials.user,receiverId, message);
         this.server?.to(connectedSockets.get(senderId) as string[]).emit("successMessage", { message });
         

            this.server?.to(connectedSockets.get(receiverId) as string[]).emit("newMessage", { message, from: socket.credentials?.user });
         
    }
   

}