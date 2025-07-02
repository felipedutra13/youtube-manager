import { Router } from 'express';
import PlaylistController from '../controllers/playlist';

const router = Router();
const playlistController = new PlaylistController();

router.get('/getRandomPlaylistItem/:playlistTitle', playlistController.getRandomPlaylistItem);

export default router;