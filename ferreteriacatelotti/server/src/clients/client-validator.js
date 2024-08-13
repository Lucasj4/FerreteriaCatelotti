import Joi from "joi";

export const validateClient = (req, res, next) => {

    const schema = Joi.object({
        clientFirstName: Joi.string().min(4).trim().pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ\s]+$/).required().messages({
            "string.empty": "El nombre del cliente es obligatorio",
            "any.required": "El nombre del cliente es obligatorio",
            "string.base": "El nombre del cliente debe contener solo letras",
            "string.pattern.base": "El nombre del cliente debe contener solo letras y espacios, sin números"
        }),
        clientLastName:Joi.string().min(4).trim().pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+$/).required().messages({
            "string.empty": "El nombre del cliente es obligatorio",
            "any.required": "El nombre del cliente es obligatorio",
            "string.base": "El nombre del cliente debe contener solo letras",
            "string.pattern.base": "El nombre del cliente debe contener solo letras y espacios, sin números"
        }),
        clientEmail:Joi.string().regex(/@(gmail\.com|hotmail\.com)$/).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
            "string.empty": "El email es obligatorio",
            "any.required": "El email es obligatorio",
            "string.email": "El email debe ser una dirección de correo electrónico válida",
            "string.pattern.base": "El email debe ser una dirección de correo electrónico válida de Gmail o Hotmail"
        }),
        clientDni: Joi.number()
        .integer()
        .min(10000000)  // Mínimo valor para asegurar al menos 8 dígitos
        .max(99999999)  // Máximo valor para asegurar no más de 8 dígitos
        .required()
        .messages({
            "number.base": "El DNI debe ser un número",
            "number.empty": "El DNI es obligatorio",
            "any.required": "El DNI es obligatorio",
            "number.min": "El DNI debe contener al menos 8 dígitos",
            "number.max": "El DNI debe contener no más de 8 dígitos",
            "number.integer": "El DNI debe ser un número entero"
        }),
    });

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({ errorMessages });
    }
    next();
};