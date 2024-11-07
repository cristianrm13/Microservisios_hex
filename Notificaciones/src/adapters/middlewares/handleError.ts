import { Request, Response, NextFunction } from 'express';

// Interfaz para el error personalizado
interface CustomError extends Error {
    status?: number;
}

// Middleware de manejo de errores
const handleError = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err); // Registra el error en la consola

    const statusCode = err.status || 500; // Usa el código de estado definido en el error, o 500 si no está definido
    const message = err.message || 'Ocurrió un error interno del servidor'; // Mensaje de error

    res.status(statusCode).json({ // Devuelve el código de estado y el mensaje en formato JSON
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { // Muestra el stack solo en desarrollo
                stack: err.stack,
            }),
        },
    });
};

export default handleError;
