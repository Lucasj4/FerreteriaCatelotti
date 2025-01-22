import Joi from 'joi';

export const ValidateSupplier = (req, res, next) => {

    const schema = Joi.object({
        supplierFirstName: Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El nombre es obligatorio",
            "any.required": "El nombre es obligatorio",
            "string.base": "El nombre debe contener solo letras",
            "string.pattern.base": "El nombre debe contener solo letras y espacios, sin números"
        }),
        supplierLastName: Joi.string().trim().pattern(/^[A-Za-z\s]+$/).required().messages({
            "string.empty": "El apellido es obligatorio",
            "any.required": "El apellido es obligatorio",
            "string.base": "El apellido debe contener solo letras",
            "string.pattern.base": "El apellido debe contener solo letras y espacios, sin números"
        }),
        supplierEmail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: false } }) // Permite todos los TLD
        .required()
        .messages({
            "string.empty": "El email es obligatorio",
            "any.required": "El email es obligatorio",
            "string.email": "El email debe ser una dirección de correo electrónico válida"
        }),
        supplierDni: Joi.number()
            .integer()
            .min(1000000)  // Mínimo valor para asegurar al menos 7 dígitos
            .max(99999999)  // Máximo valor para asegurar no más de 8 dígitos
            .required()
            .messages({
                "number.base": "El DNI debe ser un número",
                "number.empty": "El DNI es obligatorio",
                "any.required": "El DNI es obligatorio",
                "number.min": "El DNI debe contener al menos 7 dígitos",
                "number.max": "El DNI debe contener no más de 8 dígitos",
                "number.integer": "El DNI debe ser un número entero"
            }),
    }).unknown();

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errorMessages });
    }

    next();
}