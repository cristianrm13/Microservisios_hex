import { Request, Response } from 'express';
import Payment from '../../domain/models/pagos';

export const eliminarPagoService = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const deletedPayment = await Payment.findByPk(id);
        if (!deletedPayment) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        await deletedPayment.destroy();
        return res.status(200).json({ message: 'Pago eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el pago:', error);
        return res.status(500).json({ message: 'Error al eliminar el pago' });
    }
}