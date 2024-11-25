import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const schema = Joi.object({
    nombre: Joi.string().min(3).regex(/^[a-zA-Z\s]+$/).required().messages({
        'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
      }),
    correo: Joi.string().email().required().custom((value, helpers) => {
        return escape(value); // Escapar correos
    }),
    contrasena: Joi.string().min(6).max(20)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])([A-Za-z\\d!@#$%^&*]{6,20})$'))
        .required(),
    role: Joi.string().valid('user', 'admin').required(),
    telefono: Joi.string().min(10).max(10).required(),
});

// rechazar campos adicionales
export const strictValidation = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error, value } = schema.validate(req.body, { allowUnknown: false });
        if (error) return res.status(400).send({ error: error.details[0].message });
        req.body = value;
        next();
    };
};

export const validarUsuario = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    next();
};
