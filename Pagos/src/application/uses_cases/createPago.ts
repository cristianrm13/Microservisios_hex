import { Request, Response } from 'express';
import Payment from '../../domain/models/pagos';

export const crearPagoService = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { payment_id, status_detail, currency_id, total_paid_amount, date_created } = req.body;

        // Validar que los campos requeridos no sean nulos
        if (!payment_id || !status_detail || !currency_id || !total_paid_amount) {
            return res.status(400).json({ message: 'Todos los campos obligatorios deben ser proporcionados y no deben ser nulos' });
        }

        // Verificar si el pago ya existe
        const existingPayment = await Payment.findOne({ where: { payment_id } });
        if (existingPayment) {
            return res.status(400).json({ message: 'El pago ya existe en la base de datos' });
        }

        // Crear un nuevo pago con los datos proporcionados
        const newPayment = await Payment.create({
            payment_id,
            status_detail,
            currency_id,
            total_paid_amount,
            date_created: date_created || new Date()
        });
        return res.status(201).json(newPayment);
    } catch (error) {
        console.error('Error al crear el pago:', error);
        return res.status(500).json({ message: 'Error al crear el pago' });
    }
};