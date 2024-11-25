import { Request, Response, NextFunction } from 'express';
import { checkBlacklist } from '../../infrastructure/utils/security';

export const blacklistMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const inputs = Object.values(req.body)
        .concat(Object.values(req.query), Object.values(req.params));

    const isBlacklisted = inputs.some(
        (input) => typeof input === 'string' && checkBlacklist(input)
    );

    if (isBlacklisted) {
        return res.status(400).send({ error: 'Entrada maliciosa detectada' });
    }

    next();
};
