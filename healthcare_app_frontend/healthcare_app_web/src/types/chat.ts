import { Room } from "./room";

export interface ChatMessage {
  id: number;
  message: string;
  room: Room;
  reply: ChatMessage | null;
  isRecall: boolean;
  createdAt: string;
  updatedAt: string;
}
