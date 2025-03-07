import axiosConfig from "./axiosConfig.ts";

const prefix: string = "/authenticate/api/v1/type_disease";

export const getAllTypeDiseases = async () => {
    return axiosConfig.get(`${prefix}`);
}