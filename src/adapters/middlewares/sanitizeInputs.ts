import { Request, Response, NextFunction } from 'express';
import { escape } from 'lodash';

const sanitizeInputs = (req: Request, res: Response, next: NextFunction) => {
    const sanitize = (obj: any) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = escape(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    sanitize(req.body);
    sanitize(req.params);
    sanitize(req.query);
    next();
};

export default sanitizeInputs;
