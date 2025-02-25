import Joi from "joi";

export const userValidator = (req, res, next) => {
    // Determina si es un método PUT (actualización)
    const isUpdate = req.method === "PUT";

    // Esquema de validación
    const schema = Joi.object({
        userUsername: Joi.string()
            .pattern(/^[A-Za-z0-9._]+$/) // Permite solo caracteres válidos y prohíbe espacios
            .required()
            .messages({
                "string.base": "El username debe contener solo letras, números, guiones bajos o puntos",
                "string.empty": "El username es obligatorio",
                "string.pattern.base": "El username solo puede contener letras, números, guión bajo (_) o punto (.), sin espacios ni otros caracteres especiales",
            }),
        userEmail: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: false } }) // Permitir todos los dominios
            .required()
            .messages({
                "string.email": "El email debe ser una dirección de correo válida",
                "string.empty": "El email es obligatorio",
            }),
        userRole: Joi.string()
            .trim()
            .optional()
            .messages({
                "string.empty": "El rol no puede estar vacío",
            }),
        userPassword: Joi.alternatives().conditional(Joi.ref('$isUpdate'), {
            is: true, // Cuando es un PUT, la contraseña es opcional
            then: Joi.string()
                .min(8)
                .max(30)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_.]+$/)
                .optional()
                .messages({
                    "string.min": "La contraseña debe tener al menos 8 caracteres",
                    "string.max": "La contraseña no debe exceder los 30 caracteres",
                    "string.pattern.base": "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número",
                }),
            otherwise: Joi.string()
                .min(8)
                .max(30)
                .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&_.]+$/)
                .required()
                .messages({
                    "string.empty": "La contraseña es obligatoria",
                    "any.required": "La contraseña es obligatoria para registros",
                    "string.min": "La contraseña debe tener al menos 8 caracteres",
                    "string.max": "La contraseña no debe exceder los 30 caracteres",
                    "string.pattern.base": "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula y un número",
                }),
        }),
    }).unknown();

    // Validar con contexto
    const { error } = schema.validate(req.body, {
        abortEarly: false,
        context: { isUpdate }
    });

    // Manejo de errores de validación
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        return res.status(400).json({ errorMessages });
    }

    next();
};
