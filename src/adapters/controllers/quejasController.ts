import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';

export class QuejaController {
    constructor() {}

    // Crear una nueva queja
    crearQueja = async (req: Request, res: Response) => {
        try {
            const { title, description, category } = req.body;
            const filePath = req.file?.path; // Obtener la ruta del archivo

            const queja = await Queja.create({ title, description, category, filePath });
            res.status(201).send(queja);
        } catch (error) {
            console.error('Error al crear la queja:', error);
            res.status(500).send({ error: 'Error al crear la queja.' });
        }
    };

    // Obtener todas las quejas
    obtenerQuejas = async (req: Request, res: Response) => {
        try {
            const quejas = await Queja.findAll();
            res.status(200).send(quejas);
        } catch (error) {
            res.status(500).send({ error: 'Error al obtener las quejas.' });
        }
    };

    // Obtener una queja por ID
    obtenerQuejaPorId = async (req: Request, res: Response) => {
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

    // Actualizar una queja por ID
    actualizarQueja = async (req: Request, res: Response) => {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['title', 'description', 'category', 'status'];
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Actualización no permitida' });
        }

        try {
            const [updatedRows, [updatedQueja]] = await Queja.update(req.body, {
                where: { id: req.params.id },
                returning: true,
            });

            if (updatedRows === 0) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }
            res.status(200).send(updatedQueja);
        } catch (error) {
            res.status(400).send({ error: 'Error al actualizar la queja.' });
        }
    };

    // Eliminar una queja por ID
    eliminarQueja = async (req: Request, res: Response) => {
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
}

// Exporta las instancias del controlador
export const crearQueja = new QuejaController().crearQueja;
export const obtenerQuejas = new QuejaController().obtenerQuejas;
export const obtenerQuejaPorId = new QuejaController().obtenerQuejaPorId;
export const actualizarQueja = new QuejaController().actualizarQueja;
export const eliminarQueja = new QuejaController().eliminarQueja;
