import { validationResult } from "express-validator";

import { ValidationError } from "../errors/index.js";

export default function validate(

    req,

    res,

    next

) {

    const result = validationResult(req);

    if (result.isEmpty()) {

        return next();

    }

    const errors = result.array().map((error) => ({

        field: error.path,

        message: error.msg,

        value: error.value,

    }));

    next(

        new ValidationError(

            "Validation failed.",

            errors

        )

    );

}