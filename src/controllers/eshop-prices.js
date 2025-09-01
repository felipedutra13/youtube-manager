import EshopPrices from "../services/eshop-prices.js";

class EshopPricesController {
    async listWishlistItems(req, res) {
        const { filterRegion = false } = req.query;

        const eshopPricesService = new EshopPrices();

        const response = await eshopPricesService.listWishlistItems(filterRegion);

        res.json({ content: response });
    }
};

export default EshopPricesController;