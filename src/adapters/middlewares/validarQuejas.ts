import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const schemaQ = Joi.object({
    title: Joi.string().regex(/^[a-zA-Z\s]+$/).required().messages({
        'string.pattern.base': 'El titulo solo no puede contener caracteres',
      }),
    description: Joi.string().regex(/^[a-zA-Z\s]+$/).required().messages({
        'string.pattern.base': 'La descripcion no puede contener caracteres',
      }),
    category: Joi.string().required(),
});

export const validarQueja = (req: Request, res: Response, next: NextFunction) => {
    const { error } = schemaQ.validate(req.body);
    if (error) {
        return res.status(400).send({ error: error.details[0].message });
    }
    next();
};
