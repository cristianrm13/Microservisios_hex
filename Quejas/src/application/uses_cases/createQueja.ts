import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';

export const crearQuejaService = async (req: Request, res: Response) => {
    try {
        const { title, description, category } = req.body;
        const filePath = req.file?.path; // Obtener la ruta del archivo

        const queja = await Queja.create({ title, description, category, filePath });

        // Registrar auditoría
        await logAudit(queja.id.toString(), 'create', `Queja creada: ${title}`);

        res.status(201).send(queja);
    } catch (error) {
        console.error('Error al crear la queja:', error);
        res.status(500).send({ error: 'Error al crear la queja.' });
    }
};