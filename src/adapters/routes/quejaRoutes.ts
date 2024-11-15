import { Router } from 'express';
import { QuejaController } from '../controllers/quejasController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/multerConfig';
import rateLimit from 'express-rate-limit';

const router = Router();
const quejaController = new QuejaController();

const quejaLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Limitar a 10 quejas por IP
    message: 'Intenta de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Rutas para quejas
router.get('/', /* authMiddleware, */ quejaController.obtenerQuejas); // Obtener todas las quejas
router.get('/:id', /* authMiddleware, */ quejaController.obtenerQuejaPorId); // Obtener queja por ID
router.patch('/:id', authMiddleware, quejaController.actualizarQueja); // Actualizar queja por ID
router.delete('/:id', authMiddleware, quejaController.eliminarQueja); // Eliminar queja por ID

// Aplicar el limitador de velocidad en la ruta para crear quejas
router.post('/', upload.single('file'), quejaLimiter, authMiddleware, quejaController.crearQueja); // Crear queja

router.get('/usuario/:id',/*  authMiddleware, */ quejaController.obtenerQuejasPorUsuario); // Obtener quejas por usuario

export default router;
