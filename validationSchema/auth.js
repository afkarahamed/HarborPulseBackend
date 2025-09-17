const Joi = require("joi");


exports.registerUserSchema = {
    body: Joi.object({
        username: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(6).max(50).required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
        .messages({
            "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
            "string.min": "Password must be at least 8 characters long"
        })
    })
}

exports.loginUserSchema = {
    body: Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required()
    })
}