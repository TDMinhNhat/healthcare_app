import axiosConfig from "./axiosConfig";

const prefix = "/authenticate/api/v1";
export const login = async (email: string, password: string) => {
  const response = await axiosConfig.post(prefix + "/login", {
    email,
    password,
  });
  return response;
};

export const getUserById = async (id: string | undefined) => {
  if (!id) {
    throw new Error("User ID is required");
  }
  const response = await axiosConfig.get(`${prefix}/users/${id}`);
  return response;
};

export const signUp = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  sex: boolean,
  dateOfBirth: Date
) => {
  const response = await axiosConfig.post(prefix + "/register/mobile", {
    firstName,
    lastName,
    email,
    password,
    sex,
    dateOfBirth,
  });
  return response;
};
