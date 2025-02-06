import Joi from "joi";

export const validateClient = (req, res, next) => {
    const schema = Joi.object({
        clientFirstName: Joi.string().trim().pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+$/).required().messages({
            "string.empty": "El nombre del cliente es obligatorio",
            "any.required": "El nombre del cliente es obligatorio",
            "string.base": "El nombre del cliente debe ser un texto válido",
            "string.pattern.base": "El nombre del cliente debe contener solo letras y espacios, sin números"
        }),
        clientLastName: Joi.string().trim().pattern(/^[A-Za-záéíóúÁÉÍÓÚñÑ]+$/).required().messages({
            "string.empty": "El apellido del cliente es obligatorio",
            "any.required": "El apellido del cliente es obligatorio",
            "string.base": "El apellido del cliente debe ser un texto válido",
            "string.pattern.base": "El apellido del cliente debe contener solo letras y espacios, sin números"
        }),
        clientEmail: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: false } }) // Permitir todos los dominios
            .required()
            .messages({
                "string.email": "El email debe ser una dirección de correo válida",
                "string.empty": "El email es obligatorio",
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
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errorMessages });
    }

    next();
};
