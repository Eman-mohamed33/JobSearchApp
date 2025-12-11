import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Types } from "mongoose";
import { Server, Socket } from "socket.io";
import { getSocketAuth, User, type ISocketAuth } from "src/common";
import { Auth } from "src/common/decorators/auth.decorator";
import { TokenEnum } from "src/common/enums/token.enum";
import { RoleEnum } from "src/common/enums/user.enum";
import { TokenService } from "src/common/services/token.service";
import { connectedSockets, type UserDocument } from "src/DB/models/user.model";
@WebSocketGateway({
    cors: {
        origin: "*",
    },
})
    //, OnGatewayConnection, OnGatewayDisconnect
export class RealTimeGateway implements OnGatewayInit , OnGatewayConnection, OnGatewayDisconnect{
    @WebSocketServer()
    private readonly server: Server;
    constructor(private readonly tokenService: TokenService,
    ) { }
    afterInit(server: Server) {
        console.log("RealTime gateway Started ✨");
        server.on("connection", (socket: Socket) => {
            console.log(socket.id);
        });
    }

     handleConnection(client: ISocketAuth) {
       // try{
        //  const authorization = getSocketAuth(client);

        // console.log(authorization);
        // const { user, decoded } = await this.tokenService.decodeToken({ authorization, tokenType: TokenEnum.Access });
        //     console.log({ user, decoded });
        //     const userTabs = connectedSockets.get(user._id.toString()) || [];
        //     userTabs.push(client.id);
        //     connectedSockets.set(user._id.toString(), userTabs);
        //     client.credentials = { user, decoded };
        //     console.log({ userTabs, connectedSockets });
            
        // } catch (error) {
        //     client.emit("exception", error.message || "something went wrong");
            // }
          console.log('Client connected:', client.id);
    }


    //@Auth([RoleEnum.User])
    @SubscribeMessage("sayHi")
    sayHi(
        // @ConnectedSocket() client: ISocketAuth,
        // @MessageBody() data: any,
      //  @User() user: UserDocument
    ) {
        console.log("send");      
      // client.emit("sayHi", "Nest To FE");
        //this.server.emit("sayHi", "Oml");
    //this.server.emit("sayHi", { name: "EmanGesraha❤️❤️❤️❤️❤️❤️❤️" });
      console.log("Sending test sayHi to all sockets");
            this.server.emit("sayHi", { name: "test" });
  
       // this.server.emit("sayHi", { name: "eman" });

        console.log("SENDING sayHi now");
      //  client.broadcast.emit("sayHi", "From Nest To All Except message sender");
        
      // return "received Date"
    }

    
    handleDisconnect(client: Socket) {
        //  const userId = client.credentials?.user._id?.toString() as string;
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


    // welcome() {
    //     this.server.emit("welcome", "Oml");
    // }
   
    // @Auth([RoleEnum.User])
    // @SubscribeMessage("submittedApplication")
    // NotifyTheHr(
    //     @User() user: UserDocument,
    //     hrId: Types.ObjectId,
    // ) {
    //     this.server.to(connectedSockets.get(hrId.toString()) as string[]).emit("submittedApplication", { from: user._id });
    // }
    

}