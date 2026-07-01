import express from "express";

import {

    register,

} from "../controllers/authController.js";

import {

    registerValidation,

} from "../validators/authValidator.js";

import validate from "../../../shared/middleware/validate.js";

const router = express.Router();

router.post(

    "/register",

    registerValidation,

    validate,

    register

);

export default router;