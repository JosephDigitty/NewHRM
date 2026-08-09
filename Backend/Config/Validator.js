import {body} from "express-validator"
export const loginValidation = [
    body("email")
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Enter a Valid Email"),

    body("password")
    .notEmpty().withMessage("password is required"),

    body("role")
    .not().exists()
    .withMessage("Role is not allowed in login request"),
]
    
