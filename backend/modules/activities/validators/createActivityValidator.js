import { body } from "express-validator";

import {

    ACTIVITY_TYPE,

    ACTIVITY_STATUS,

} from "../constants/activityConstants.js";

const createActivityValidator = [

    body("title")

        .trim()

        .notEmpty()

        .withMessage("Title is required.")

        .isLength({

            max: 150,

        })

        .withMessage("Title cannot exceed 150 characters."),

    body("description")

        .optional()

        .trim(),

    body("type")

        .isIn(

            Object.values(

                ACTIVITY_TYPE

            )

        )

        .withMessage("Invalid activity type."),

    body("status")

        .optional()

        .isIn(

            Object.values(

                ACTIVITY_STATUS

            )

        ),

    body("rules.points")

        .optional()

        .isNumeric()

        .isFloat({

            min: 0,

        }),

    body("rules.penaltyPoints")

        .optional()

        .isNumeric()

        .isFloat({

            min: 0,

        }),

    body("rules.maxParticipants")

        .optional()

        .isInt({

            min: 0,

        }),

];

export default createActivityValidator;