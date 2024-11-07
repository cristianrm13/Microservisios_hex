import { Request, Response } from 'express';
import Usuario from '../../domain/models/usuario';


export const actualizarUsuarioService = async (req: Request, res: Response) => {
    const updates = Object.keys(req.body) as Array<keyof typeof Usuario>;
    const allowedUpdates: Array<keyof Usuario> = ['nombre', 'correo', 'contrasena', 'telefono'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update as keyof Usuario));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Actualización no permitida' });
    }

    try {
        const usuario = await Usuario.findByPk(req.params.id);
        if (!usuario) {
            return res.status(404).send({ error: 'Usuario no encontrado' });
        }

        updates.forEach((update) => {
            (usuario as any)[update] = req.body[update];
        });
        usuario.fecha_operacion	 = new Date();
        await usuario.save();
        res.status(200).send(usuario);
    } catch (error) {
        res.status(400).send(error);
    }
};