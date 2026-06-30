import User from "../../users/models/User.js";
import organizationService from "../../organization/services/organizationService.js";

import {

    ConflictError,

    BadRequestError,

    NotFoundError,

} from "../../../shared/errors";

import {

    hashPassword,

    comparePassword,

} from "../utils/password.js";

import {

    generateAccessToken,

} from "../utils/jwt.js";
import { USER_ROLE, USER_STATUS } from "../../users/constants/userConstants.js";
import userService from "../../users/services/userService.js";

class AuthService {

    async register(registrationData) {

        const organization =
            await this.getOrganization(
                registrationData.organizationCode
            );

        this.validateRegistrationPolicy(

            organization

        ); 
        
        this.validateEmailDomain(

            organization,

            registrationData.email

        );

        await this.ensureUserDoesNotExist(

            registrationData.email

        );

        const hashedPassword =

            await hashPassword(

                registrationData.password

            );

        return await this.createUser(

            registrationData,

            organization,

            hashedPassword

        );
    }

    async getOrganization( organizationCode ){

        const organization =

            await organizationService

            .getOrganizationByCode(

                organizationCode

            );

        if(!organization){

            throw new NotFoundError(

                "Organization not found."

            );

        }

        return organization;

    }

    validateRegistrationPolicy( organization ){

        if(

            !organization.settings?.allowStudentRegistration

        ){

            throw new BadRequestError(

                "Student registration is disabled."

            );

        }

    }
    
    validateEmailDomain( organization, email ){

        const domain =

            email

            .split("@")[1]

            .toLowerCase();

        const valid =

            organization.emailDomains.some(
                allowedDomain => 
                    allowedDomain.toLowerCase() === domain
            );

        if(!valid){

            throw new BadRequestError(

                "Email domain is not allowed."

            );
        }
    }

    async ensureUserDoesNotExist( email ){

        const user =

            await userService.getUserByEmail({

                email

            });

        if(user){

            throw new ConflictError(

                "Email already registered."

            );

        }

    }

    async createUser( registrationData, organization, hashedPassword ){

        const user = await userService.createUser({

            organization:

                organization._id,

            name:

                registrationData.name,

            email:

                registrationData.email,

            auth:{

                password:

                    hashedPassword,

            },

            role:USER_ROLE.STUDENT,

            status: USER_STATUS.PENDING,

        });

        return await userService.getUserById(
            user._id
        )
        .populate(
            "organization",
            "name code"
        );

    }

    async login(credentials) {

    }

}

export default new AuthService();