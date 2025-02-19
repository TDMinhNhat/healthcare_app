import axios from "axios";

class AuthenticateModel {

    private PORT: number = 8081;
    private URL: string = `http://localhost:${this.PORT}`;

    public async loginStandard(email: string, password: string): Promise<object> {
        const getFullURL: string = this.URL + `/authenticate/api/v1/login`;
        return await axios({
            method: "post",
            url: getFullURL,
            params: {
                email: email,
                password: password
            }
        }).then(response => response.data).catch((error) => console.log(error));
    }

}

export default AuthenticateModel;