import { Request, Response } from 'express';
import { crearUsuarioService } from '../../application/uses_cases/createUser';
import { loginUsuarioService } from '../../application/uses_cases/loginUser';
import { obtenerUsuarioService } from '../../application/uses_cases/getAllUsers';
import { obtenerUsuarioPorIdService } from '../../application/uses_cases/getUserById';
import { actualizarUsuarioService } from '../../application/uses_cases/updateUser';
import { eliminarUsuarioService } from '../../application/uses_cases/deleteUser';


export class UserController {
    constructor() { }

    crearUsuario = (req: Request, res: Response) => crearUsuarioService(req, res);
    loginUsuario = (req: Request, res: Response) => loginUsuarioService(req, res);
    obtenerUsuarios = (req: Request, res: Response) => obtenerUsuarioService(req, res);
    obtenerUsuarioPorId = (req: Request, res: Response) => obtenerUsuarioPorIdService(req, res);
    actualizarUsuario = (req: Request, res: Response) => actualizarUsuarioService(req, res);
    eliminarUsuario = (req: Request, res: Response) => eliminarUsuarioService(req, res);
}
