const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("🔍 PANCAKESWAP FACTORY CONTRACT VERIFICATION");
  console.log("=".repeat(60));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the factory first using: npm run deploy:factory");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log(`📍 Factory Address: ${deploymentInfo.factoryAddress}`);
  console.log(`👤 Fee To Setter: ${deploymentInfo.feeToSetter}`);
  console.log(`🌐 Network: ${deploymentInfo.network}`);
  console.log(`⛓️  Chain ID: ${deploymentInfo.chainId}`);
  console.log("=".repeat(60));

  try {
    console.log("🚀 Starting verification...");
    
    await run("verify:verify", {
      address: deploymentInfo.factoryAddress,
      constructorArguments: [deploymentInfo.feeToSetter],
      contract: "contracts/PancakeFactory.sol:PancakeFactory"
    });

    console.log("✅ Contract verified successfully!");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Contract is already verified!");
    } else {
      console.error("❌ Verification failed:", error.message);
      console.log("\n📋 Manual verification steps:");
      console.log("1. Go to the block explorer");
      console.log("2. Navigate to your contract address");
      console.log("3. Click 'Verify and Publish'");
      console.log("4. Use the flattened source code");
      console.log("5. Set compiler version: 0.5.16");
      console.log("6. Enable optimization: Yes (999999 runs)");
      console.log(`7. Constructor arguments: ${deploymentInfo.feeToSetter}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });