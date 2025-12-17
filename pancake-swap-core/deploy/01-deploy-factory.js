const { ethers } = require("hardhat");

module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy, log } = deployments;
  const { deployer, feeToSetter } = await getNamedAccounts();

  console.log("=".repeat(60));
  console.log("🥞 PANCAKESWAP V2 CORE DEPLOYMENT - PHASE 1");
  console.log("=".repeat(60));
  console.log(`Deployer: ${deployer}`);
  console.log(`Fee To Setter: ${feeToSetter}`);
  console.log(`Network: ${hre.network.name}`);
  console.log(`Chain ID: ${hre.network.config.chainId}`);
  console.log("=".repeat(60));

  // Deploy PancakeFactory
  console.log("📦 Deploying PancakeFactory...");
  
  const factoryDeployment = await deploy("PancakeFactory", {
    from: deployer,
    args: [feeToSetter],
    log: true,
    waitConfirmations: 1,
  });

  console.log("✅ PancakeFactory deployed successfully!");
  console.log(`📍 Factory Address: ${factoryDeployment.address}`);

  // Get the deployed contract instance
  const factory = await ethers.getContractAt("PancakeFactory", factoryDeployment.address);
  
  // Extract INIT_CODE_HASH
  console.log("\n🔍 Extracting INIT_CODE_HASH...");
  
  try {
    const initCodeHash = await factory.INIT_CODE_PAIR_HASH();
    
    console.log("=".repeat(60));
    console.log("🎯 CRITICAL INFORMATION FOR PHASE 2:");
    console.log("=".repeat(60));
    console.log(`🏭 FACTORY_ADDRESS: ${factoryDeployment.address}`);
    console.log(`🔑 INIT_CODE_HASH: ${initCodeHash}`);
    console.log("=".repeat(60));
    console.log("⚠️  SAVE THESE VALUES! You'll need them for:");
    console.log("   1. PancakeRouter deployment (Phase 2)");
    console.log("   2. SDK configuration (Phase 4)");
    console.log("   3. Frontend configuration (Phase 6)");
    console.log("=".repeat(60));

    // Save deployment info to a file for easy reference
    const deploymentInfo = {
      network: hre.network.name,
      chainId: hre.network.config.chainId,
      factoryAddress: factoryDeployment.address,
      initCodeHash: initCodeHash,
      deployer: deployer,
      feeToSetter: feeToSetter,
      deploymentTime: new Date().toISOString(),
      transactionHash: factoryDeployment.transactionHash,
    };

    const fs = require("fs");
    const path = require("path");
    
    // Create deployments directory if it doesn't exist
    const deploymentsDir = path.join(__dirname, "..", "deployments-info");
    if (!fs.existsSync(deploymentsDir)) {
      fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    // Save deployment info
    const deploymentFile = path.join(deploymentsDir, `${hre.network.name}-deployment.json`);
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
    
    console.log(`💾 Deployment info saved to: ${deploymentFile}`);
    
  } catch (error) {
    console.error("❌ Error extracting INIT_CODE_HASH:", error);
    throw error;
  }

  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const feeToSetterFromContract = await factory.feeToSetter();
  console.log(`✅ Fee To Setter verified: ${feeToSetterFromContract}`);
  
  console.log("\n🎉 PHASE 1 COMPLETED SUCCESSFULLY!");
  console.log("Next: Deploy PancakeRouter with the INIT_CODE_HASH above");
};

module.exports.tags = ["PancakeFactory", "core"];
module.exports.dependencies = [];