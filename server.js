//@ts-nocheck
const express = require("express");
const downloadImage = require("image-downloader");
const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

require("dotenv").config();

const USERNAME_SELECTOR =
  "#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(2) > div > label > input";
const PASSWORD_SELECTOR =
  "#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(3) > div > label > input";

const BTN_SELECTOR =
  "#react-root > section > main > div > article > div > div:nth-child(1) > div > form > div:nth-child(4) > button";

const USERNAME = process.env.NAME;
const PASSWORD = process.env.PASS;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);

app.post("/", async (req, res) => {
  const { url } = await req.body;
  // res.json({
  //   test: "test",
  // })
  (async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);
    page.setViewport({
      width: 1280,
      height: 720,
    });
    await page.goto(url);
    await page.waitForSelector(USERNAME_SELECTOR);
    await page.waitForSelector(PASSWORD_SELECTOR);
    await page.waitForSelector(BTN_SELECTOR);
    await page.type(USERNAME_SELECTOR, USERNAME);
    await page.type(PASSWORD_SELECTOR, PASSWORD);
    await page.click(BTN_SELECTOR);

    await page.waitForNavigation();
    await page.waitForSelector(
      "#react-root > section > main > div > div > div > div > button"
    );
    await page.click(
      "#react-root > section > main > div > div > div > div > button"
    );
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
              console.log("this is bottom!");
              allImgs = new Set(allImgs);
              allImgs = [...allImgs];
              console.log(allImgs);
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
    console.log("Finished");
    res.json({
      imgs: imgLinks,
    });
    await browser.close();
  })();
});

app.listen(3000, () => {
  console.log("Connected to server");
});
