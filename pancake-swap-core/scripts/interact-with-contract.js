const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("🤝 PANCAKEFACTORY CONTRACT INTERACTION");
  console.log("=".repeat(60));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-deployment.json`);
  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log(`📍 Factory Address: ${deploymentInfo.factoryAddress}`);
  
  // Connect to contract
  const factory = await ethers.getContractAt("PancakeFactory", deploymentInfo.factoryAddress);
  const [signer] = await ethers.getSigners();
  
  console.log(`👤 Interacting as: ${signer.address}`);
  console.log(`💰 Balance: ${ethers.utils.formatEther(await signer.getBalance())} ETH`);

  // Interactive menu
  console.log("\n📋 AVAILABLE ACTIONS:");
  console.log("1. View contract info");
  console.log("2. Check pair exists");
  console.log("3. Get all pairs");
  console.log("4. View fee settings");
  console.log("5. Get init code hash");
  
  // For demo, let's run all info queries
  console.log("\n" + "=".repeat(60));
  console.log("📊 CONTRACT INFORMATION");
  console.log("=".repeat(60));
  
  try {
    // Basic info
    const feeToSetter = await factory.feeToSetter();
    const feeTo = await factory.feeTo();
    const initCodeHash = await factory.INIT_CODE_PAIR_HASH();
    const allPairsLength = await factory.allPairsLength();
    
    console.log(`Fee To Setter: ${feeToSetter}`);
    console.log(`Fee To: ${feeTo}`);
    console.log(`Init Code Hash: ${initCodeHash}`);
    console.log(`Total Pairs: ${allPairsLength.toString()}`);
    
    // List all pairs if any exist
    if (allPairsLength.gt(0)) {
      console.log("\n📋 ALL PAIRS:");
      for (let i = 0; i < allPairsLength.toNumber(); i++) {
        const pairAddress = await factory.allPairs(i);
        console.log(`  ${i + 1}. ${pairAddress}`);
        
        // Get pair details if we can
        try {
          const pair = await ethers.getContractAt("IPancakePair", pairAddress);
          const token0 = await pair.token0();
          const token1 = await pair.token1();
          console.log(`     Token0: ${token0}`);
          console.log(`     Token1: ${token1}`);
        } catch (error) {
          console.log(`     (Could not fetch pair details)`);
        }
      }
    } else {
      console.log("\n📋 No pairs created yet");
    }
    
  } catch (error) {
    console.error("❌ Error fetching contract info:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ CONTRACT INTERACTION COMPLETED");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Interaction failed:", error);
    process.exit(1);
  });