const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function checkContractStatus(address, name) {
  console.log(`\n🔍 Checking ${name} at ${address}...`);
  
  try {
    // Check if contract exists
    const code = await ethers.provider.getCode(address);
    if (code === "0x") {
      console.log(`❌ ${name}: No contract found at address`);
      return false;
    }
    
    console.log(`✅ ${name}: Contract exists (${code.length} bytes)`);
    
    // Get transaction count (nonce) to verify it's a contract
    const txCount = await ethers.provider.getTransactionCount(address);
    console.log(`📊 ${name}: Transaction count: ${txCount}`);
    
    // Try to get contract creation transaction
    try {
      const balance = await ethers.provider.getBalance(address);
      console.log(`💰 ${name}: Balance: ${ethers.utils.formatEther(balance)} ETH`);
    } catch (error) {
      console.log(`⚠️  ${name}: Could not fetch balance`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ ${name}: Error checking contract - ${error.message}`);
    return false;
  }
}

async function testContractFunctions(deploymentInfo) {
  console.log("\n" + "=".repeat(70));
  console.log("🧪 TESTING CONTRACT FUNCTIONS");
  console.log("=".repeat(70));
  
  try {
    // Test WETH contract
    console.log("\n💎 Testing WETH contract...");
    const weth = await ethers.getContractAt("WETH", deploymentInfo.wethAddress);
    
    const wethName = await weth.name();
    const wethSymbol = await weth.symbol();
    const wethDecimals = await weth.decimals();
    
    console.log(`✅ WETH Name: ${wethName}`);
    console.log(`✅ WETH Symbol: ${wethSymbol}`);
    console.log(`✅ WETH Decimals: ${wethDecimals}`);
    
    // Test Router contract
    console.log("\n🔄 Testing Router contract...");
    const router = await ethers.getContractAt("PancakeRouter", deploymentInfo.routerAddress);
    
    const routerFactory = await router.factory();
    const routerWETH = await router.WETH();
    
    console.log(`✅ Router Factory: ${routerFactory}`);
    console.log(`✅ Router WETH: ${routerWETH}`);
    
    // Verify connections
    if (routerFactory.toLowerCase() === deploymentInfo.factoryAddress.toLowerCase()) {
      console.log("✅ Router -> Factory connection: VERIFIED");
    } else {
      console.log("❌ Router -> Factory connection: FAILED");
    }
    
    if (routerWETH.toLowerCase() === deploymentInfo.wethAddress.toLowerCase()) {
      console.log("✅ Router -> WETH connection: VERIFIED");
    } else {
      console.log("❌ Router -> WETH connection: FAILED");
    }
    
    // Test Factory connection
    console.log("\n🏭 Testing Factory connection...");
    const factory = await ethers.getContractAt("IPancakeFactory", deploymentInfo.factoryAddress);
    
    const allPairsLength = await factory.allPairsLength();
    const feeToSetter = await factory.feeToSetter();
    
    console.log(`✅ Factory Pairs: ${allPairsLength.toString()}`);
    console.log(`✅ Factory Fee To Setter: ${feeToSetter}`);
    
    return true;
    
  } catch (error) {
    console.error("❌ Function testing failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("=".repeat(70));
  console.log("📊 CONTRACT STATUS CHECKER");
  console.log("=".repeat(70));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-router-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📋 DEPLOYMENT SUMMARY:");
  console.log("-".repeat(50));
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  
  // Check network connection
  console.log("\n🌐 NETWORK STATUS:");
  console.log("-".repeat(50));
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    const gasPrice = await ethers.provider.getGasPrice();
    console.log(`✅ Current Block: ${blockNumber}`);
    console.log(`✅ Gas Price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
  } catch (error) {
    console.log("❌ Network connection failed:", error.message);
    process.exit(1);
  }
  
  // Check all contracts
  console.log("\n" + "=".repeat(70));
  console.log("🔍 CONTRACT EXISTENCE CHECK");
  console.log("=".repeat(70));
  
  const factoryExists = await checkContractStatus(deploymentInfo.factoryAddress, "Factory");
  const routerExists = await checkContractStatus(deploymentInfo.routerAddress, "Router");
  const wethExists = await checkContractStatus(deploymentInfo.wethAddress, "WETH");
  
  // Test contract functions if all exist
  if (factoryExists && routerExists && wethExists) {
    const functionsWork = await testContractFunctions(deploymentInfo);
    
    console.log("\n" + "=".repeat(70));
    console.log("📊 FINAL STATUS REPORT");
    console.log("=".repeat(70));
    
    console.log("Contract Deployment Status:");
    console.log(`🏭 Factory: ${factoryExists ? '✅ DEPLOYED' : '❌ MISSING'}`);
    console.log(`🔄 Router: ${routerExists ? '✅ DEPLOYED' : '❌ MISSING'}`);
    console.log(`💎 WETH: ${wethExists ? '✅ DEPLOYED' : '❌ MISSING'}`);
    console.log(`🧪 Functions: ${functionsWork ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (factoryExists && routerExists && wethExists && functionsWork) {
      console.log("\n🎉 ALL SYSTEMS OPERATIONAL!");
      console.log("✅ Ready for contract verification");
      console.log("✅ Ready for Phase 3 deployment");
    } else {
      console.log("\n⚠️  ISSUES DETECTED!");
      console.log("❌ Some contracts or functions are not working");
      console.log("💡 Check deployment and network connection");
    }
    
  } else {
    console.log("\n❌ CRITICAL: Some contracts are missing!");
    console.log("💡 Redeploy missing contracts before proceeding");
  }
  
  console.log("\n🌐 VERIFICATION LINKS:");
  console.log("-".repeat(50));
  console.log(`Factory: https://explorer.monad.xyz/address/${deploymentInfo.factoryAddress}`);
  console.log(`Router: https://explorer.monad.xyz/address/${deploymentInfo.routerAddress}`);
  console.log(`WETH: https://explorer.monad.xyz/address/${deploymentInfo.wethAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Status check failed:", error);
    process.exit(1);
  });