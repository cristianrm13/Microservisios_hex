import express from 'express';
import  usuarioRoutes from './usuariosRoutes';
//import auditRoutes from './auditRoutes';

const router = express.Router();

const apiVersion = '/v1';


router.use(`${apiVersion}/usuarios`, usuarioRoutes);
//router.use('/audit', auditRoutes);

export default router;
