import { Router } from 'express';
import youtubeRoutes from './youtube.routes';
import appRoutes from './app.routes';

const router = Router();

router.use('/youtube', youtubeRoutes);
router.use('/app', appRoutes);

export default router;
