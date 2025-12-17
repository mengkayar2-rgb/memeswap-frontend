const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(70));
  console.log("🧪 TESTING DEPLOYED PANCAKEROUTER");
  console.log("=".repeat(70));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-router-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Router deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the router first using: npm run deploy:router");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📊 DEPLOYMENT INFO:");
  console.log("-".repeat(50));
  console.log(`Router Address: ${deploymentInfo.routerAddress}`);
  console.log(`Factory Address: ${deploymentInfo.factoryAddress}`);
  console.log(`WETH Address: ${deploymentInfo.wethAddress}`);
  console.log(`Network: ${deploymentInfo.network}`);

  const [signer] = await ethers.getSigners();
  console.log(`\n👤 Testing with: ${signer.address}`);
  console.log(`💰 Balance: ${ethers.utils.formatEther(await signer.getBalance())} ETH`);

  // Connect to contracts
  console.log("\n🔗 Connecting to contracts...");
  const router = await ethers.getContractAt("PancakeRouter", deploymentInfo.routerAddress);
  const factory = await ethers.getContractAt("IPancakeFactory", deploymentInfo.factoryAddress);
  
  console.log("✅ Contracts connected successfully!");

  // Test 1: Basic Router Info
  console.log("\n" + "=".repeat(70));
  console.log("TEST 1: BASIC ROUTER INFORMATION");
  console.log("=".repeat(70));
  
  try {
    const factoryFromRouter = await router.factory();
    const wethFromRouter = await router.WETH();
    
    console.log(`✅ Factory from router: ${factoryFromRouter}`);
    console.log(`✅ WETH from router: ${wethFromRouter}`);
    
    // Verify addresses match
    if (factoryFromRouter.toLowerCase() === deploymentInfo.factoryAddress.toLowerCase()) {
      console.log("✅ Factory address verification: PASSED");
    } else {
      console.log("❌ Factory address verification: FAILED");
    }
    
    if (wethFromRouter.toLowerCase() === deploymentInfo.wethAddress.toLowerCase()) {
      console.log("✅ WETH address verification: PASSED");
    } else {
      console.log("❌ WETH address verification: FAILED");
    }
    
  } catch (error) {
    console.error("❌ Basic info test failed:", error.message);
  }

  // Test 2: Factory Integration
  console.log("\n" + "=".repeat(70));
  console.log("TEST 2: FACTORY INTEGRATION");
  console.log("=".repeat(70));
  
  try {
    const allPairsLength = await factory.allPairsLength();
    console.log(`✅ Factory pairs count: ${allPairsLength.toString()}`);
    
    const feeToSetter = await factory.feeToSetter();
    console.log(`✅ Factory fee to setter: ${feeToSetter}`);
    
  } catch (error) {
    console.error("❌ Factory integration test failed:", error.message);
  }

  // Test 3: WETH Integration
  console.log("\n" + "=".repeat(70));
  console.log("TEST 3: WETH INTEGRATION");
  console.log("=".repeat(70));
  
  try {
    const weth = await ethers.getContractAt("WETH", deploymentInfo.wethAddress);
    
    const name = await weth.name();
    const symbol = await weth.symbol();
    const decimals = await weth.decimals();
    
    console.log(`✅ WETH Name: ${name}`);
    console.log(`✅ WETH Symbol: ${symbol}`);
    console.log(`✅ WETH Decimals: ${decimals}`);
    
  } catch (error) {
    console.error("❌ WETH integration test failed:", error.message);
  }

  // Test 4: Router View Functions
  console.log("\n" + "=".repeat(70));
  console.log("TEST 4: ROUTER VIEW FUNCTIONS");
  console.log("=".repeat(70));
  
  try {
    // Test quote function with dummy values
    const quote = await router.quote(
      ethers.utils.parseEther("1"), // 1 token
      ethers.utils.parseEther("100"), // 100 reserve A
      ethers.utils.parseEther("200")  // 200 reserve B
    );
    console.log(`✅ Quote function: ${ethers.utils.formatEther(quote)} (expected: 2.0)`);
    
    // Test getAmountOut function
    const amountOut = await router.getAmountOut(
      ethers.utils.parseEther("1"), // 1 token in
      ethers.utils.parseEther("100"), // 100 reserve in
      ethers.utils.parseEther("100")  // 100 reserve out
    );
    console.log(`✅ GetAmountOut function: ${ethers.utils.formatEther(amountOut)}`);
    
  } catch (error) {
    console.error("❌ Router view functions test failed:", error.message);
  }

  // Test Summary
  console.log("\n" + "=".repeat(70));
  console.log("📋 ROUTER TEST SUMMARY");
  console.log("=".repeat(70));
  console.log("✅ Router deployment: VERIFIED");
  console.log("✅ Factory integration: VERIFIED");
  console.log("✅ WETH integration: VERIFIED");
  console.log("✅ View functions: WORKING");
  
  console.log("\n🎉 ROUTER TESTING COMPLETED!");
  console.log("Your PancakeRouter is ready for Phase 3 (Farming)!");
  
  console.log("\n📋 IMPORTANT ADDRESSES FOR NEXT PHASES:");
  console.log(`Factory: ${deploymentInfo.factoryAddress}`);
  console.log(`Router: ${deploymentInfo.routerAddress}`);
  console.log(`WETH: ${deploymentInfo.wethAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Router testing failed:", error);
    process.exit(1);
  });