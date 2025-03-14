import axios from "axios";

const prefix = "/authenticate/api/v1/authenticate"
class AuthenticateService {
    checkLogin = async (email: string, password: string) => {
        return await axios.post(`http://192.168.100.6:8081/authenticate/api/v1/authenticate/login?email=${email}&password=${password}`)
    }
}

export default AuthenticateService;