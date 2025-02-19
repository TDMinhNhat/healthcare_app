import AuthenticateModel from "../models/authenticate.model.ts";

class AuthenticateController {

    private model: AuthenticateModel;

    constructor() {
        this.model = new AuthenticateModel();
    }

    public async loginStandard(username: string, password: string) {
        return await this.model.loginStandard(username, password);
    }

}

export default AuthenticateController;