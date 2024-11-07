import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';

export const validateProduct = (req, res, next) => {
    const schema = Joi.object({
        productName: Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El nombre del producto es obligatorio",
            "any.required": "El nombre del producto es obligatorio",
            "string.base": "El nombre del producto debe contener solo letras",
            "string.pattern.base": "El nombre del producto debe contener solo letras y espacios, sin números"
        }),
        productPrice: Joi.number().required().messages({
            "number.base": "El precio del producto debe ser un número",
            "any.required": "El precio del producto es obligatorio"
        }),
        productStock: Joi.number().required().messages({
            "number.base": "El stock del producto debe ser un número",
            "any.required": "El stock del producto es obligatorio"
        }),
        productUnit: Joi.string().required().messages({
            "string.base": "La unidad del producto debe ser una cadena",
            "any.required": "La unidad del producto es obligatoria"
        }),
        productCategory: Joi.string().required().messages({
            "string.base": "La categoría del producto debe ser una cadena",
            "any.required": "La categoría del producto es obligatoria"
        }),
        productCost: Joi.number().required().messages({
            "number.base": "El costo del producto debe ser un número",
            "any.required": "El costo del producto es obligatorio"
        })
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errorMessages }); // Enviar array de mensajes de error
    }
    next();
    
};
