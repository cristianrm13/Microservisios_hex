import { Router } from 'express';
import { UserController } from '../controllers/usuarioController';
import { validarUsuario } from '../middlewares/validarUsuario';
import { authMiddleware } from '../middlewares/authMiddleware';
import rateLimit from 'express-rate-limit';

const router = Router();
const userController = new UserController();

// Definir el limitador de solicitudes (por ejemplo, para la ruta de login)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Limitar a 5 intentos de inicio de sesión por IP
    message: 'Intenta de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

const dailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,//  1 dia
    max: 3, // Limitar a 3 intentos de inicio de sesión por IP
    message: 'Intenta de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.get('/', authMiddleware, userController.obtenerUsuarios);
router.get('/:id', authMiddleware, userController.obtenerUsuarioPorId);
router.put('/:id', authMiddleware, validarUsuario, userController.actualizarUsuario);
router.delete('/:id', authMiddleware, userController.eliminarUsuario);

// Aplicar el limitador de velocidad en la ruta de login
router.post('/',dailyLimiter, validarUsuario, userController.crearUsuario);
router.post('/login', loginLimiter, userController.loginUsuario);

export default router;
