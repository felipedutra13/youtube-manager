import * as cheerio from "cheerio";
import axios from "axios";
import { platforms } from '../config/backloggd.js';

// const TARGET_URL = "https://backloggd.com/u/felipedutra13/backlog/added/type:backlog?page=1";
const TARGET_URL = "https://backloggd.com/u/felipedutra13/backlog/added/type:backlog";//;played_platform:win/"

function getPlatformIdentifier(platform) {
    if (!platforms[platform]) {
        throw "Platform not found";
    }

    return platforms[platform];
}

function getRandomElementList(list) {
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

function extractGames(html) {
    const $ = cheerio.load(html);

    const gameNames = [];

    $(".game-text-centered").each((i, el) => {
        const name = $(el).text().trim();
        if (name) gameNames.push(name);
    });

    return gameNames;
}

class Backloggd {
    async getRandomVideogame(platform) {
        let items = [];
        let finished = false;
        let currentPage = 1;

        let baseTarget = TARGET_URL;

        if (platform) {
            baseTarget += `;played_platform:${getPlatformIdentifier(platform)}/`;
        }

        do {
            let target = `${baseTarget}?page=${currentPage}`;
            console.log(target);

            const config = {
                'method': 'GET',
                'url': target,
                'headers': {},
                'data': {}
            };

            let response = await axios(config);

            let result = extractGames(response.data);
            if (result.length < 40) {
                finished = true;
            }

            items.push(...result);

            currentPage++;
        } while (!finished);

        console.log(items);
        return getRandomElementList(items);
    }
};

export default Backloggd;