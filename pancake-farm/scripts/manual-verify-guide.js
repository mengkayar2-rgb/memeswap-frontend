const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(80));
  console.log("📋 MANUAL CONTRACT VERIFICATION GUIDE - MEME FINANCE FARM");
  console.log("=".repeat(80));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-farm-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Farm deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the farm first using: npm run deploy:farm");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📊 DEPLOYMENT INFORMATION:");
  console.log("-".repeat(60));
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`MMF Token: ${deploymentInfo.mmfTokenAddress}`);
  console.log(`SyrupBar: ${deploymentInfo.syrupBarAddress}`);
  console.log(`MasterChef: ${deploymentInfo.masterChefAddress}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);
  
  // Generate ABI-encoded constructor arguments
  const abiCoder = new ethers.utils.AbiCoder();
  
  // SyrupBar constructor args: (IBEP20 _cake)
  const syrupConstructorArgs = abiCoder.encode(
    ["address"], 
    [deploymentInfo.mmfTokenAddress]
  );
  
  // MasterChef constructor args: (CakeToken _cake, SyrupBar _syrup, address _devaddr, uint256 _cakePerBlock, uint256 _startBlock)
  const masterChefConstructorArgs = abiCoder.encode(
    ["address", "address", "address", "uint256", "uint256"], 
    [
      deploymentInfo.mmfTokenAddress,
      deploymentInfo.syrupBarAddress,
      deploymentInfo.devAddress,
      ethers.utils.parseEther(deploymentInfo.tokensPerBlock),
      deploymentInfo.startBlock
    ]
  );
  
  console.log("\n" + "=".repeat(80));
  console.log("🔧 CONTRACT 1: MMF TOKEN (MEME FINANCE)");
  console.log("=".repeat(80));
  console.log(`📍 Contract Address: ${deploymentInfo.mmfTokenAddress}`);
  console.log(`📝 Contract Name: CakeToken`);
  console.log(`📄 Source File: contracts/CakeToken.sol`);
  
  console.log("\n🔧 COMPILER SETTINGS:");
  console.log("-".repeat(50));
  console.log("Compiler Version: 0.6.12");
  console.log("Optimization: Enabled");
  console.log("Optimization Runs: 200");
  console.log("EVM Version: istanbul");
  
  console.log("\n📝 CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log("No constructor arguments (pre-mine handled in constructor)");
  
  console.log("\n🔢 ABI-ENCODED CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log("(Empty - no constructor arguments)");
  
  console.log("\n" + "=".repeat(80));
  console.log("🔧 CONTRACT 2: SYRUPBAR (STAKING CONTRACT)");
  console.log("=".repeat(80));
  console.log(`📍 Contract Address: ${deploymentInfo.syrupBarAddress}`);
  console.log(`📝 Contract Name: SyrupBar`);
  console.log(`📄 Source File: contracts/SyrupBar.sol`);
  
  console.log("\n🔧 COMPILER SETTINGS:");
  console.log("-".repeat(50));
  console.log("Compiler Version: 0.6.12");
  console.log("Optimization: Enabled");
  console.log("Optimization Runs: 200");
  console.log("EVM Version: istanbul");
  
  console.log("\n📝 CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(`_cake (address): ${deploymentInfo.mmfTokenAddress}`);
  
  console.log("\n🔢 ABI-ENCODED CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(syrupConstructorArgs);
  
  console.log("\n" + "=".repeat(80));
  console.log("🔧 CONTRACT 3: MASTERCHEF (FARMING CONTRACT)");
  console.log("=".repeat(80));
  console.log(`📍 Contract Address: ${deploymentInfo.masterChefAddress}`);
  console.log(`📝 Contract Name: MasterChef`);
  console.log(`📄 Source File: contracts/MasterChef.sol`);
  
  console.log("\n🔧 COMPILER SETTINGS:");
  console.log("-".repeat(50));
  console.log("Compiler Version: 0.6.12");
  console.log("Optimization: Enabled");
  console.log("Optimization Runs: 200");
  console.log("EVM Version: istanbul");
  
  console.log("\n📝 CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(`_cake (address): ${deploymentInfo.mmfTokenAddress}`);
  console.log(`_syrup (address): ${deploymentInfo.syrupBarAddress}`);
  console.log(`_devaddr (address): ${deploymentInfo.devAddress}`);
  console.log(`_cakePerBlock (uint256): ${ethers.utils.parseEther(deploymentInfo.tokensPerBlock)} (${deploymentInfo.tokensPerBlock} MMF)`);
  console.log(`_startBlock (uint256): ${deploymentInfo.startBlock}`);
  
  console.log("\n🔢 ABI-ENCODED CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(masterChefConstructorArgs);
  
  console.log("\n" + "=".repeat(80));
  console.log("📋 MANUAL VERIFICATION STEPS");
  console.log("=".repeat(80));
  
  console.log("🌐 STEP 1: GO TO MONAD BLOCK EXPLORER");
  console.log("-".repeat(50));
  console.log("URL: https://explorer.monad.xyz");
  console.log(`Network: Monad Mainnet (Chain ID: ${deploymentInfo.chainId})`);
  
  console.log("\n🪙 STEP 2: VERIFY MMF TOKEN CONTRACT");
  console.log("-".repeat(50));
  console.log(`1. Navigate to: https://explorer.monad.xyz/address/${deploymentInfo.mmfTokenAddress}`);
  console.log("2. Click 'Contract' tab");
  console.log("3. Click 'Verify and Publish'");
  console.log("4. Select verification method: 'Solidity (Single file)'");
  console.log("5. Enter contract details:");
  console.log("   - Contract Address: " + deploymentInfo.mmfTokenAddress);
  console.log("   - Contract Name: CakeToken");
  console.log("   - Compiler Version: 0.6.12");
  console.log("   - Optimization: Yes");
  console.log("   - Optimization Runs: 200");
  console.log("   - EVM Version: istanbul");
  console.log("6. Paste MMF Token source code (see flattened file)");
  console.log("7. Constructor Arguments: (leave empty)");
  console.log("8. Submit verification");
  
  console.log("\n🍯 STEP 3: VERIFY SYRUPBAR CONTRACT");
  console.log("-".repeat(50));
  console.log(`1. Navigate to: https://explorer.monad.xyz/address/${deploymentInfo.syrupBarAddress}`);
  console.log("2. Click 'Contract' tab");
  console.log("3. Click 'Verify and Publish'");
  console.log("4. Select verification method: 'Solidity (Single file)'");
  console.log("5. Enter contract details:");
  console.log("   - Contract Address: " + deploymentInfo.syrupBarAddress);
  console.log("   - Contract Name: SyrupBar");
  console.log("   - Compiler Version: 0.6.12");
  console.log("   - Optimization: Yes");
  console.log("   - Optimization Runs: 200");
  console.log("   - EVM Version: istanbul");
  console.log("6. Paste SyrupBar source code (see flattened file)");
  console.log("7. Constructor Arguments (ABI-encoded):");
  console.log("   " + syrupConstructorArgs);
  console.log("8. Submit verification");
  
  console.log("\n👨‍🌾 STEP 4: VERIFY MASTERCHEF CONTRACT");
  console.log("-".repeat(50));
  console.log(`1. Navigate to: https://explorer.monad.xyz/address/${deploymentInfo.masterChefAddress}`);
  console.log("2. Click 'Contract' tab");
  console.log("3. Click 'Verify and Publish'");
  console.log("4. Select verification method: 'Solidity (Single file)'");
  console.log("5. Enter contract details:");
  console.log("   - Contract Address: " + deploymentInfo.masterChefAddress);
  console.log("   - Contract Name: MasterChef");
  console.log("   - Compiler Version: 0.6.12");
  console.log("   - Optimization: Yes");
  console.log("   - Optimization Runs: 200");
  console.log("   - EVM Version: istanbul");
  console.log("6. Paste MasterChef source code (see flattened file)");
  console.log("7. Constructor Arguments (ABI-encoded):");
  console.log("   " + masterChefConstructorArgs);
  console.log("8. Submit verification");
  
  console.log("\n📁 STEP 5: PREPARE SOURCE CODE");
  console.log("-".repeat(50));
  console.log("Run these commands to generate flattened source code:");
  console.log("npm run flatten:mmf");
  console.log("npm run flatten:syrup");
  console.log("npm run flatten:masterchef");
  console.log("");
  console.log("Files will be created in the 'flattened/' directory");
  
  console.log("\n🔍 STEP 6: VERIFICATION CHECKLIST");
  console.log("-".repeat(50));
  console.log("Before submitting verification, ensure:");
  console.log("□ Contract addresses are correct");
  console.log("□ Compiler version is exactly 0.6.12");
  console.log("□ Optimization is enabled with 200 runs");
  console.log("□ EVM version is set to istanbul");
  console.log("□ Source code is flattened and complete");
  console.log("□ Constructor arguments are ABI-encoded correctly");
  console.log("□ Network is Monad Mainnet");
  
  console.log("\n⚠️  TROUBLESHOOTING:");
  console.log("-".repeat(50));
  console.log("If verification fails:");
  console.log("- Double-check compiler version (must be exactly 0.6.12)");
  console.log("- Ensure optimization settings match deployment (200 runs)");
  console.log("- Verify constructor arguments are properly encoded");
  console.log("- Try using multi-file upload if single file fails");
  console.log("- Check that source code includes all dependencies");
  
  console.log("\n🌐 BLOCK EXPLORER URLS:");
  console.log("-".repeat(50));
  console.log("Monad Explorer: https://explorer.monad.xyz");
  console.log(`MMF Token: https://explorer.monad.xyz/address/${deploymentInfo.mmfTokenAddress}`);
  console.log(`SyrupBar: https://explorer.monad.xyz/address/${deploymentInfo.syrupBarAddress}`);
  console.log(`MasterChef: https://explorer.monad.xyz/address/${deploymentInfo.masterChefAddress}`);
  
  console.log("\n💡 SPECIAL NOTES FOR MEME FINANCE:");
  console.log("-".repeat(50));
  console.log("- MMF Token has 1 Billion pre-mine built into constructor");
  console.log("- SyrupBar is connected to MMF Token for staking");
  console.log("- MasterChef controls both MMF Token and SyrupBar");
  console.log("- Rewards: 40 MMF per block starting from block " + deploymentInfo.startBlock);
  
  console.log("\n" + "=".repeat(80));
  console.log("✅ MANUAL VERIFICATION GUIDE COMPLETED");
  console.log("=".repeat(80));
  console.log("Follow the steps above to verify your Meme Finance contracts on Monad Explorer");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Manual verification guide failed:", error);
    process.exit(1);
  });