//@ts-nocheck
const puppeteer = require("puppeteer");
require("dotenv").config();

const USERNAME_SELECTOR =
  "#loginForm > div > div:nth-child(1) > div > label > input";
const PASSWORD_SELECTOR =
  "#loginForm > div > div:nth-child(2) > div > label > input";

const BTN_SELECTOR = "#loginForm > div > div:nth-child(3) > button";
const USERNAME = process.env.NAME;
const PASSWORD = process.env.PASS;

const downloadImage = async (req, res) => {
  const { url } = await req.body;
  (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    page.setViewport({
      width: 1280,
      height: 720,
    });
    await page.goto(url);
    console.log(url);
    await page.waitForSelector(USERNAME_SELECTOR);
    await page.waitForSelector(PASSWORD_SELECTOR);
    await page.waitForSelector(BTN_SELECTOR);
    await page.type(USERNAME_SELECTOR, USERNAME);
    await page.type(PASSWORD_SELECTOR, PASSWORD);
    await page.click(BTN_SELECTOR);

    await page.waitForNavigation();

    page.goto(url);

    await page.waitForNavigation();

    const imgLinks = await page.evaluate(async () => {
      const promise = new Promise(async (resolve, reject) => {
        try {
          let allImgs = [];
          const timer = await setInterval(async () => {
            let imgs = await document.querySelectorAll("img.FFVAD");
            imgs = [...imgs];
            const imgSrc = imgs.map((e) => e.getAttribute("src"));
            allImgs.push(...imgSrc);
            window.scrollBy(0, window.innerHeight);
            const scrollBefore = window.scrollY;
            window.scrollBy(0, window.innerHeight);
            if (window.scrollY === scrollBefore) {
              allImgs = new Set(allImgs);
              allImgs = [...allImgs];

              clearInterval(timer);
              resolve(allImgs);
            }
          }, 3500);
        } catch (error) {
          reject(error.message);
        }
      });
      return promise;
    });
    res.json({
      imgs: imgLinks,
    });
    await browser.close();
  })();
};

module.exports = { downloadImage };
