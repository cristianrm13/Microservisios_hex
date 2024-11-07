import { Request, Response } from 'express';
import Payment from '../../domain/models/pagos';

export const obtenerPagoPorIdService = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const payment = await Payment.findByPk(id);
        if (!payment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        return res.status(200).json(payment);
    } catch (error) {
        console.error('Error al obtener el pago:', error);
        return res.status(500).json({ message: 'Error al obtener el pago' });
    }
};