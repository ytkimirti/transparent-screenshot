#!/usr/bin/env node

const puppeteer = require('puppeteer');
const argv      = require('yargs').argv

require('yargs') // eslint-disable-line
  .usage('Usage: $0 screenshot [url] [image]')
  .command('screenshot [url] [image]', 'Take screenshot from URL to image file', (yargs) => {
    yargs
      .positional('url', {
        describe: 'URL to take screenshot from',
        default: 'https://example.com',
      })
      .positional('image', {
        describe: 'Path to write image file to',
        default: './screenshot.png',
      })
  }, (argv) => {
    console.warn('Taking screenshot from ' + argv.url + ' to ' + argv.image + '...');
    return takeScreenshot(argv.url, argv.image)
    .then(() => {
      console.warn('Done.');
    });
  })
  .argv;

async function takeScreenshot(url, image) {

  const chromiumBinPath = '/usr/bin/chromium-browser';
  const browser = await puppeteer.launch({
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process',

        '--ignore-certificate-errors',
    ],
    //pipe: true,
    ignoreHTTPSErrors: true,
    headless: true,
    executablePath: chromiumBinPath,
  });
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({
      path: image,
      omitBackground: true
  });

  await browser.close();

}
