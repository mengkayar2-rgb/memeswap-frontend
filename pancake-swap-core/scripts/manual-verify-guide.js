const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(70));
  console.log("📋 MANUAL CONTRACT VERIFICATION GUIDE");
  console.log("=".repeat(70));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the factory first using: npm run deploy:factory");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📊 DEPLOYMENT INFORMATION:");
  console.log("-".repeat(50));
  console.log(`Contract Address: ${deploymentInfo.factoryAddress}`);
  console.log(`Transaction Hash: ${deploymentInfo.transactionHash}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Fee To Setter: ${deploymentInfo.feeToSetter}`);
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);
  
  console.log("\n🔧 COMPILER SETTINGS:");
  console.log("-".repeat(50));
  console.log("Compiler Version: 0.5.16");
  console.log("Optimization: Enabled");
  console.log("Optimization Runs: 999999");
  console.log("EVM Version: istanbul");
  
  console.log("\n📝 CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(`feeToSetter (address): ${deploymentInfo.feeToSetter}`);
  
  // Generate ABI-encoded constructor arguments
  const { ethers } = require("hardhat");
  const abiCoder = new ethers.utils.AbiCoder();
  const encodedArgs = abiCoder.encode(["address"], [deploymentInfo.feeToSetter]);
  
  console.log("\n🔢 ABI-ENCODED CONSTRUCTOR ARGUMENTS:");
  console.log("-".repeat(50));
  console.log(encodedArgs);
  
  console.log("\n📋 MANUAL VERIFICATION STEPS:");
  console.log("-".repeat(50));
  console.log("1. Go to Monad Block Explorer");
  console.log(`2. Navigate to: ${deploymentInfo.factoryAddress}`);
  console.log("3. Click 'Contract' tab");
  console.log("4. Click 'Verify and Publish'");
  console.log("5. Select 'Solidity (Single file)'");
  console.log("6. Enter compiler version: 0.5.16");
  console.log("7. Select optimization: Yes");
  console.log("8. Enter optimization runs: 999999");
  console.log("9. Paste the flattened source code (see below)");
  console.log("10. Enter constructor arguments (ABI-encoded above)");
  console.log("11. Complete captcha and submit");
  
  console.log("\n📁 SOURCE CODE OPTIONS:");
  console.log("-".repeat(50));
  console.log("Option 1: Use flattened contract");
  console.log("  Run: npm run flatten:factory");
  console.log("  File: flattened/PancakeFactory-flattened.sol");
  console.log("");
  console.log("Option 2: Use multi-file upload");
  console.log("  Upload all files in contracts/ directory");
  console.log("  Main contract: contracts/PancakeFactory.sol");
  
  console.log("\n🌐 BLOCK EXPLORER URLS:");
  console.log("-".repeat(50));
  console.log("Monad Explorer: https://explorer.monad.xyz");
  console.log(`Contract URL: https://explorer.monad.xyz/address/${deploymentInfo.factoryAddress}`);
  
  console.log("\n⚠️  TROUBLESHOOTING:");
  console.log("-".repeat(50));
  console.log("- If verification fails, check compiler version exactly matches");
  console.log("- Ensure optimization settings are correct");
  console.log("- Verify constructor arguments are properly encoded");
  console.log("- Try using flattened source code if multi-file fails");
  console.log("- Check that the contract was deployed successfully");
  
  console.log("\n✅ VERIFICATION CHECKLIST:");
  console.log("-".repeat(50));
  console.log("□ Contract address copied");
  console.log("□ Compiler version: 0.5.16");
  console.log("□ Optimization enabled: 999999 runs");
  console.log("□ Constructor arguments encoded");
  console.log("□ Source code prepared (flattened or multi-file)");
  console.log("□ Block explorer accessible");
  
  console.log("\n" + "=".repeat(70));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });