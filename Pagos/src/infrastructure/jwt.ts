import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error('JWT_SECRET no ha sido definido');
}

export const generateToken = (payload: object) => {
    return jwt.sign(payload, secret);
};

export const verifyToken = (token: string) => {
    return jwt.verify(token, secret);
};