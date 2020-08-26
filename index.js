//@ts-nocheck
const express = require("express");

const cors = require("cors");
const puppeteer = require("puppeteer");

const app = express();

const { downloadImage } = require("./controllers/download.js");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/", async (req, res) => {
  downloadImage(req, res);
});

app.listen(3000, () => {
  console.log("Connected to server");
});
