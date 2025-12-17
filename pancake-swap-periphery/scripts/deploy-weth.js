const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(60));
  console.log("💎 DEPLOYING WETH (WMON) CONTRACT");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH`);

  // Deploy WETH
  const WETH = await ethers.getContractFactory("WETH");
  const weth = await WETH.deploy();
  await weth.deployed();

  console.log("✅ WETH (WMON) deployed successfully!");
  console.log(`📍 WETH Address: ${weth.address}`);
  console.log(`🧾 Transaction Hash: ${weth.deployTransaction.hash}`);

  // Test basic functionality
  console.log("\n🧪 Testing WETH functionality...");
  
  const name = await weth.name();
  const symbol = await weth.symbol();
  const decimals = await weth.decimals();
  
  console.log(`✅ Name: ${name}`);
  console.log(`✅ Symbol: ${symbol}`);
  console.log(`✅ Decimals: ${decimals}`);

  console.log("\n🎯 WETH DEPLOYMENT COMPLETED!");
  console.log(`Use this address in your .env: WETH_ADDRESS=${weth.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ WETH deployment failed:", error);
    process.exit(1);
  });