import { body } from "express-validator";

const submitActivityValidator = [

    body("answers")

        .optional()

        .isObject()

        .withMessage("Answers must be an object."),

    body("attachment")

        .optional()

        .isString()

        .trim(),

];

export default submitActivityValidator;