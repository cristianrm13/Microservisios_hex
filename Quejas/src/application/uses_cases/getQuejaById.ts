import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';


export const obtenerQuejaPorIdService = async (req: Request, res: Response) => {
    try {
        const queja = await Queja.findByPk(req.params.id);
        if (!queja) {
            return res.status(404).send({ error: 'Queja no encontrada.' });
        }
        res.status(200).send(queja);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener la queja.' });
    }
};