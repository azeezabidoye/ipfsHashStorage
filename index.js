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
app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.post("uploadData", async (req, res) => {
  let name = req.body.filename;
  let sampleFile = req.files.file1;
  let filename = req.files.file1.name;

  async function moveFileToServer() {
    sampleFile.mv(__dirname, +`${filename}`, (error) => {
      if (error) {
        res.status(500).send(error);
      }
    });
    console.log("File uploaded to server succesfully!");
  }
});
