import { Room } from "./room";
import { ChatMessage } from "./chat";

export interface Call {
  id: number;
  room: Room;
  chatMessage: ChatMessage;
  start: string;
  end: string;
  createdAt: string;
}
