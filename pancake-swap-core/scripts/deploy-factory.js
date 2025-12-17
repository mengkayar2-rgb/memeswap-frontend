const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("=".repeat(60));
  console.log("🥞 PANCAKESWAP V2 FACTORY DEPLOYMENT");
  console.log("=".repeat(60));

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log(`Deployer: ${deployer.address}`);
  console.log(`Balance: ${ethers.utils.formatEther(await deployer.getBalance())} ETH`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log("=".repeat(60));

  // Deploy PancakeFactory
  console.log("📦 Deploying PancakeFactory...");
  
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  
  // Use deployer as the initial feeToSetter
  const factory = await PancakeFactory.deploy(deployer.address);
  await factory.deployed();

  console.log("✅ PancakeFactory deployed successfully!");
  console.log(`📍 Factory Address: ${factory.address}`);
  console.log(`🧾 Transaction Hash: ${factory.deployTransaction.hash}`);

  // Extract INIT_CODE_HASH
  console.log("\n🔍 Extracting INIT_CODE_HASH...");
  
  const initCodeHash = await factory.INIT_CODE_PAIR_HASH();
  
  console.log("=".repeat(60));
  console.log("🎯 CRITICAL INFORMATION FOR NEXT PHASES:");
  console.log("=".repeat(60));
  console.log(`🏭 FACTORY_ADDRESS: ${factory.address}`);
  console.log(`🔑 INIT_CODE_HASH: ${initCodeHash}`);
  console.log("=".repeat(60));
  console.log("⚠️  SAVE THESE VALUES! You'll need them for:");
  console.log("   1. PancakeRouter deployment (Phase 2)");
  console.log("   2. SDK configuration (Phase 4)");
  console.log("   3. Frontend configuration (Phase 6)");
  console.log("=".repeat(60));

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    chainId: hre.network.config.chainId,
    factoryAddress: factory.address,
    initCodeHash: initCodeHash,
    deployer: deployer.address,
    feeToSetter: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: factory.deployTransaction.hash,
    gasUsed: factory.deployTransaction.gasLimit?.toString(),
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, "..", "deployments-info");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }
  
  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}-deployment.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log(`💾 Deployment info saved to: ${deploymentFile}`);

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const feeToSetterFromContract = await factory.feeToSetter();
  console.log(`✅ Fee To Setter: ${feeToSetterFromContract}`);
  console.log(`✅ All Pairs Length: ${await factory.allPairsLength()}`);
  
  console.log("\n🎉 PHASE 1 COMPLETED SUCCESSFULLY!");
  console.log("📋 Next Steps:");
  console.log("   1. Copy the FACTORY_ADDRESS and INIT_CODE_HASH above");
  console.log("   2. Proceed to Phase 2: Deploy PancakeRouter");
  console.log("   3. Update PancakeLibrary.sol with the INIT_CODE_HASH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });