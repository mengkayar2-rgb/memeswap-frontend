const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(70));
  console.log("🔍 AUTOMATED CONTRACT VERIFICATION");
  console.log("=".repeat(70));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-router-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the contracts first");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📊 CONTRACTS TO VERIFY:");
  console.log("-".repeat(50));
  console.log(`WETH: ${deploymentInfo.wethAddress}`);
  console.log(`Router: ${deploymentInfo.routerAddress}`);
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);

  // Verify WETH Contract
  console.log("\n" + "=".repeat(70));
  console.log("🔍 VERIFYING WETH CONTRACT");
  console.log("=".repeat(70));
  
  try {
    console.log(`📍 Address: ${deploymentInfo.wethAddress}`);
    console.log("🚀 Starting WETH verification...");
    
    await run("verify:verify", {
      address: deploymentInfo.wethAddress,
      constructorArguments: [], // WETH has no constructor arguments
      contract: "contracts/WETH.sol:WETH"
    });

    console.log("✅ WETH contract verified successfully!");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ WETH contract is already verified!");
    } else {
      console.error("❌ WETH verification failed:", error.message);
      console.log("💡 Try manual verification for WETH");
    }
  }

  // Verify Router Contract
  console.log("\n" + "=".repeat(70));
  console.log("🔍 VERIFYING ROUTER CONTRACT");
  console.log("=".repeat(70));
  
  try {
    console.log(`📍 Address: ${deploymentInfo.routerAddress}`);
    console.log(`🏭 Factory: ${deploymentInfo.factoryAddress}`);
    console.log(`💎 WETH: ${deploymentInfo.wethAddress}`);
    console.log("🚀 Starting Router verification...");
    
    await run("verify:verify", {
      address: deploymentInfo.routerAddress,
      constructorArguments: [
        deploymentInfo.factoryAddress,
        deploymentInfo.wethAddress
      ],
      contract: "contracts/PancakeRouter.sol:PancakeRouter"
    });

    console.log("✅ Router contract verified successfully!");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ Router contract is already verified!");
    } else {
      console.error("❌ Router verification failed:", error.message);
      console.log("💡 Try manual verification for Router");
    }
  }

  // Verification Summary
  console.log("\n" + "=".repeat(70));
  console.log("📋 VERIFICATION SUMMARY");
  console.log("=".repeat(70));
  
  console.log("Contracts deployed on Monad Mainnet:");
  console.log(`🏭 Factory: ${deploymentInfo.factoryAddress}`);
  console.log(`🔄 Router: ${deploymentInfo.routerAddress}`);
  console.log(`💎 WETH: ${deploymentInfo.wethAddress}`);
  
  console.log("\n🌐 Block Explorer Links:");
  console.log(`Factory: https://explorer.monad.xyz/address/${deploymentInfo.factoryAddress}`);
  console.log(`Router: https://explorer.monad.xyz/address/${deploymentInfo.routerAddress}`);
  console.log(`WETH: https://explorer.monad.xyz/address/${deploymentInfo.wethAddress}`);
  
  console.log("\n📋 Next Steps:");
  console.log("1. Check contracts on Monad Explorer");
  console.log("2. Verify source code is visible and readable");
  console.log("3. Test contract interactions through explorer");
  console.log("4. Proceed to Phase 3: Farming contracts");
  
  console.log("\n✅ VERIFICATION PROCESS COMPLETED!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification process failed:", error);
    process.exit(1);
  });