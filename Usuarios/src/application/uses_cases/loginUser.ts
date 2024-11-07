import { Request, Response } from 'express';
import Usuario from '../../domain/models/usuario';
import * as jwt from 'jsonwebtoken';
import { logAudit } from '../../../../Notificaciones/src/services/auditService';


export const loginUsuarioService = async (req: Request, res: Response) => {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await Usuario.findOne({ where: { correo } });

        if (!usuario || usuario.contrasena !== contrasena) {
            return res.status(401).send({ error: 'Credenciales no válidas.' });
        }

        usuario.fecha_operacion	 = new Date();
        await usuario.save();

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET || 'holatutu');
        res.send({ usuario, token });
    } catch (error) {
        res.status(400).send(error);
    }
};