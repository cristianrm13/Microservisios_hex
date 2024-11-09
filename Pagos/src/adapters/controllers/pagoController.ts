import { Request, Response } from 'express';
import { crearPagoService } from '../../application/uses_cases/createPago';
import { obtenerPagoService } from '../../application/uses_cases/getAllPagos';
import { obtenerPagoPorIdService } from '../../application/uses_cases/getPagoById';
import { eliminarPagoService } from '../../application/uses_cases/deletePago';

export class PagoController {
    constructor() {}

crearPago = (req: Request, res: Response) => crearPagoService(req, res);
obtenerPagos = (req: Request, res: Response) => obtenerPagoService(req, res);
obtenerPagoPorId = (req: Request, res: Response) => obtenerPagoPorIdService(req, res);
eliminarPago = (req: Request, res: Response) => eliminarPagoService(req, res);
}