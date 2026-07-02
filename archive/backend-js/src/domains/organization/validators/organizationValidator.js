import {

    body,

} from "express-validator";

export const createOrganizationValidation = [

    body("name")

        .trim()

        .notEmpty()

        .withMessage(

            "Organization name is required."

        )

        .isLength({

            min: 3,

            max: 100,

        })

        .withMessage(

            "Organization name must be between 3 and 100 characters."

        ),

    body("code")

        .trim()

        .notEmpty()

        .withMessage(

            "Organization code is required."

        )

        .isLength({

            min: 2,

            max: 10,

        })

        .withMessage(

            "Organization code must be between 2 and 10 characters."

        ),

    body("emailDomains")

        .isArray({

            min: 1,

        })

        .withMessage(

            "At least one email domain is required."

        ),

];