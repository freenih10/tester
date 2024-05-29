const puppeteer = require('puppeteer-core');

const browserWSEndpoint = "wss://chrome.browserless.io?token=QC73jXUtJ47Ggt48d68ba609254924d64a7bb79877";

// Fungsi untuk mendapatkan browser
const getBrowser = async () => {
  return await puppeteer.connect({ browserWSEndpoint });
};

module.exports = async (req, res) => {
  let browser = null;

  try {
    browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto("https://vienze.com");

    const links = await page.evaluate(() => {
      const anchorTags = document.querySelectorAll('a');
      return Array.from(anchorTags).map(anchor => anchor.href);
    });

    res.status(200).json(links);
  } catch (error) {
    res.status(400).send(error.message);
  } finally {
    if (browser) await browser.close();
  }
};
