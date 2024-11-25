import { Router } from 'express';
import { UserController } from '../controllers/usuarioController';
import { strictValidation, validarUsuario } from '../middlewares/validarUsuario';
import { authMiddleware } from '../middlewares/authMiddleware';
import { cleanInput } from '../middlewares/cleanInput';
import rateLimit from 'express-rate-limit';

const router = Router();
const userController = new UserController();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5,
    message: 'Intenta de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

const dailyLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,//  1 dia
    max: 15, 
    message: 'Intenta de nuevo más tarde.',
    standardHeaders: true,
    legacyHeaders: false,
});

router.post('/', dailyLimiter,
    validarUsuario,
     /* strictValidation, */
    cleanInput,
    userController.crearUsuario);
router.post('/login',
    loginLimiter,
    userController.loginUsuario);

router.get('/',
    authMiddleware,
    userController.obtenerUsuarios);
router.get('/:id', /* authMiddleware, */ userController.obtenerUsuarioPorId);
router.put('/:id',/*  authMiddleware, */ validarUsuario, cleanInput, userController.actualizarUsuario);
router.delete('/:id',
    authMiddleware,
    userController.eliminarUsuario);


export default router;
