const { run } = require("hardhat");
const fs = require("fs");
const path = require("path");
const { ethers } = require("hardhat");

async function main() {
  console.log("=".repeat(70));
  console.log("🔍 AUTOMATED FARM CONTRACT VERIFICATION");
  console.log("=".repeat(70));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-farm-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    console.log("Please deploy the farm contracts first");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📊 CONTRACTS TO VERIFY:");
  console.log("-".repeat(50));
  console.log(`MMF Token: ${deploymentInfo.mmfTokenAddress}`);
  console.log(`SyrupBar: ${deploymentInfo.syrupBarAddress}`);
  console.log(`MasterChef: ${deploymentInfo.masterChefAddress}`);
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);

  // Verify MMF Token Contract
  console.log("\n" + "=".repeat(70));
  console.log("🔍 VERIFYING MMF TOKEN CONTRACT");
  console.log("=".repeat(70));
  
  try {
    console.log(`📍 Address: ${deploymentInfo.mmfTokenAddress}`);
    console.log("🚀 Starting MMF Token verification...");
    
    await run("verify:verify", {
      address: deploymentInfo.mmfTokenAddress,
      constructorArguments: [], // MMF Token has no constructor arguments
      contract: "contracts/CakeToken.sol:CakeToken"
    });

    console.log("✅ MMF Token contract verified successfully!");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ MMF Token contract is already verified!");
    } else {
      console.error("❌ MMF Token verification failed:", error.message);
      console.log("💡 Try manual verification for MMF Token");
    }
  }

  // Verify SyrupBar Contract
  console.log("\n" + "=".repeat(70));
  console.log("🔍 VERIFYING SYRUPBAR CONTRACT");
  console.log("=".repeat(70));
  
  try {
    console.log(`📍 Address: ${deploymentInfo.syrupBarAddress}`);
    console.log(`🪙 MMF Token: ${deploymentInfo.mmfTokenAddress}`);
    console.log("🚀 Starting SyrupBar verification...");
    
    await run("verify:verify", {
      address: deploymentInfo.syrupBarAddress,
      constructorArguments: [
        deploymentInfo.mmfTokenAddress
      ],
      contract: "contracts/SyrupBar.sol:SyrupBar"
    });

    console.log("✅ SyrupBar contract verified successfully!");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ SyrupBar contract is already verified!");
    } else {
      console.error("❌ SyrupBar verification failed:", error.message);
      console.log("💡 Try manual verification for SyrupBar");
    }
  }

  // Verify MasterChef Contract
  console.log("\n" + "=".repeat(70));
  console.log("🔍 VERIFYING MASTERCHEF CONTRACT");
  console.log("=".repeat(70));
  
  try {
    console.log(`📍 Address: ${deploymentInfo.masterChefAddress}`);
    console.log(`🪙 MMF Token: ${deploymentInfo.mmfTokenAddress}`);
    console.log(`🍯 SyrupBar: ${deploymentInfo.syrupBarAddress}`);
    console.log(`👨‍💻 Dev Address: ${deploymentInfo.devAddress}`);
    console.log(`⚡ Tokens per Block: ${deploymentInfo.tokensPerBlock} MMF`);
    console.log(`🏁 Start Block: ${deploymentInfo.startBlock}`);
    console.log("🚀 Starting MasterChef verification...");
    
    await run("verify:verify", {
      address: deploymentInfo.masterChefAddress,
      constructorArguments: [
        deploymentInfo.mmfTokenAddress,
        deploymentInfo.syrupBarAddress,
        deploymentInfo.devAddress,
        ethers.utils.parseEther(deploymentInfo.tokensPerBlock),
        deploymentInfo.startBlock
      ],
      contract: "contracts/MasterChef.sol:MasterChef"
    });

    console.log("✅ MasterChef contract verified successfully!");
    
  } catch (error) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log("✅ MasterChef contract is already verified!");
    } else {
      console.error("❌ MasterChef verification failed:", error.message);
      console.log("💡 Try manual verification for MasterChef");
    }
  }

  // Verification Summary
  console.log("\n" + "=".repeat(70));
  console.log("📋 VERIFICATION SUMMARY");
  console.log("=".repeat(70));
  
  console.log("Meme Finance contracts deployed on Monad Mainnet:");
  console.log(`🪙 MMF Token: ${deploymentInfo.mmfTokenAddress}`);
  console.log(`🍯 SyrupBar: ${deploymentInfo.syrupBarAddress}`);
  console.log(`👨‍🌾 MasterChef: ${deploymentInfo.masterChefAddress}`);
  
  console.log("\n🌐 Block Explorer Links:");
  console.log(`MMF Token: https://explorer.monad.xyz/address/${deploymentInfo.mmfTokenAddress}`);
  console.log(`SyrupBar: https://explorer.monad.xyz/address/${deploymentInfo.syrupBarAddress}`);
  console.log(`MasterChef: https://explorer.monad.xyz/address/${deploymentInfo.masterChefAddress}`);
  
  console.log("\n💡 MEME FINANCE FEATURES:");
  console.log("- 1 Billion MMF tokens pre-mined to deployer");
  console.log("- 40 MMF tokens per block farming rewards");
  console.log("- Complete governance capabilities");
  console.log("- Perfect ownership structure for farming");
  
  console.log("\n📋 Next Steps:");
  console.log("1. Check contracts on Monad Explorer");
  console.log("2. Verify source code is visible and readable");
  console.log("3. Test contract interactions through explorer");
  console.log("4. Add liquidity pools to MasterChef for farming");
  console.log("5. Proceed to Phase 4: SDK configuration");
  
  console.log("\n✅ VERIFICATION PROCESS COMPLETED!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Verification process failed:", error);
    process.exit(1);
  });