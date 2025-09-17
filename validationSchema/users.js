const Joi = require("joi");

exports.updateUserRoleSchema = {
    body: Joi.object({
        role: Joi.string().valid("user", "admin", "superadmin").required()
    })
}