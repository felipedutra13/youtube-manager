import { Router } from 'express';
import PlaylistController from '../controllers/playlist.js';

const router = Router();
const playlistController = new PlaylistController();

router.get('/getRandomPlaylistItem/:id', playlistController.getRandomPlaylistItem);

export default router;