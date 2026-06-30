import { body } from "express-validator";

export const registerValidation = [

    body("organizationCode")
        .trim()
        .notEmpty()
        .withMessage("Organization is required."),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 3, max: 100 })
        .withMessage("Name must be between 3 and 100 characters."),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required.")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters.")
        .matches(/[A-Z]/)
        .withMessage("Password must contain an uppercase letter.")
        .matches(/[a-z]/)
        .withMessage("Password must contain a lowercase letter.")
        .matches(/[0-9]/)
        .withMessage("Password must contain a number.")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password must contain a special character."),

];