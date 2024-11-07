import express from 'express';
import  whatsappRoutes from './whatsappRoutes';
//import auditRoutes from './auditRoutes';

const router = express.Router();

const apiVersion = '/v1';


router.use(`${apiVersion}/whatsapp`, whatsappRoutes);
//router.use('/audit', auditRoutes);

export default router;
