require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const { PRIVATE_KEY, RPC_URL } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */

module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: { chainId: 1337 },
    morphTestnet: {
      url: RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 2810,
      gasPrice: 2000000000,
    },
  },
};
