// handler.js
const puppeteer = require('puppeteer');

async function getLinks() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://vienze.com');

    // Mengambil semua elemen <a> dari halaman web
    const links = await page.evaluate(() => {
        const anchorTags = Array.from(document.querySelectorAll('a'));
        return anchorTags.map(tag => {
            return {
                href: tag.href,
                text: tag.innerText
            };
        });
    });

    await browser.close();
    return links;
}

export default async function handler(request, response) {
    try {
        const links = await getLinks();
        response.status(200).json(links);
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}
