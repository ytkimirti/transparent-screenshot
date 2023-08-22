#!/usr/bin/env node

const puppeteer = require("puppeteer");
const fs = require("fs");

async function takeScreenshot(url, image) {
  console.log("takeScreenshot: " + url + " -> " + image);
  const browser = await puppeteer.launch({
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",

      "--ignore-certificate-errors",
    ],
    //pipe: true,
    ignoreHTTPSErrors: true,
    headless: true,
    // executablePath: chromiumBinPath,
  });
  const page = await browser.newPage();

  await page.goto(url);

  console.log("page.goto done");

  await page.setViewport({
    width: 1920,
    height: 1080,
    deviceScaleFactor: 4,
  });

  // Inject css
  await page.addStyleTag({
    content: `
    * {
      background-color: transparent !important;
    }
    `,
  });

  await page.screenshot({
    path: image,
    omitBackground: true,
    fullPage: true,
  });

  console.log(`screenshot of ${url} done`);

  await browser.close();
}

const first = process.argv[2];

let urlsToScan = [];

if (first.endsWith(".txt")) {
  urlsToScan = fs.readFileSync(first).toString().split("\n");
} else {
  urlsToScan.push(first);
}

for (const url of urlsToScan) {
  console.log("url: " + url);

  // Current date
  const date = new Date().toISOString().replace(/:/g, "-") + ".png";
  const img = "img_" + date;

  takeScreenshot(url, img);
}
