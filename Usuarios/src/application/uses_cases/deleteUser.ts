import { Request, Response } from 'express';
import Usuario from '../../domain/models/usuario';


export const eliminarUsuarioService = async (req: Request, res: Response) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).send();
        }

        await usuario.destroy();
        res.status(200).send(usuario);
    } catch (error) {
        res.status(500).send(error);
    }
};

