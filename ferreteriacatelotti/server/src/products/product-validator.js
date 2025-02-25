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
        productPrice: Joi.number().positive().empty("").required().custom((value, helpers) => {
            // Expresión regular para permitir solo hasta 2 decimales
            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                return helpers.error('number.precision'); // Lanza un error si hay más de 2 decimales
            }
            return value;
        }).messages({
            "number.base": "El precio del producto debe ser un número",
            "any.required": "El precio del producto es obligatorio",
            "number.base": "El precio del producto debe ser un número",
            "number.positive": "El precio del producto debe ser un número positivo",
            "number.precision": "El precio debe tener como máximo dos decimales",
        }),

        productStock: Joi.number().min(0).required().empty("").custom((value, helpers) => {
            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                return helpers.error("number.precision");
            }
            return value;
        }).messages({
            "any.required": "El stock del producto es obligatorio",
            "number.base": "El stock del producto debe ser un número",
            "any.required": "El stock del producto es obligatorio",
            "number.min": "El valor mínimo es 0 para el stock del producto",
            "number.precision": "El stock solo puede tener hasta dos decimales"
        }),
        productUnit: Joi.string().required().messages({
            "string.base": "La unidad del producto debe ser una cadena",
            "any.required": "La unidad del producto es obligatoria"
        }),
        productCategory: Joi.string().required().messages({
            "string.base": "La categoría del producto debe ser una cadena",
            "any.required": "La categoría del producto es obligatoria"
        }),
        productCost: Joi.number().min(0).required().empty("").custom((value, helpers) => {
            if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                return helpers.error("number.precision");
            }
            return value;
        }).messages({
            "any.required": "El costo del producto es obligatorio",
            "number.base": "El costo del producto debe ser un número",
            "number.min": "El costo del producto debe ser mayor o igual a 0",
            "any.required": "El costo del producto es obligatorio",
            "number.precision": "El costo del producto solo puede tener hasta dos decimales"
        })
    }).unknown();

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errorMessages }); // Enviar array de mensajes de error
    }
    next();

};
