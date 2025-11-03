import Backloggd from "../services/backloggd.js";

class BackloggdController {
    async getRandomVideogame(req, res) {
        const { platform } = req.query;

        const backloggdService = new Backloggd();

        const response = await backloggdService.getRandomVideogame(platform);

        return res.json({ success: true, response });

    }
};

export default BackloggdController;