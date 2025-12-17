const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("🏥 PANCAKEFACTORY HEALTH CHECK");
  console.log("=".repeat(60));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error("❌ No deployment found. Please deploy first.");
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("🔍 CHECKING CONTRACT HEALTH...");
  console.log(`📍 Address: ${deploymentInfo.factoryAddress}`);
  console.log(`🌐 Network: ${deploymentInfo.network}`);
  console.log(`⛓️  Chain ID: ${deploymentInfo.chainId}`);

  const [signer] = await ethers.getSigners();
  let healthScore = 0;
  const maxScore = 10;

  try {
    // Test 1: Contract exists and has code
    console.log("\n1️⃣ Checking contract existence...");
    const code = await ethers.provider.getCode(deploymentInfo.factoryAddress);
    if (code !== "0x") {
      console.log("   ✅ Contract has bytecode");
      healthScore += 2;
    } else {
      console.log("   ❌ No bytecode found");
      return;
    }

    // Test 2: Contract responds to calls
    console.log("\n2️⃣ Testing contract responsiveness...");
    const factory = await ethers.getContractAt("PancakeFactory", deploymentInfo.factoryAddress);
    
    try {
      const feeToSetter = await factory.feeToSetter();
      console.log(`   ✅ Contract responds: feeToSetter = ${feeToSetter}`);
      healthScore += 2;
    } catch (error) {
      console.log("   ❌ Contract not responding");
    }

    // Test 3: Init code hash consistency
    console.log("\n3️⃣ Verifying init code hash...");
    try {
      const currentHash = await factory.INIT_CODE_PAIR_HASH();
      if (currentHash === deploymentInfo.initCodeHash) {
        console.log("   ✅ Init code hash matches deployment");
        healthScore += 2;
      } else {
        console.log("   ⚠️  Init code hash mismatch");
        healthScore += 1;
      }
    } catch (error) {
      console.log("   ❌ Cannot read init code hash");
    }

    // Test 4: Access control
    console.log("\n4️⃣ Checking access control...");
    try {
      const feeToSetter = await factory.feeToSetter();
      const feeTo = await factory.feeTo();
      
      if (feeToSetter !== ethers.constants.AddressZero) {
        console.log("   ✅ Fee to setter is configured");
        healthScore += 1;
      }
      
      console.log(`   📋 Fee to setter: ${feeToSetter}`);
      console.log(`   📋 Fee to: ${feeTo}`);
      healthScore += 1;
      
    } catch (error) {
      console.log("   ❌ Access control check failed");
    }

    // Test 5: Pair creation capability
    console.log("\n5️⃣ Testing pair creation readiness...");
    try {
      const allPairsLength = await factory.allPairsLength();
      console.log(`   📊 Current pairs count: ${allPairsLength.toString()}`);
      
      // Test if we can call getPair (should not revert)
      const testPair = await factory.getPair(ethers.constants.AddressZero, signer.address);
      console.log("   ✅ Pair lookup function working");
      healthScore += 2;
      
    } catch (error) {
      console.log("   ❌ Pair functions not working");
    }

    // Health Score Summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 HEALTH SCORE SUMMARY");
    console.log("=".repeat(60));
    
    const percentage = Math.round((healthScore / maxScore) * 100);
    
    console.log(`Score: ${healthScore}/${maxScore} (${percentage}%)`);
    
    if (percentage >= 90) {
      console.log("🟢 EXCELLENT - Contract is fully operational");
    } else if (percentage >= 70) {
      console.log("🟡 GOOD - Contract is mostly operational");
    } else if (percentage >= 50) {
      console.log("🟠 WARNING - Contract has some issues");
    } else {
      console.log("🔴 CRITICAL - Contract has major issues");
    }

    // Recommendations
    console.log("\n📋 RECOMMENDATIONS:");
    if (healthScore < maxScore) {
      console.log("- Review failed tests above");
      console.log("- Ensure network connection is stable");
      console.log("- Verify contract deployment was successful");
    } else {
      console.log("- Contract is ready for Phase 2 (Router deployment)");
      console.log("- All systems operational");
    }

    // Network info
    console.log("\n🌐 NETWORK STATUS:");
    const blockNumber = await ethers.provider.getBlockNumber();
    const gasPrice = await ethers.provider.getGasPrice();
    console.log(`   Block Number: ${blockNumber}`);
    console.log(`   Gas Price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
    console.log(`   Signer Balance: ${ethers.utils.formatEther(await signer.getBalance())} ETH`);

  } catch (error) {
    console.error("❌ Health check failed:", error.message);
    console.log("\n🔴 CRITICAL - Unable to complete health check");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Health check error:", error);
    process.exit(1);
  });