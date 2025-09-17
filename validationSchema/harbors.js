const Joi = require("joi");

exports.getHarborStatusSchema = {
    params: Joi.object({
        id: Joi.number().integer().required().positive()
    })
};

exports.postHarborStatusSchema = {
    params: Joi.object({
        id: Joi.number().integer().required().positive()
    }),
    body: Joi.object({
        status: Joi.number().integer().positive().required()
    })
};