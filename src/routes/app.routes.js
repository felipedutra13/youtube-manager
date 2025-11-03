import { Router } from 'express';
import PlaylistController from '../controllers/playlist.js';
import EshopPricesController from '../controllers/eshop-prices.js';
import JustWatchController from '../controllers/just-watch.js';
import BackloggdController from '../controllers/backloggd.js';

const router = Router();
const playlistController = new PlaylistController();
const eshopPricesController = new EshopPricesController();
const justWatchController = new JustWatchController();
const backloggdController = new BackloggdController();

router.get('/getRandomPlaylistItem', playlistController.getRandomPlaylistItem);

router.get('/wishlist', eshopPricesController.listWishlistItems);

router.get('/getRandomMovie', justWatchController.getRandomMovie);
router.get('/getRandomTvshow', justWatchController.getRandomTvshow);

router.get('/getRandomVideogame', backloggdController.getRandomVideogame);

export default router;