require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-etherscan");
require("hardhat-deploy");
require("dotenv").config();

// Monad Mainnet Configuration
const MONAD_RPC_URL = process.env.MONAD_RPC_URL || "https://monad-mainnet-rpc.com"; // Replace with actual Monad RPC
const PRIVATE_KEY = process.env.PRIVATE_KEY;

if (!PRIVATE_KEY) {
  console.error("Please set PRIVATE_KEY in your .env file");
  process.exit(1);
}

module.exports = {
  solidity: {
    version: "0.5.16",
    settings: {
      optimizer: {
        enabled: true,
        runs: 999999,
      },
      evmVersion: "istanbul"
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    monad: {
      url: MONAD_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 143, // Monad Mainnet Chain ID
      gasPrice: "auto",
      gas: "auto",
      timeout: 60000,
    },
  },
  etherscan: {
    apiKey: {
      monad: process.env.MONAD_EXPLORER_API_KEY || "dummy", // Replace with actual Monad explorer API key
    },
    customChains: [
      {
        network: "monad",
        chainId: 143,
        urls: {
          apiURL: "https://explorer.monad.xyz/api", // Replace with actual Monad explorer API
          browserURL: "https://explorer.monad.xyz" // Replace with actual Monad explorer URL
        }
      }
    ]
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
    feeToSetter: {
      default: 0, // Use deployer as initial fee setter
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};