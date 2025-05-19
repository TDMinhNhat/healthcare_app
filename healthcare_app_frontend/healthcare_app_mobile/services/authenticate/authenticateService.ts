import axiosConfig from "../axiosConfig";

const prefix = "/authenticate/api/v1/authenticate"
class AuthenticateService {
    checkLogin = async (email: string, password: string) => {
        return await axiosConfig({
            method: "post",
            url: `${prefix}/login`,
            params: {
                email: email,
                password: password
            }
        })
    }
}

export default AuthenticateService;