import registrationService from "./registrationService.js";
import loginService from "./loginService.js";

class AuthService {

    async register(

        registrationData

    ) {

        return await registrationService.register(

            registrationData

        );

    }

    async login(

        credentials

    ) {

        return await loginService.login(

            credentials

        );

    }

}

export default new AuthService();