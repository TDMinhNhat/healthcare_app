import { Appointment } from "./appointment";

export interface Room {
  id: number;
  appointment: Appointment;
  roomId: string;
  createdAt: string;
}
