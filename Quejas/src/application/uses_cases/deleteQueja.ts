import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';

export const eliminarQuejaService = async (req: Request, res: Response) => {
    try {
        const {title}  = req.body;
        const queja = await Queja.findByPk(req.params.id);

        const deletedRows = await Queja.destroy({
            where: { id: req.params.id },
        });

        if (!deletedRows) {
            return res.status(404).send({ error: 'Queja no encontrada.' });
        }
        if (!queja) {
            return res.status(404).send();
        }
        // Registrar auditoría
        await logAudit(queja.id.toString(), 'delete', `Queja eliminada: ${title}`);

        res.status(200).send({ message: 'Queja eliminada correctamente.' });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar la queja.' });
    }
};
