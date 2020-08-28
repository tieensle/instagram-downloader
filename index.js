//@ts-nocheck
const express = require("express");

const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();
const PORT = process.env.PORT || 3000;
const { downloadImage } = require("./controllers/download.js");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/controllers"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

const anh = [
  "https://instagram.fhan5-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/117562603_2365966393704493_3361804117184323377_n.jpg?_nc_ht=instagram.fhan5-5.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Rtv_lYy42OsAX9yHVMT&oh=edbef2e5aa2abad39e3d7e71d9154f70&oe=5F71A92B",
  "https://instagram.fhan5-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/117562603_2365966393704493_3361804117184323377_n.jpg?_nc_ht=instagram.fhan5-5.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Rtv_lYy42OsAX9yHVMT&oh=edbef2e5aa2abad39e3d7e71d9154f70&oe=5F71A92B",
  "https://instagram.fhan5-5.fna.fbcdn.net/v/t51.2885-15/sh0.08/e35/c0.125.1440.1440a/s640x640/117562603_2365966393704493_3361804117184323377_n.jpg?_nc_ht=instagram.fhan5-5.fna.fbcdn.net&_nc_cat=101&_nc_ohc=Rtv_lYy42OsAX9yHVMT&oh=edbef2e5aa2abad39e3d7e71d9154f70&oe=5F71A92B",
];

app.post("/img", async (req, res) => {
  res.json({
    imgs: anh,
  });
  // downloadImage(req, res);
});

app.listen(PORT, () => {
  console.log("Connected to server");
});
