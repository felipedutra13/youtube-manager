import { Router } from 'express';
import YoutubeController from '../controllers/youtube';

const router = Router();
const youtubeController = new YoutubeController();

router.get('/playlist/:id', youtubeController.getPlaylist);

export default router;