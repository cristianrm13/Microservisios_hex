import { Request, Response } from 'express';
import { crearQuejaService } from '../../application/uses_cases/createQueja';
import { obtenerQuejaService } from '../../application/uses_cases/getAllQuejas';
import { obtenerQuejaPorIdService } from '../../application/uses_cases/getQuejaById';
import { actualizarQuejaService } from '../../application/uses_cases/updateQueja';
import { eliminarQuejaService } from '../../application/uses_cases/deleteQueja';


export class QuejaController {
    constructor() { }

    crearQueja = (req: Request, res: Response) => crearQuejaService(req, res);
    obtenerQuejas = (req: Request, res: Response) => obtenerQuejaService(req, res);
    obtenerQuejaPorId = (req: Request, res: Response) => obtenerQuejaPorIdService(req, res);
    actualizarQueja = (req: Request, res: Response) => actualizarQuejaService(req, res);
    eliminarQueja = (req: Request, res: Response) => eliminarQuejaService(req, res);
}
