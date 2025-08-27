import { Router } from 'express';
import PlaylistController from '../controllers/playlist.js';
import EshopPricesController from '../controllers/eshop-prices.js';

const router = Router();
const playlistController = new PlaylistController();
const eshopPricesController = new EshopPricesController();

router.get('/getRandomPlaylistItem', playlistController.getRandomPlaylistItem);
router.get('/wishlist', eshopPricesController.listWishlistItems);

export default router;