import mongoose from "mongoose";

import { bootstrapDatabase } from "../bootstrap/database.js";

import { OrganizationModel } from "../domains/organizations/infrastructure/persistence/OrganizationModel.js";
import { UserModel } from "../domains/identity/infrastructure/persistence/UserModel.js";

import { BCryptPasswordHasher } from "../domains/identity/infrastructure/security/BCryptPasswordHasher.js";

import { OrganizationType } from "../domains/organizations/domain/constants/OrganizationType.js";
import { RegistrationMethod } from "../domains/organizations/domain/constants/RegistrationMethod.js";
import { SubscriptionPlan } from "../domains/organizations/domain/constants/SubscriptionPlan.js";
import { OrganizationStatus } from "../domains/organizations/domain/constants/OrganizationStatus.js";

import { UserRole } from "../domains/identity/domain/constants/UserRole.js";
import { UserStatus } from "../domains/identity/domain/constants/UserStatus.js";

import { Permission } from "../domains/platform/permissions/domain/constants/Permission.js";

async function seed() {

    await bootstrapDatabase();

    const passwordHasher = new BCryptPasswordHasher();

    let platform = await OrganizationModel.findOne({

        code: "RYUZEN"

    });

    if (!platform) {

        platform = await OrganizationModel.create({

            name: "RyuZen Platform",

            code: "RYUZEN",

            emailDomains: ["ryuzen.ai"],

            organizationType: OrganizationType.COMPANY,

            registrationMethod: RegistrationMethod.OPEN,

            subscriptionPlan: SubscriptionPlan.ENTERPRISE,

            status: OrganizationStatus.ACTIVE

        });

        console.log("✔ Platform Organization Created");

    } else {

        console.log("✔ Platform Organization Already Exists");

    }

    const admin = await UserModel.findOne({

        email: "admin@ryuzen.ai"

    });

    if (!admin) {

        const passwordHash = await passwordHasher.hash(

            "Admin@123"

        );

        await UserModel.create({

            organizationId: platform._id,

            name: "Platform Administrator",

            email: "admin@ryuzen.ai",

            role: UserRole.SUPER_ADMIN,

            permissions: Object.values(Permission),

            status: UserStatus.ACTIVE,

            profile: {

                image: "",

                phone: "",

                bio: ""

            },

            auth: {

                passwordHash,

                emailVerified: true,

                failedAttempts: 0

            }

        });

        console.log("✔ SUPER_ADMIN Created");

    } else {

        console.log("✔ SUPER_ADMIN Already Exists");

    }

    await mongoose.disconnect();

    console.log("✔ Seed Completed");

}

seed().catch(async error => {

    console.error(error);

    await mongoose.disconnect();

    process.exit(1);

});