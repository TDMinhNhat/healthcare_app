import axiosConfig from "./axiosConfig";

export const login = async (email: string, password: string) => {
  const response = await axiosConfig.post("/login", { email, password });
  return response;
};

export const getUserById = async (id: string | undefined) => {
  if (!id) {
    throw new Error("User ID is required");
  }
  const response = await axiosConfig.get(`/users/${id}`);
  return response;
};
