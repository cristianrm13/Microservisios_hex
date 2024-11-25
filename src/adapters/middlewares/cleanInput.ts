import { Request, Response, NextFunction } from 'express';

const cleanString = (value: any): any => {
    if (typeof value === 'string') {
        // Trim y normalización a minúsculas
        return value.trim().toLowerCase();
    }
    return value;
};

const cleanObject = (obj: any): any => {
    if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            obj[key] = cleanString(obj[key]);
        }
    }
    return obj;
};

export const cleanInput = (req: Request, res: Response, next: NextFunction) => {
    // Limpia los datos en req.body, req.query, req.params
    req.body = cleanObject(req.body);
    req.query = cleanObject(req.query);
    req.params = cleanObject(req.params);

    next();
};
