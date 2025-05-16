import { Address } from "./address";
import { AuthenticateProvider } from "./auth";
import { Disease } from "./typeDisease";

export interface User {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  sex: boolean;
  dob: string; // Using Date for LocalDate
  address?: Address;
  phone: string;
  avatar?: string;
  email: string;
  emailVerify?: boolean;
  password: string;
  authProvider?: AuthenticateProvider;
  status: boolean;
  typeDisease?: Disease; // Array of Disease objects
}

// Helper function to calculate age
export const getAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

// Do admin không khác biệt nhiều so với User
export type Admin = User;
