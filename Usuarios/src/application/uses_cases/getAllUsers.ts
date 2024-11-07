import { Request, Response } from 'express';
import Usuario from '../../domain/models/usuario';

export const obtenerUsuarioService = async (req: Request, res: Response) => {
    try {
        const usuarios = await Usuario.findAll();
        res.status(200).send(usuarios);
        
    } catch (error) {
        res.status(500).send(error);
    }
};