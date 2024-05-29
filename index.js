// handler.js
import { chromium } from 'playwright-chromium';

export default async function handler(request, response) {
    const url = 'https://vienze.com';

    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);

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

        // Mengirim kembali hasil sebagai respons JSON
        response.setHeader('Content-Type', 'application/json');
        response.send(JSON.stringify(links));
    } catch (error) {
        response.status(500).json({ error: error.message });
    }
}
