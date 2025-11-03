import JustWatch from "../services/just-watch.js";

class JustWatchController {
    async getRandomMovie(req, res) {
        const { minDuration, maxDuration, minScore } = req.query;

        const justWatchService = new JustWatch();

        const response = await justWatchService.getRandomMovie(minDuration, maxDuration, minScore);

        return res.json({ success: true, response: response });

    }

    async getRandomTvshow(req, res) {
        const { minScore, viewType, animation } = req.query;

        const justWatchService = new JustWatch();

        const response = await justWatchService.getRandomTvshow(minScore, viewType, animation);

        return res.json({ success: true, response: response });

    }
};

export default JustWatchController;