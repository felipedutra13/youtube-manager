import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium";
import * as cheerio from "cheerio";

function extractPrices(html) {
    function cleanPrice(text) {
        if (!text) return null;
        return parseFloat(
            text
                .replace(/[^\d.,]/g, "")
                .replace(/\./g, "")
                .replace(",", ".")
        );
    }

    function getFlagId($el, $) {
        const useEls = $el.find(".price use").toArray();

        const href = useEls
            .map(u => $(u).attr("xlink:href") || $(u).attr("href") || "")
            .find(h => h.includes("/flags-") && h.includes("#"));

        return href ? href.split("#").pop() : null;
    }

    function getDiscount($scope) {
        const raw = $scope.find(".discount").first().text().trim();
        if (!raw) return null;
        const m = raw.match(/(\d+)\s*%/);
        return m ? `${m[1]}%` : null;
    }

    console.log(html);

    const $ = cheerio.load(html);

    const games = [];
    $(".games-list a.games-list-item").each((i, el) => {
        const $el = $(el);

        const title = $el.find("h5").first().text().trim();

        const originalPriceText = $el.find(".price-tag del").first().text().trim();
        const currentPriceText = $el.find(".price-tag").first().clone().children("del").remove().end().text().trim();

        const originalPrice = cleanPrice(originalPriceText);
        const price = cleanPrice(currentPriceText);

        const discount = getDiscount($el);
        const flag = getFlagId($el, $);

        if (title && price != null) {
            games.push({
                title,
                originalPrice: ("R$" + originalPrice) ?? null,
                price: "R$" + price,
                discount,
                flag
            });
        }
    });

    return games;
}

function filterByCountries(list) {
    const AVAILABLE_COUNTRIES = ['i-flag-br', 'i-flag-ca', 'i-flag-cl', 'i-flag-mx', 'i-flag-co', 'i-flag-pe', 'i-flag-us'];

    return list.filter(item => AVAILABLE_COUNTRIES.find(country => country === item.flag));
}

function sortByDiscount(list) {
    return list.sort((a, b) => {
        let aDiscount = a.discount.split('%')[0];
        let bDiscount = b.discount.split('%')[0];

        return Number(aDiscount) < Number(bDiscount) ? 1 : -1;
    });
}

class EshopPrices {

    async listWishlistItems() {
        let items = [];
        let finished = false;
        let currentPage = 1;

        const isLocal = process.env.NODE_ENV !== "production";


        do {
            const browser = await puppeteer.launch(
                isLocal
                    ? { headless: false }
                    : {
                        headless: true,
                        executablePath: await chromium.executablePath(),
                        args: chromium.args,
                        defaultViewport: chromium.defaultViewport,
                    }
            );
            let page = await browser.newPage();

            console.log("Raw COOKIE value from env:", process.env.ESHOP_PRICES_TOKEN);

            await page.setCookie({
                name: "_eps",
                value: process.env.ESHOP_PRICES_TOKEN,
                domain: "eshop-prices.com",
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "Strict"
            });

            const cookies = await page.cookies("https://eshop-prices.com");

            console.log("Cookies in browser:", cookies);

            await page.goto(`https://eshop-prices.com/wishlist?currency=BRL&page=${currentPage}&sort_by=discount&direction=desc`);

            let response = extractPrices(await page.content());
            if (!response || !response.length) {
                finished = true;
            } else {
                items.push(...response);
            }

            await browser.close();

            currentPage++;
        } while (!finished);

        return sortByDiscount(filterByCountries(items));
    }
};

export default EshopPrices;