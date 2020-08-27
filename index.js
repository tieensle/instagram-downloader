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

app.post("/img", async (req, res) => {
  downloadImage(req, res);
});

app.listen(PORT, () => {
  console.log("Connected to server");
});
