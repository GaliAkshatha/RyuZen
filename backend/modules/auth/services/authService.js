import registrationService from "./registrationService.js";

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

        // Coming next

    }

}

export default new AuthService();