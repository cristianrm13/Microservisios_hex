import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';


export const actualizarQuejaService = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'category', 'status'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualización no permitida' });
    }

    try {
        const { title } = req.body;
        const queja = await Queja.findByPk(req.params.id);
        const [updatedRows, [updatedQueja]] = await Queja.update(req.body, {
            where: { id: req.params.id },
            returning: true,
        });

        if (updatedRows === 0) {
            return res.status(404).send({ error: 'Queja no encontrada.' });
        }
        if (!queja) {
            return res.status(404).send();
        }

        // Registrar auditoría
        await logAudit(queja.id.toString(), 'update', `Queja actualizada: ${title}`);

        res.status(200).send(updatedQueja);
    } catch (error) {
        res.status(400).send({ error: 'Error al actualizar la queja.' });
    }
};