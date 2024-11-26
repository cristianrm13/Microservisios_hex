import { Router } from 'express';
import { ComentarioController } from '../controllers/comentariosController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { cleanInput } from '../middlewares/cleanInput';

const router = Router();
const comentarioController = new ComentarioController();

// Crear un nuevo comentario en una queja
router.post('/:quejaId', authMiddleware, cleanInput, comentarioController.agregarComentario);

// Obtener comentarios de una queja
router.get('/:quejaId', comentarioController.obtenerComentariosPorQueja);

// Eliminar un comentario por ID
router.delete('/:comentarioId', authMiddleware, comentarioController.eliminarComentario);

export default router;
