import { Request, Response } from 'express';
import Comentario from '../../domain/models/comentarios';
import Queja from '../../domain/models/quejas';

export class ComentarioController {
    constructor() { }

    // Crear un nuevo comentario
    agregarComentario = async (req: Request, res: Response) => {
        try {
            const { content } = req.body;
            const userId = (req as any).userId;
            const { quejaId } = req.params;

            // Verificar que la queja exista
            const queja = await Queja.findById(quejaId);
            if (!queja) {
                return res.status(404).send({ error: 'Queja no encontrada.' });
            }

            const comentario = new Comentario({ content, userId, quejaId });
            await comentario.save();

            res.status(201).send(comentario);
        } catch (error) {
            console.error('Error al agregar comentario:', error);
            res.status(500).send({ error: 'Error al agregar el comentario.' });
        }
    };

    // Obtener todos los comentarios de una queja
    obtenerComentariosPorQueja = async (req: Request, res: Response) => {
        try {
            const { quejaId } = req.params;
            //const queja = await Queja.findById(quejaId).populate('comentarios');
            const comentarios = await Comentario.find({ quejaId }).populate('userId', 'nombre correo');
            res.status(200).send(comentarios);
        } catch (error) {
            console.error('Error al obtener comentarios:', error);
            res.status(500).send({ error: 'Error al obtener los comentarios.' });
        }
    };

    // Eliminar un comentario por ID
    eliminarComentario = async (req: Request, res: Response) => {
        try {
            const { comentarioId } = req.params;

            const comentario = await Comentario.findByIdAndDelete(comentarioId);
            if (!comentario) {
                return res.status(404).send({ error: 'Comentario no encontrado.' });
            }

            res.status(200).send({ message: 'Comentario eliminado exitosamente.' });
        } catch (error) {
            console.error('Error al eliminar comentario:', error);
            res.status(500).send({ error: 'Error al eliminar el comentario.' });
        }
    };
}

// Exportar instancias del controlador
export const agregarComentario = new ComentarioController().agregarComentario;
export const obtenerComentariosPorQueja = new ComentarioController().obtenerComentariosPorQueja;
export const eliminarComentario = new ComentarioController().eliminarComentario;
