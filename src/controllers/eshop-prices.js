import EshopPrices from "../services/eshop-prices.js";

class EshopPricesController {
    async listWishlistItems(req, res) {
        const eshopPricesService = new EshopPrices();

        const response = await eshopPricesService.listWishlistItems();

        res.json({ content: response });
    }
};

export default EshopPricesController;