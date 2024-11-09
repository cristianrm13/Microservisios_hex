import { Request, Response } from 'express';
import Usuario from '../../domain/models/usuario';


export const obtenerUsuarioPorIdService = async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        usuario.fecha_operacion	 = new Date();
        await usuario.save();

        res.status(200).send(usuario);
    } catch (error) {
        res.status(500).send(error);
    }
};