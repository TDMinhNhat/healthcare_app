import { axios } from "../axiosConfig";

const prefix = "/authenticate/api/v1/authenticate"
const checkLogin = async (email: string, password: string) => {
    return await axios.post(`${prefix}`, {
        params: {
            "email": email,
            "password": password
        }
    });
}

const register = async (firstName: string, lastName: string, sex: boolean, dob: Date, phone: string, username: string, email: string, password: string){
    return await axios.post(`${prefix}/register`, {
        "firstName": firstName,
        "lastName": lastName,
        "sex": sex,
        "dob": "",
        "phone": phone,
        "username": username,
        "email": email,
        "password": password
    })
}