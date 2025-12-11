import { Socket } from "socket.io";
import { UserDocument } from "src/DB/models/user.model";
import { JwtPayload } from "jsonwebtoken";

export const getSocketAuth = (client: Socket): string => {
  const authorization =
    client.handshake.auth.authorization ?? client.handshake.headers.authorization;
  if (!authorization) {
    client.emit("exception", "missing authorization");
  }
  return authorization;
};

export interface ISocketAuth extends Socket {
  credentials: {
    user: UserDocument,
    decoded: JwtPayload,
  };
}