import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';

export const eliminarQuejaService = async (req: Request, res: Response) => {
    try {
        const deletedRows = await Queja.destroy({
            where: { id: req.params.id },
        });

        if (!deletedRows) {
            return res.status(404).send({ error: 'Queja no encontrada.' });
        }
        res.status(200).send({ message: 'Queja eliminada correctamente.' });
    } catch (error) {
        res.status(500).send({ error: 'Error al eliminar la queja.' });
    }
};
