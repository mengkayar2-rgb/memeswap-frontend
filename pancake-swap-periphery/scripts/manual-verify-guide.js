const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(80));
  console.log("📋 MANUAL CONTRACT VERIFICATION GUIDE - PANCAKESWAP PERIPHERY");
  console.log("=".repeat(80));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-router-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Router deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the router first using: npm run deploy:router");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📊 DEPLOYMENT INFORMATION:");
  console.log("-".repeat(60));
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Factory Address: ${deploymentInfo.factoryAddress}`);
  console.log(`Router Address: ${deploymentInfo.routerAddress}`);
  console.log(`WETH Address: ${deploymentInfo.wethAddress}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);
  
  // Generate ABI-encoded constructor arguments for Router
  const abiCoder = new ethers.utils.AbiCoder();
  const routerConstructorArgs = abiCoder.encode(
    ["address", "address"], 
    [deploymentInfo.factoryAddress, deploymentInfo.wethAddress]
  );
  
  console.log("\n" + "=".repeat(80));
  console.log("🔧 CONTRACT 1: WETH (WRAPPED MONAD)");
  console.log("=".repeat(80));
  console.log(`📍 Contract Address: ${deploymentInfo.wethAddress}`);
  console.log(`📝 Contract Name: WETH`);
  console.log(`📄 Source File: contracts/WETH.sol`);
  
  console.log("\n🔧 COMPILER SETTINGS:");
  console.log("-".repeat(50));
  console.log("Compiler Version: 0.6.6");
  console.log("Optimization: Enabled");
  console.log("Optimization Runs: 999999");
  console.log("EVM Version: istanbul");
  
  console.log("\n📝 CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log("No constructor arguments (default constructor)");
  
  console.log("\n🔢 ABI-ENCODED CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log("(Empty - no constructor arguments)");
  
  console.log("\n" + "=".repeat(80));
  console.log("🔧 CONTRACT 2: PANCAKEROUTER");
  console.log("=".repeat(80));
  console.log(`📍 Contract Address: ${deploymentInfo.routerAddress}`);
  console.log(`📝 Contract Name: PancakeRouter`);
  console.log(`📄 Source File: contracts/PancakeRouter.sol`);
  
  console.log("\n🔧 COMPILER SETTINGS:");
  console.log("-".repeat(50));
  console.log("Compiler Version: 0.6.6");
  console.log("Optimization: Enabled");
  console.log("Optimization Runs: 999999");
  console.log("EVM Version: istanbul");
  
  console.log("\n📝 CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(`factory (address): ${deploymentInfo.factoryAddress}`);
  console.log(`WETH (address): ${deploymentInfo.wethAddress}`);
  
  console.log("\n🔢 ABI-ENCODED CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(routerConstructorArgs);
  
  console.log("\n" + "=".repeat(80));
  console.log("📋 MANUAL VERIFICATION STEPS");
  console.log("=".repeat(80));
  
  console.log("🌐 STEP 1: GO TO MONAD BLOCK EXPLORER");
  console.log("-".repeat(50));
  console.log("URL: https://explorer.monad.xyz");
  console.log(`Network: Monad Mainnet (Chain ID: ${deploymentInfo.chainId})`);
  
  console.log("\n📄 STEP 2: VERIFY WETH CONTRACT");
  console.log("-".repeat(50));
  console.log(`1. Navigate to: https://explorer.monad.xyz/address/${deploymentInfo.wethAddress}`);
  console.log("2. Click 'Contract' tab");
  console.log("3. Click 'Verify and Publish'");
  console.log("4. Select verification method: 'Solidity (Single file)'");
  console.log("5. Enter contract details:");
  console.log("   - Contract Address: " + deploymentInfo.wethAddress);
  console.log("   - Contract Name: WETH");
  console.log("   - Compiler Version: 0.6.6");
  console.log("   - Optimization: Yes");
  console.log("   - Optimization Runs: 999999");
  console.log("   - EVM Version: istanbul");
  console.log("6. Paste WETH source code (see flattened file)");
  console.log("7. Constructor Arguments: (leave empty)");
  console.log("8. Submit verification");
  
  console.log("\n🔄 STEP 3: VERIFY ROUTER CONTRACT");
  console.log("-".repeat(50));
  console.log(`1. Navigate to: https://explorer.monad.xyz/address/${deploymentInfo.routerAddress}`);
  console.log("2. Click 'Contract' tab");
  console.log("3. Click 'Verify and Publish'");
  console.log("4. Select verification method: 'Solidity (Single file)'");
  console.log("5. Enter contract details:");
  console.log("   - Contract Address: " + deploymentInfo.routerAddress);
  console.log("   - Contract Name: PancakeRouter");
  console.log("   - Compiler Version: 0.6.6");
  console.log("   - Optimization: Yes");
  console.log("   - Optimization Runs: 999999");
  console.log("   - EVM Version: istanbul");
  console.log("6. Paste Router source code (see flattened file)");
  console.log("7. Constructor Arguments (ABI-encoded):");
  console.log("   " + routerConstructorArgs);
  console.log("8. Submit verification");
  
  console.log("\n📁 STEP 4: PREPARE SOURCE CODE");
  console.log("-".repeat(50));
  console.log("Run these commands to generate flattened source code:");
  console.log("npm run flatten:weth");
  console.log("npm run flatten:router");
  console.log("");
  console.log("Files will be created in the 'flattened/' directory");
  
  console.log("\n🔍 STEP 5: VERIFICATION CHECKLIST");
  console.log("-".repeat(50));
  console.log("Before submitting verification, ensure:");
  console.log("□ Contract addresses are correct");
  console.log("□ Compiler version is exactly 0.6.6");
  console.log("□ Optimization is enabled with 999999 runs");
  console.log("□ EVM version is set to istanbul");
  console.log("□ Source code is flattened and complete");
  console.log("□ Constructor arguments are ABI-encoded correctly");
  console.log("□ Network is Monad Mainnet");
  
  console.log("\n⚠️  TROUBLESHOOTING:");
  console.log("-".repeat(50));
  console.log("If verification fails:");
  console.log("- Double-check compiler version (must be exactly 0.6.6)");
  console.log("- Ensure optimization settings match deployment");
  console.log("- Verify constructor arguments are properly encoded");
  console.log("- Try using multi-file upload if single file fails");
  console.log("- Check that source code includes all dependencies");
  
  console.log("\n🌐 BLOCK EXPLORER URLS:");
  console.log("-".repeat(50));
  console.log("Monad Explorer: https://explorer.monad.xyz");
  console.log(`WETH Contract: https://explorer.monad.xyz/address/${deploymentInfo.wethAddress}`);
  console.log(`Router Contract: https://explorer.monad.xyz/address/${deploymentInfo.routerAddress}`);
  console.log(`Factory Contract: https://explorer.monad.xyz/address/${deploymentInfo.factoryAddress}`);
  
  console.log("\n" + "=".repeat(80));
  console.log("✅ MANUAL VERIFICATION GUIDE COMPLETED");
  console.log("=".repeat(80));
  console.log("Follow the steps above to verify your contracts on Monad Explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Manual verification guide failed:", error);
    process.exit(1);
  });