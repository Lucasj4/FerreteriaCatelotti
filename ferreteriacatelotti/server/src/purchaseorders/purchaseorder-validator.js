import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';

export const ValidatePurchaseOrder = (req, res, next) => {
    const schema = Joi.object({
        purchaseOrderAmount:Joi.number().positive().required().custom((value, helpers) => {
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
        purchaseOrderStatus: Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El estado de la orden de compra es obligatorio",
            "any.required": "El estado de la orden de compra es obligatorio",
            "string.base": "El estado de la orden de compra debe contener solo letras",
            "string.pattern.base": "El estado de la orden de compra debe contener solo letras y espacios, sin números"
        })
    })
}