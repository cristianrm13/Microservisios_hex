import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const schema = Joi.object({
    nombre: Joi.string().min(3).regex(/^[a-zA-Z\s]+$/).required().messages({
        'string.pattern.base': 'El nombre solo puede contener letras y espacios.',
      }),
    correo: Joi.string().email().required(),
    contrasena: Joi.string().min(6).max(20)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*])([A-Za-z\\d!@#$%^&*]{6,20})$'))
        .required(),
    role: Joi.string().min(4).max(5).required(),
    telefono: Joi.number().min(10).max(10).required(),
});

export const validarUsuario = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    next();
};
