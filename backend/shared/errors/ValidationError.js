import AppError from "./AppError.js";

class ValidationError extends AppError {

    constructor(

        message,

        errors = []

    ) {

        super(

            message,

            422

        );

        this.errors = errors;

    }

}

export default ValidationError;