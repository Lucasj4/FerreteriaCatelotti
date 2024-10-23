import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';

export const ValidateCategory = (req, res, next) => {
    const schema = Joi.object({
        categoryName: Joi.string().required().trim().pattern(/^[A-Za-z\s]+$/).messages({
            "string.empty": "La categoria del producto es obligatorio",
            "any.required": "La categoria del producto es obligatorio",
            "string.base": "La categoria del producto debe contener solo letras",
            "string.pattern.base": "La categoria del producto debe contener solo letras y espacios, sin números"
        })
    })

    const {error} = schema.validate(req.body, { abortEarly: false });

    if(error){
        const errorMessages = error.details.map(detail => detail.message).join(", ");
        const cause = `Validation errors on fields: ${error.details.map(detail => detail.path.join(".")).join(", ")}`;
        return next(CustomError.createError({
            name: "ValidationError",
            cause: cause,
            message: errorMessages,
            code: Errors.VALIDATION_ERROR
        }));
    }
    next();
}