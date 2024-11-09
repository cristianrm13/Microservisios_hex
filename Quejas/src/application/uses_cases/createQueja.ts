import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';

export const crearQuejaService = async (req: Request, res: Response) => {
    try {
        const { title, description, category } = req.body;
        const filePath = req.file?.path; // Obtener la ruta del archivo

        const queja = await Queja.create({ title, description, category, filePath });

        // Registrar auditoría
        await logAudit(queja.id.toString(), 'create', `Queja creada: ${title}`);

        res.status(201).send(queja);
    } catch (error) {
        console.error('Error al crear la queja:', error);
        res.status(500).send({ error: 'Error al crear la queja.' });
    }
    
};


/* 
import { Request, Response } from 'express';
import Queja from '../../domain/models/quejas';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';

export const crearQuejaService = async (req: Request, res: Response) => {
    try {
        const { title, description, category } = req.body;
        const filePath = req.file?.path;

        // Validar categoría permitida
        const categoriasValidas = ['Alumbrado', 'Baches', 'Limpieza', 'Seguridad'];
        if (!categoriasValidas.includes(category)) {
            return res.status(400).send({ error: `La categoría '${category}' no es válida.` });
        }

        const queja = await Queja.create({ title, description, category, filePath });

        // Registrar auditoría
        await logAudit(queja.id.toString(), 'create', `Queja creada: ${title}`);

        res.status(201).send(queja);
    } catch (error: unknown) {
        console.error('Error al crear la queja:', error);

        // Si `error` es de tipo `Error`, obtenemos su mensaje.
        if (error instanceof Error) {
            if (error.name === 'SequelizeValidationError') {
                return res.status(400).send({ error: 'Datos de entrada inválidos.' });
            } else if (error.name === 'SequelizeDatabaseError') {
                return res.status(500).send({ error: 'Error en la base de datos.' });
            } else {
                return res.status(500).send({ error: error.message || 'Error al crear la queja.' });
            }
        }

        // Para cualquier otro tipo de error, envía un mensaje genérico.
        res.status(500).send({ error: 'Error desconocido al crear la queja.' });
    }
};
 */