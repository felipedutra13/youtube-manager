import puppeteer from 'puppeteer';
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

        do {

            let browser = await puppeteer.launch({ headless: false });
            let page = await browser.newPage();

            await page.setCookie({
                name: "_eps",
                value: "2SpYAHELtoulMJmT2frdmVQJjyWUeh2%2FSBb9rWeZg%2Fqm6kltIX%2F6xcMMMZCBXcy72%2BKvQeCU8XTHF5ReAlhT6cxRGU%2BPKhOaz%2Beh4W1%2Fs8B13ctMtW6IcatDu2aUCNpFPL7ek3lSt%2FT50t7%2Bly0Hjl%2Bd3XAacPUWbIhNROa11v78ZLNLvNGrQklOswQbgYAPBxU5CE74G%2Bgy8Z1X8cADdWLws21hqQG8%2FZYg2PqkbLXnSYwmlUDjMf%2FijVzWvSMdlalU2CGTheoS2RrROZYXbU2otA2SpQtI4l5wOxBJwHHtOyUT6VFs%2BQrcbmVRp4KNQLmKX1NA9T%2FY9rDWPm5xSq1h7MoDHd31Y%2BtGTLdf71MYJC4rYZ7FnJaV%2FOCWUBDMJS3HIyeisyOQDXBO6%2FEIiROGvXz0NqPI1XLSGggrfR8r2f9RXmkfQA%2B44lznl%2FVBvsjxUmyGuTWSNcFJmmpJLylygs4UPvpbpf5zZR0nupOjDF1%2BXzxUWkZvIIaEnE8IZCHGPqb1H6p9x%2FtMyv0%3D--0LbIsN%2Br6vt3%2FAWO--QI4mV4TtG4zNZPdCkczgfg%3D%3D",
                domain: "eshop-prices.com",
                path: "/",
                httpOnly: true,
                secure: true,
                sameSite: "Strict"
            });

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