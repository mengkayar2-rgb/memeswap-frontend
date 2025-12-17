const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(70));
  console.log("🥞 PANCAKESWAP V2 ROUTER DEPLOYMENT - PHASE 2");
  console.log("=".repeat(70));

  // Get deployer
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);

  // Configuration
  const FACTORY_ADDRESS = process.env.FACTORY_ADDRESS || "0xb48dBe6D4130f4a664075250EE702715748051d9";
  let WETH_ADDRESS = process.env.WETH_ADDRESS || "";

  console.log(`\n📍 Factory Address: ${FACTORY_ADDRESS}`);

  // Deploy WETH if not provided
  if (!WETH_ADDRESS || WETH_ADDRESS === "") {
    console.log("\n📦 No WETH address provided, deploying mock WETH (WMON)...");
    
    const WETH = await ethers.getContractFactory("WETH");
    const weth = await WETH.deploy();
    await weth.deployed();
    
    WETH_ADDRESS = weth.address;
    console.log(`✅ WETH (WMON) deployed: ${WETH_ADDRESS}`);
    console.log(`🧾 WETH Transaction: ${weth.deployTransaction.hash}`);
  } else {
    console.log(`\n🔗 Using existing WETH: ${WETH_ADDRESS}`);
  }

  console.log("=".repeat(70));
  console.log("📦 DEPLOYING PANCAKEROUTER...");
  console.log("=".repeat(70));

  // Deploy PancakeRouter
  const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
  
  console.log("🚀 Deploying router with parameters:");
  console.log(`   Factory: ${FACTORY_ADDRESS}`);
  console.log(`   WETH: ${WETH_ADDRESS}`);

  const router = await PancakeRouter.deploy(FACTORY_ADDRESS, WETH_ADDRESS);
  await router.deployed();

  console.log("✅ PancakeRouter deployed successfully!");
  console.log(`📍 Router Address: ${router.address}`);
  console.log(`🧾 Transaction Hash: ${router.deployTransaction.hash}`);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  try {
    const factoryFromRouter = await router.factory();
    const wethFromRouter = await router.WETH();
    
    console.log(`✅ Factory from router: ${factoryFromRouter}`);
    console.log(`✅ WETH from router: ${wethFromRouter}`);
    
    if (factoryFromRouter.toLowerCase() === FACTORY_ADDRESS.toLowerCase()) {
      console.log("✅ Factory address matches!");
    } else {
      console.log("❌ Factory address mismatch!");
    }
    
    if (wethFromRouter.toLowerCase() === WETH_ADDRESS.toLowerCase()) {
      console.log("✅ WETH address matches!");
    } else {
      console.log("❌ WETH address mismatch!");
    }
    
  } catch (error) {
    console.error("❌ Verification failed:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    factoryAddress: FACTORY_ADDRESS,
    routerAddress: router.address,
    wethAddress: WETH_ADDRESS,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    routerTransactionHash: router.deployTransaction.hash,
    gasUsed: router.deployTransaction.gasLimit?.toString(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments-info");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}-router-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);

  console.log("\n" + "=".repeat(70));
  console.log("🎯 PHASE 2 DEPLOYMENT SUMMARY");
  console.log("=".repeat(70));
  console.log(`🏭 Factory Address: ${FACTORY_ADDRESS}`);
  console.log(`🔄 Router Address: ${router.address}`);
  console.log(`💎 WETH Address: ${WETH_ADDRESS}`);
  console.log("=".repeat(70));
  console.log("⚠️  SAVE THESE ADDRESSES! You'll need them for:");
  console.log("   1. Farming contracts deployment (Phase 3)");
  console.log("   2. SDK configuration (Phase 4)");
  console.log("   3. Frontend configuration (Phase 6)");
  console.log("=".repeat(70));

  console.log("\n🎉 PHASE 2 COMPLETED SUCCESSFULLY!");
  console.log("📋 Next Steps:");
  console.log("   1. Test the router functionality");
  console.log("   2. Proceed to Phase 3: Deploy Farming contracts");
  console.log("   3. Update your records with the router address");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Router deployment failed:", error);
    process.exit(1);
  });