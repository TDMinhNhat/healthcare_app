import axios from "axios";

const PORT: number = 8081;
const URL: string = `http://localhost:${PORT}/authenticate/api/v1/register`;

const userModel = {
    addUser: async (firstName: string, lastName: string, sex: boolean, phone: string, dob: string, username: string, email: string, password: string, address: object) => {
        return await axios({
            method: "post",
            url: URL,
            data: {
                firstName: firstName,
                lastName: lastName,
                sex: sex,
                dob: dob,
                phone: phone,
                username: username,
                email: email,
                password: password,
                address: address
            }
        })
    },

    sendOtpMessage: async (email: string) => {
        const getURL = `${URL}/otp`
        return await axios({
            method: "get",
            url: getURL,
            params: {
                email: email
            }
        })
    },

    verifyOtpMessage: async (userId: number, otp: string) => {
        const getURL = `${URL}/active/${userId}`
        return await axios({
            method: "get",
            url: getURL,
            params: {
                "otpMessage": otp
            }
        })
    }
}

export default userModel;