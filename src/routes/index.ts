import { Router } from 'express';
import youtubeRoutes from './youtube.routes.ts';
import appRoutes from './app.routes.ts';

const router = Router();

router.use('/youtube', youtubeRoutes);
router.use('/app', appRoutes);

export default router;
