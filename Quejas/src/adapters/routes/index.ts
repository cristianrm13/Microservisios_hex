import express from 'express';
import quejasRoutes from './quejaRoutes';
//import auditRoutes from './auditRoutes';

const router = express.Router();

const apiVersion = '/v1';

router.use(`${apiVersion}/quejas`, quejasRoutes);

//router.use('/audit', auditRoutes);

export default router;
