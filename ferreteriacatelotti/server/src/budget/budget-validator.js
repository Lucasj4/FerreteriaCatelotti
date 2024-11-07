import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';

export const budgetValidator = (req, res, next) => {
    const schema = Joi.object({
        userID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
            "string.pattern.base": "El ID del usuario debe ser un ObjectId válido de MongoDB",
            "string.empty": "El ID del usuario es obligatorio"
        }),
        clientID: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required().messages({
            "string.pattern.base": "El ID del cliente debe ser un ObjectId válido de MongoDB",
            "any.required": "El ID del cliente es obligatorio"
        }),
        budgetAmount: Joi.number().positive().required().custom((value, helpers) => {
            // Expresión regular para permitir solo hasta 2 decimales
            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                return helpers.error('number.precision'); // Lanza un error si hay más de 2 decimales
            }
            return value;
        }).messages({
            "number.base": "El precio unitario del producto debe ser un número",
            "any.required": "El precio unitario del producto es obligatorio",
            "number.positive": "El precio unitario del producto debe ser un número positivo",
            "number.precision": "El precio unitario debe tener como máximo dos decimales"
        }),
        budgetStatus: Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El estado de la orden de compra es obligatorio",
            "any.required": "El estado de la orden de compra es obligatorio",
            "string.base": "El estado de la orden de compra debe contener solo letras",
            "string.pattern.base": "El estado de la orden de compra debe contener solo letras y espacios, sin números"
        }),
        budgetDate: Joi.date().required().messages({
            "date.base": "La fecha de la orden de compra debe ser una fecha válida",
            "any.required": "La fecha de la orden de compra es obligatoria"
        }) 
    })

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
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