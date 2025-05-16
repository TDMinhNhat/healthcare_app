import { Room } from "./room";

export interface ChatMessage {
  sender: string;
  message: string;
  timestamp: number;
  id: number;
  room: Room;
  reply: ChatMessage | null;
  isRecall: boolean;
  createdAt: string;
  updatedAt: string;
}
