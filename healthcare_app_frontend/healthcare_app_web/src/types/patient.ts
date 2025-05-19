import { User } from "./user";
import { Address } from "./address";
import { Appointment } from "./appointment";
import { MedicalRecord } from "./medical";

export interface Patient extends User {
  stayAddresses?: Address[]; // Based on the stay relationship (1 - 1..*)
  medicalRecords?: MedicalRecord[]; // Based on the register relationship (1 - 0..*)
  appointments?: Appointment[]; // Based on the have relationship (1 - 0..*)
}
