import dotenv from "dotenv";

import validateEnv from "./validateEnv.js";

dotenv.config();

validateEnv();

const env = Object.freeze({

    PORT:

        Number(process.env.PORT) || 5000,

    NODE_ENV:

        process.env.NODE_ENV || "development",

    MONGO_URI:

        process.env.MONGO_URI,

    JWT_SECRET:

        process.env.JWT_SECRET,

    JWT_EXPIRES_IN:

        process.env.JWT_EXPIRES_IN || "1d",

    CLIENT_URL:

        process.env.CLIENT_URL ||

        "http://localhost:5173",

});

export default env;