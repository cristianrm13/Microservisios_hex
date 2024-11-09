import express from 'express';
import mercadoPagoRoutes from './mercadoPagoRoutes';
//import auditRoutes from './auditRoutes';

const router = express.Router();

const apiVersion = '/v1';


router.use(`${apiVersion}/mercadopago`, mercadoPagoRoutes);
//router.use('/audit', auditRoutes);

export default router;
