import { body } from "express-validator";

import {

    ACTIVITY_STATUS,

} from "../constants/activityConstants.js";

const updateActivityValidator = [

    body("title")

        .optional()

        .trim()

        .isLength({

            max: 150,

        }),

    body("description")

        .optional()

        .trim(),

    body("status")

        .optional()

        .isIn(

            Object.values(

                ACTIVITY_STATUS

            )

        ),

    body("rules.points")

        .optional()

        .isFloat({

            min: 0,

        }),

];

export default updateActivityValidator;