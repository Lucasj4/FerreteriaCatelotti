import Joi from 'joi';
import CustomError from '../errors/custom-error.js';
import { Errors } from '../errors/enum-error.js';

export const userValidator = (req,res,next) => {
    
    const schema = Joi.object({
        userUsername: Joi.string().trim().pattern(/^[A-Za-z0-9]+$/).required().messages({
            "string.empty": "El username del usuario es obligatorio",
            "any.required": "El username del usuario es obligatorio",
            "string.base": "El username debe contener solo letras y números",
            "string.pattern.base": "El username debe contener solo letras y números, sin espacios"
        }),
        userEmail:Joi.string().regex(/@(gmail\.com|hotmail\.com)$/).email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().messages({
            "string.empty": "El email es obligatorio",
            "any.required": "El email es obligatorio",
            "string.email": "El email debe ser una dirección de correo electrónico válida",
            "string.pattern.base": "El email debe ser una dirección de correo electrónico válida de Gmail o Hotmail"
        }),
        userPassword: Joi.string().min(8).max(30).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_.])[A-Za-z\d@$!%*?&_.]+$/).required().messages({
            "string.empty": "La contraseña es obligatoria",
            "any.required": "La contraseña es obligatoria",
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.max": "La contraseña no debe exceder los 30 caracteres",
            "string.pattern.base": "La contraseña debe incluir al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (como @ $ ! % * ? & _ . )"
        }),
    })

    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        console.log(errorMessages);
        
        return res.status(400).json({ errorMessages });
    }
    next();
}