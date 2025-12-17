const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(80));
  console.log("🥞 PANCAKESWAP V2 FARMING DEPLOYMENT - PHASE 3");
  console.log("🎯 MEME FINANCE (MMF) TOKEN WITH 1 BILLION PRE-MINE");
  console.log("=".repeat(80));

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);

  // Configuration
  const TOKENS_PER_BLOCK = process.env.TOKENS_PER_BLOCK || "40"; // 40 MMF per block
  const START_BLOCK = process.env.START_BLOCK || "0"; // Start immediately or specify block
  const DEV_ADDRESS = deployer.address; // Use deployer as dev address

  console.log("\n📋 DEPLOYMENT CONFIGURATION:");
  console.log("-".repeat(60));
  console.log(`Tokens per block: ${TOKENS_PER_BLOCK} MMF`);
  console.log(`Start block: ${START_BLOCK} (0 = current block)`);
  console.log(`Dev address: ${DEV_ADDRESS}`);

  // STEP 1: Deploy Meme Finance Token (MMF)
  console.log("\n" + "=".repeat(80));
  console.log("STEP 1: DEPLOYING MEME FINANCE TOKEN (MMF)");
  console.log("=".repeat(80));
  
  console.log("📦 Deploying MMF Token with 1 Billion pre-mine...");
  
  const CakeToken = await ethers.getContractFactory("CakeToken");
  const mmfToken = await CakeToken.deploy();
  await mmfToken.deployed();
  
  console.log("✅ MMF Token deployed successfully!");
  console.log(`📍 MMF Address: ${mmfToken.address}`);
  console.log(`🧾 Transaction Hash: ${mmfToken.deployTransaction.hash}`);

  // STEP 2: Verify Pre-Mine
  console.log("\n" + "=".repeat(80));
  console.log("STEP 2: VERIFYING 1 BILLION TOKEN PRE-MINE");
  console.log("=".repeat(80));
  
  const deployerBalance = await mmfToken.balanceOf(deployer.address);
  const totalSupply = await mmfToken.totalSupply();
  const tokenName = await mmfToken.name();
  const tokenSymbol = await mmfToken.symbol();
  
  console.log(`✅ Token Name: ${tokenName}`);
  console.log(`✅ Token Symbol: ${tokenSymbol}`);
  console.log(`✅ Total Supply: ${ethers.utils.formatEther(totalSupply)} MMF`);
  console.log(`✅ Deployer Balance: ${ethers.utils.formatEther(deployerBalance)} MMF`);
  
  if (deployerBalance.toString() === ethers.utils.parseEther("1000000000").toString()) {
    console.log("🎉 PRE-MINE SUCCESSFUL: 1 Billion MMF tokens minted to deployer!");
  } else {
    console.log("❌ PRE-MINE FAILED: Incorrect token amount!");
    process.exit(1);
  }

  // STEP 3: Deploy SyrupBar
  console.log("\n" + "=".repeat(80));
  console.log("STEP 3: DEPLOYING SYRUPBAR (STAKING CONTRACT)");
  console.log("=".repeat(80));
  
  console.log("📦 Deploying SyrupBar...");
  
  const SyrupBar = await ethers.getContractFactory("SyrupBar");
  const syrupBar = await SyrupBar.deploy(mmfToken.address);
  await syrupBar.deployed();
  
  console.log("✅ SyrupBar deployed successfully!");
  console.log(`📍 SyrupBar Address: ${syrupBar.address}`);
  console.log(`🧾 Transaction Hash: ${syrupBar.deployTransaction.hash}`);

  // STEP 4: Deploy MasterChef
  console.log("\n" + "=".repeat(80));
  console.log("STEP 4: DEPLOYING MASTERCHEF (FARMING CONTRACT)");
  console.log("=".repeat(80));
  
  console.log("📦 Deploying MasterChef...");
  
  // Get current block number if START_BLOCK is 0
  let startBlock = START_BLOCK;
  if (startBlock === "0") {
    startBlock = await ethers.provider.getBlockNumber();
    console.log(`🔍 Using current block as start block: ${startBlock}`);
  }
  
  const tokensPerBlock = ethers.utils.parseEther(TOKENS_PER_BLOCK);
  
  console.log("🚀 MasterChef deployment parameters:");
  console.log(`   MMF Token: ${mmfToken.address}`);
  console.log(`   SyrupBar: ${syrupBar.address}`);
  console.log(`   Dev Address: ${DEV_ADDRESS}`);
  console.log(`   Tokens per Block: ${TOKENS_PER_BLOCK} MMF`);
  console.log(`   Start Block: ${startBlock}`);
  
  const MasterChef = await ethers.getContractFactory("MasterChef");
  const masterChef = await MasterChef.deploy(
    mmfToken.address,
    syrupBar.address,
    DEV_ADDRESS,
    tokensPerBlock,
    startBlock
  );
  await masterChef.deployed();
  
  console.log("✅ MasterChef deployed successfully!");
  console.log(`📍 MasterChef Address: ${masterChef.address}`);
  console.log(`🧾 Transaction Hash: ${masterChef.deployTransaction.hash}`);

  // STEP 5: Ownership Transfer - THE "PERFECT" SETUP
  console.log("\n" + "=".repeat(80));
  console.log("STEP 5: OWNERSHIP TRANSFER - PERFECT SETUP");
  console.log("=".repeat(80));
  
  console.log("🔄 Transferring MMF Token ownership to MasterChef...");
  const mmfOwnershipTx = await mmfToken.transferOwnership(masterChef.address);
  await mmfOwnershipTx.wait();
  console.log("✅ MMF Token ownership transferred to MasterChef!");
  
  console.log("🔄 Transferring SyrupBar ownership to MasterChef...");
  const syrupOwnershipTx = await syrupBar.transferOwnership(masterChef.address);
  await syrupOwnershipTx.wait();
  console.log("✅ SyrupBar ownership transferred to MasterChef!");
  
  // Verify ownership transfers
  const mmfOwner = await mmfToken.owner();
  const syrupOwner = await syrupBar.owner();
  
  console.log("\n🔍 OWNERSHIP VERIFICATION:");
  console.log(`MMF Token Owner: ${mmfOwner}`);
  console.log(`SyrupBar Owner: ${syrupOwner}`);
  console.log(`MasterChef Address: ${masterChef.address}`);
  
  if (mmfOwner === masterChef.address && syrupOwner === masterChef.address) {
    console.log("🎉 PERFECT SETUP COMPLETED: MasterChef is now the owner of both contracts!");
  } else {
    console.log("❌ OWNERSHIP TRANSFER FAILED!");
    process.exit(1);
  }

  // STEP 6: Save Deployment Information
  console.log("\n" + "=".repeat(80));
  console.log("STEP 6: SAVING DEPLOYMENT INFORMATION");
  console.log("=".repeat(80));
  
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    mmfTokenAddress: mmfToken.address,
    syrupBarAddress: syrupBar.address,
    masterChefAddress: masterChef.address,
    deployer: deployer.address,
    devAddress: DEV_ADDRESS,
    tokensPerBlock: TOKENS_PER_BLOCK,
    startBlock: startBlock.toString(),
    preMineAmount: "1000000000",
    deploymentTime: new Date().toISOString(),
    transactionHashes: {
      mmfToken: mmfToken.deployTransaction.hash,
      syrupBar: syrupBar.deployTransaction.hash,
      masterChef: masterChef.deployTransaction.hash,
    },
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments-info");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}-farm-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);

  // FINAL OUTPUT
  console.log("\n" + "=".repeat(80));
  console.log("🎯 PHASE 3 DEPLOYMENT SUMMARY - MEME FINANCE");
  console.log("=".repeat(80));
  console.log(`🪙 MMF Token: ${mmfToken.address}`);
  console.log(`🍯 SyrupBar: ${syrupBar.address}`);
  console.log(`👨‍🌾 MasterChef: ${masterChef.address}`);
  console.log(`💰 Pre-Mine: 1,000,000,000 MMF (to ${deployer.address})`);
  console.log(`⚡ Rewards: ${TOKENS_PER_BLOCK} MMF per block`);
  console.log(`🏁 Start Block: ${startBlock}`);
  console.log("=".repeat(80));
  console.log("⚠️  SAVE THESE ADDRESSES! You'll need them for:");
  console.log("   1. SDK configuration (Phase 4)");
  console.log("   2. Frontend configuration (Phase 6)");
  console.log("   3. Adding liquidity pools to farming");
  console.log("=".repeat(80));

  console.log("\n🎉 PHASE 3 COMPLETED SUCCESSFULLY!");
  console.log("✅ 1 Billion MMF tokens are in your wallet for liquidity/marketing");
  console.log("✅ MasterChef can mint new MMF tokens for farming rewards");
  console.log("✅ Perfect setup achieved - ready for farming!");
  
  console.log("\n📋 Next Steps:");
  console.log("   1. Add liquidity pools to MasterChef for farming");
  console.log("   2. Proceed to Phase 4: SDK configuration");
  console.log("   3. Test farming functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Farm deployment failed:", error);
    process.exit(1);
  });