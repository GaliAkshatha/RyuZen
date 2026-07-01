import organizationService from "../../organization/services/organizationService.js";
import userService from "../../users/services/userService.js";

import {
    ConflictError,
    BadRequestError,
    NotFoundError,
} from "../../../shared/errors/index.js";

import passwordService from "./passwordService.js";

import {
    USER_ROLE,
    USER_STATUS,
} from "../../users/constants/userConstants.js";

class RegistrationService {

    async register(registrationData) {

        const organization =
            await this.getOrganization(
                registrationData.organizationCode
            );

        this.validateRegistrationPolicy(
            organization
        );

        await this.ensureUserDoesNotExist(
            registrationData.email
        );

        this.validateEmailDomain(
            organization,
            registrationData.email
        );

        const hashedPassword =
            await passwordService.hashPassword(
                registrationData.password
            );

        const userData = this.buildUserData(
            registrationData,
            organization,
            hashedPassword
        );

        return await userService.createUser(
            userData
        );

    }

    async getOrganization(
        organizationCode
    ) {

        const organization =
            await organizationService.getOrganizationByCode(
                organizationCode
            );

        if (!organization) {

            throw new NotFoundError(
                "Organization not found."
            );

        }

        return organization;

    }

    validateRegistrationPolicy(
        organization
    ) {

        if (
            !organization.settings?.allowStudentRegistration
        ) {

            throw new BadRequestError(
                "Student registration is disabled."
            );

        }

    }

    validateEmailDomain(
        organization,
        email
    ) {

        const domain =
            email
                .split("@")[1]
                .toLowerCase();

        const valid =
            organization.emailDomains.some(

                allowedDomain =>

                    allowedDomain.toLowerCase() === domain

            );

        if (!valid) {

            throw new BadRequestError(
                "Email domain is not allowed."
            );

        }

    }

    async ensureUserDoesNotExist(
        email
    ) {

        const user =
            await userService.getUserByEmail(
                email
            );

        if (user) {

            throw new ConflictError(
                "Email already registered."
            );

        }

    }

    buildUserData(
        registrationData,
        organization,
        hashedPassword
    ) {

        return {

            organization:
                organization._id,

            name:
                registrationData.name,

            email:
                registrationData.email,

            auth: {

                password:
                    hashedPassword,

            },

            role:
                USER_ROLE.STUDENT,

            status:
                USER_STATUS.PENDING,

        };

    }

}

export default new RegistrationService();