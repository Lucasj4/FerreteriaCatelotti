import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';
import { budgetValidator } from '../budget/budget-validator.js';

export const ValidatePurchaseOrder = (req, res, next) => {
    const isUpdate = req.method === "PUT" || req.method === "PATCH"; // Solo exigir importe en actualizaciones
    const schema = Joi.object({
        purchaseOrderAmount: isUpdate 
            ? Joi.number().positive().required().custom((value, helpers) => {
                if (!/^\d+(\.\d{1,2})?$/.test(value)) {
                    return helpers.error('number.precision');
                }
                return value;
              }).messages({
                "number.base": "El importe del producto debe ser un número",
                "any.required": "El importe del producto es obligatorio al actualizar",
                "number.positive": "El importe del producto debe ser un número positivo",
                "number.precision": "El importe debe tener como máximo dos decimales"
              })
            : Joi.number().positive().custom((value, helpers) => {
                if (value && !/^\d+(\.\d{1,2})?$/.test(value)) {
                    return helpers.error('number.precision');
                }
                return value;
              }).messages({
                "number.base": "El importe del producto debe ser un número",
                "number.positive": "El importe del producto debe ser un número positivo",
                "number.precision": "El importe debe tener como máximo dos decimales"
              }),
        purchaseOrderStatus: Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El estado de la orden de compra es obligatorio",
            "any.required": "El estado de la orden de compra es obligatorio",
            "string.base": "El estado de la orden de compra debe contener solo letras",
            "string.pattern.base": "El estado de la orden de compra debe contener solo letras y espacios, sin números"
        })
    }).unknown();

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errorMessages });
    }
    next();
}

export default budgetValidator;