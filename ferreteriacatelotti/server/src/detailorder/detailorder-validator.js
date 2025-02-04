import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';

export const validateDetailOrder = (req, res, next) => {
    const schema = Joi.object({
        detailOrderProduct:Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El nombre del producto es obligatorio",
            "any.required": "El nombre del producto es obligatorio",
            "string.base": "El nombre del producto debe contener solo letras",
            "string.pattern.base": "El nombre del producto debe contener solo letras y espacios, sin números"
        }),
        detailOrderUnitCost: Joi.number().positive().required().custom((value, helpers) => {
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
        detailOrderQuantity: Joi.number().required().positive().messages({
            "number.base": "La cantidad del producto debe ser un número",
            "number.positive": "La cantidad del producto debe ser un numero positivo",
            "any.required": "La cantidad del producto es obligatoria",
        }),
        productID: Joi.string().required().messages({
            "string.empty": "El ID del producto es obligatorio",
            "any.required": "El ID del producto es obligatorio",
        })
    }).unknown();

    const { error } = schema.validate(req.body, { abortEarly: false });

   
    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errorMessages }); // Enviar array de mensajes de error
    }
    next();
}