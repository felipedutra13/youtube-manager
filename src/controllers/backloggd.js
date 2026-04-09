import Backloggd from "../services/backloggd.js";

class BackloggdController {
    async getRandomVideogame(req, res) {
        let { platform } = req.query;

        if (!Array.isArray(platform)) {
            platform = [platform];
        }

        const backloggdService = new Backloggd();

        const response = await backloggdService.getRandomVideogame(platform);

        return res.json({ success: true, response });

    }
};

export default BackloggdController;