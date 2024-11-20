const express = require("express");
const fileUpload = require("express-fileupload");
const { Web3Storage, getFilesFromPath } = require("web3.storage");
const path = require("path");
const ethers = require("ethers");
require("dotenv").config();

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
      console.log("File uploaded to server succesfully!");
    });
  }

  async function uploadDataToIPFS() {
    const token =
      "MgCZgdznLINO5KLnqoTqAGLpDodjocXB9LPDBImTlEe6VoO0BmBSusup7Ca92uDlON2oDf027wmUZo7ex57QzF1tU2I0=";
    const storage = new Web3Storage({ token: token });
    const files = await getFilesFromPath(__dirname + `/${filename}`);
    console.log("Uploading files to IPFS...please wait!");
    const cid = storage.put(files);
    console.log(`IPFS: ${cid}`);
    return cid;
  }

  async function storeDataInBlockchain(hash) {
    const RPC_URL = process.env.RPC_URL;
    const PRIVATE_KEY = process.env.PRIVATE_KEY;
    const CONTRACT_ADDRESS_1 = process.env.CONTRACT_ADDRESS;

    // Contract ABI
    const {
      abi,
    } = require("./artifacts/contracts/IPFShashStorage.sol/IPFShashStorage.json");
    const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

    // It calculates the blockchain address from Private Key
    const signer = new ethers.Wallet(PRIVATE_KEY, provider);
    console.log(signer);

    const StorageContract = new ethers.Contract(
      CONTRACT_ADDRESS_1,
      abi,
      signer
    );

    // Convert Hash to string
    let _hash = hash.toString();

    const isStored = await StorageContract.isFileStored(name);

    if (isStored == false) {
      console.log("Storing the IPFS hash...");
      const tx = await StorageContract.upload(name, _hash);
      await tx.wait();
      const storedHash = await StorageContract.getIPFShash(name);
      res.send(`IPFS hash is stored in the smart contract: ${storedHash}`);
    }
  }
});
