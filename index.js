const puppeteer = require('puppeteer-core');

async function getLinks() {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-scrollbars',
            '--disable-web-security'
        ]
    });
    const page = await browser.newPage();
    await page.goto('https://example.com');

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

exports.handler = async (event) => {
    try {
        const links = await getLinks();
        return {
            statusCode: 200,
            body: JSON.stringify(links)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
