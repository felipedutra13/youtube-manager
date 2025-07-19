import { Router } from 'express';
import appRoutes from './app.routes.js';

const router = Router();

router.use('/app', appRoutes);

export default router;
