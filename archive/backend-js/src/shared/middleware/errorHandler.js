export default function errorHandler(

    error,

    req,

    res,

    next

){

    const statusCode =

        error.statusCode || 500;

    res.status(statusCode).json({

        success:false,

        message:error.message ||

        "Internal Server Error",

        ...(error.errors && {
            errors: error.errors,
        }),

        ...(process.env.NODE_ENV !== "production" 
            ? {stack: error.stack}
            : {}),
        });

}

