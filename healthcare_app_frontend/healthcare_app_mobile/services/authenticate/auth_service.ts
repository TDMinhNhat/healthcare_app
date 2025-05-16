import axiosConfig from "../axiosConfig";

const prefix = "/authenticate/api/v1/authenticate";
export const login = async (email: string, password: string) => {
  const response = await axiosConfig.post(prefix + "/login", null, {
    params: {
      email: email,
      password: password,
    },
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
  username: string,
  sex: boolean,
  dob: string,
  phone: string,
  faceEncodeValue: string
) => {
  const response = await axiosConfig.post(prefix + "/register", {
    firstName,
    lastName,
    email,
    password,
    username,
    sex,
    dob,
    phone,
    faceEncodeValue,
  });
  return response;
};

export const resetPassword = async (email: string) => {
  const response = await axiosConfig.post(prefix + "/reset_password", null, {
    params: { email },
  });
  return response;
};
