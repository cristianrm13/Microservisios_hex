import { Router } from 'express';
import AuditLogModel from '../../domain/models/AuditLog';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Ruta para obtener los registros de auditoría
router.get('/', authMiddleware, async (req, res) => {
    try {
        const logs = await AuditLogModel.find();
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los registros de auditoría' });
    }
});

export default router;
