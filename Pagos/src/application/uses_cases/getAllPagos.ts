import { Request, Response } from 'express';
import Payment from '../../domain/models/pagos';

export const obtenerPagoService = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const payments = await Payment.findOne();
        return res.status(200).json(payments);
    } catch (error) {
        console.error('Error al obtener los pagos:', error);
        return res.status(500).json({ message: 'Error al obtener los pagos' });
    }
};