import { Router } from 'express';
import { QuejaController } from '../controllers/quejasController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/multerConfig';
import rateLimit from 'express-rate-limit';
import { validarQueja } from '../middlewares/validarQuejas';
import { cleanInput } from '../middlewares/cleanInput';

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
router.get('/', /* authMiddleware, */ quejaController.obtenerQuejas);
router.get('/:id', /* authMiddleware, */ quejaController.obtenerQuejaPorId);
// Ruta para obtener quejas por categoría
router.get('/categoria/:category', quejaController.obtenerQuejasPorCategoria);
router.get('/estadisticas/categorias', quejaController.obtenerQuejasPorCategoriaAgrupadas);
router.get('/estadisticas/estados', quejaController.obtenerQuejasPorEstadoAgrupadas);
router.get('/estadisticas/fechas', quejaController.obtenerQuejasPorFecha);
router.get('/estadisticas/usuarios-top', quejaController.obtenerUsuariosConMasQuejas);
router.get('/estadisticas/mes', quejaController.obtenerQuejasPorMes);
router.get('/estadisticas/resueltas_no', quejaController.obtenerPorcentajeResueltas);
router.get('/estadisticas/frecuencia', quejaController.obtenerCategoriaMasFrecuente);

router.get('/estadisticas/:quejaId/historico',quejaController.obtenerHistorialQueja);

router.patch('/:id',
    authMiddleware,
    validarQueja,
    cleanInput,
    quejaLimiter,
    quejaController.actualizarQueja);
router.delete('/:id',
    authMiddleware,
    quejaController.eliminarQueja);

// Aplicar el limitador de velocidad en la ruta para crear quejas
router.post('/',
    upload.single('file'),
    validarQueja,
    cleanInput,
    quejaLimiter,
    authMiddleware,
    quejaController.crearQueja);

router.get('/usuario/:id',/* authMiddleware, */
    quejaController.obtenerQuejasPorUsuario); // Obtener quejas por usuario



export default router;