const express = require("express");
const fileUpload = require("express-fileupload");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const path = require("path");
const ethers = require("ethers");

const app = express();
app.use(express.static(__dirname));
app.use(fileUpload({ extended: true }));
app.use(express.json());

const port = 3000;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
