import userModel from "../models/user-model.ts";
import {Dayjs} from "dayjs";

const registerAccountController = {

    addUser: (firstName: string, lastName: string, sex: boolean, phone: string, dob: Dayjs, username: string, email: string, password: string, address: object, imageDetect: string) => {
        const getDob: string = dob.format("DD-MM-YYYY");
        console.log(getDob);
        return userModel.addUser(firstName, lastName, sex, phone, getDob, username, email, password, address, imageDetect);
    },

    sendOtpMessage: (email: string) => {
        return userModel.sendOtpMessage(email);
    },

    verifyOtpMessage: (userId: number, otp: string) => {
        return userModel.verifyOtpMessage(userId, otp);
    }
}

export default registerAccountController;