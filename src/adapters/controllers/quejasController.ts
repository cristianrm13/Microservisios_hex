import { Request, Response } from 'express';
import Queja, { IQueja } from '../../domain/models/quejas';

export class QuejaController {
    constructor() {}

    // Crear una nueva queja
    crearQueja = async (req: Request, res: Response) => {
        try {
            const { title, description, category } = req.body;
            const filePath = req.file?.path; // Obtener la ruta del archivo

            const queja = new Queja({ title, description, category, filePath });
            await queja.save();
            res.status(201).send(queja);
        } catch (error) {
            console.error('Error al crear la queja:', error);
            res.status(500).send({ error: 'Error al crear la queja.' });
        }
    };

    // Obtener todas las quejas
    obtenerQuejas = async (req: Request, res: Response) => {
        try {
            const quejas = await Queja.find({});
            res.status(200).send(quejas);
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener las quejas.' });
        }
    };

    // Obtener una queja por ID
    obtenerQuejaPorId = async (req: Request, res: Response) => {
        const _id = req.params.id;
        try {
            const queja = await Queja.findById(_id);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }
            res.status(200).send(queja);
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener la queja.' });
        }
    };

    // Actualizar una queja por ID
    actualizarQueja = async (req: Request, res: Response) => {
        const updates = Object.keys(req.body) as Array<keyof IQueja>;
        const allowedUpdates: Array<keyof IQueja> = ['title', 'description', 'category', 'status'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualización no permitida' });
        }

        try {
            const queja = await Queja.findById(req.params.id);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }

            updates.forEach((update) => {
                (queja as any)[update] = req.body[update];
            });
            await queja.save();
            res.status(200).send(queja);
        } catch (error) {
            res.status(400).send(error);
        }
    };

    // Eliminar una queja por ID
    eliminarQueja = async (req: Request, res: Response) => {
        try {
            const queja = await Queja.findByIdAndDelete(req.params.id);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }
            res.status(200).send(queja);
        } catch (error) {
            res.status(500).send(error);
        }
    };
}

// Exporta las instancias del controlador
export const crearQueja = new QuejaController().crearQueja;
export const obtenerQuejas = new QuejaController().obtenerQuejas;
export const obtenerQuejaPorId = new QuejaController().obtenerQuejaPorId;
export const actualizarQueja = new QuejaController().actualizarQueja;
export const eliminarQueja = new QuejaController().eliminarQueja;
