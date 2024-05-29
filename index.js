const express = require('express');
const puppeteer = require('puppeteer-core');

const app = express();

const browserWSEndpoint = "wss://chrome.browserless.io?token=QC73jXUtJ47Ggt48d68ba609254924d64a7bb79877";

const getBrowser = async () => {
  return await puppeteer.connect({ browserWSEndpoint });
};

app.get('/', async (req, res) => {
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
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
