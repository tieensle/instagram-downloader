//@ts-nocheck
const express = require("express");

const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/controllers"));

const { downloadImage } = require("./controllers/download.js");

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const anh = [
  "https://instagram.fhan5-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/117562603_2365966393704493_3361804117184323377_n.jpg?_nc_ht=instagram.fhan5-5.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Rtv_lYy42OsAX9yHVMT&oh=edbef2e5aa2abad39e3d7e71d9154f70&oe=5F71A92B",
  "https://instagram.fhan5-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/117562603_2365966393704493_3361804117184323377_n.jpg?_nc_ht=instagram.fhan5-5.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Rtv_lYy42OsAX9yHVMT&oh=edbef2e5aa2abad39e3d7e71d9154f70&oe=5F71A92B",
  "https://instagram.fhan5-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/117562603_2365966393704493_3361804117184323377_n.jpg?_nc_ht=instagram.fhan5-5.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Rtv_lYy42OsAX9yHVMT&oh=edbef2e5aa2abad39e3d7e71d9154f70&oe=5F71A92B",
];

app.post("/img", async (req, res) => {
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
      const browser = await puppeteer.launch();
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

  // downloadImage(req, res);
});

app.listen(PORT, () => {
  console.log("Connected to server");
});
