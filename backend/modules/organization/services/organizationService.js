import Organization from "../models/Organization.js";
import {ConflictError, NotFoundError } from "../../../shared/errors";

class OrganizationService {

    /**
     * Create a new organization.
     *
     * @param {Object} organizationData
     * @returns {Promise<Organization>}
     */
    async createOrganization(

        organizationData

    ) {

        const existingOrganization =

            await Organization.findOne({

                code: organizationData.code,

            });

        if (existingOrganization) {

            throw new ConflictError(

                "Organization code already exists."

            );

        }

        return await Organization.create(

            organizationData

        );

    }

    /**
     * Get organization by ID.
     *
     * @param {string} organizationId
     * @returns {Promise<Organization>}
     */
    async getOrganizationById(

        organizationId

    ) {
        const organization =

            await Organization.findById(

                organizationId

            );

        if (!organization) {

            throw new NotFoundError(

                "Organization not found."

            );

        }

        return organization;
    }

    /**
     * Get organization by unique code.
     *
     * @param {string} code
     * @returns {Promise<Organization>}
     */
    async getOrganizationByCode(

        code

    ) {

        return await Organization.findOne({

            code,

        });

    }

    /**
     * Get all organizations.
     *
     * @returns {Promise<Organization[]>}
     */
    async getOrganizations() {

        return await Organization.find()

            .sort({

                createdAt: -1,

            });

    }

}

export default new OrganizationService();