import { IChat } from "src/common";
import { IChatHistory } from "../chat.service";

export class ChatResponse {
  chat: IChat;
}
export class ChatHistoryResponse {
  chatHistory: IChatHistory;
}
