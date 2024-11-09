import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';

export const obtenerQuejaService = async (req: Request, res: Response) => {
    try {
        const quejas = await Queja.findAll();
        res.status(200).send(quejas);
    } catch (error) {
        res.status(500).send({ error: 'Error al obtener las quejas.' });
    }
};