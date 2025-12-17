const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying Multicall3 Contract to Monad Mainnet...\n");

  // Step 1: Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📋 Deployment Details:");
  console.log(`   Deployer Address: ${deployer.address}`);
  
  // Check deployer balance
  const balance = await deployer.getBalance();
  console.log(`   Deployer Balance: ${ethers.utils.formatEther(balance)} MON`);
  
  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.log("⚠️  Warning: Low balance. Make sure you have enough MON for deployment.");
  }
  
  console.log(`   Network: ${network.name} (Chain ID: ${network.config.chainId})\n`);

  // Step 2: Deploy the Multicall3 contract
  console.log("📦 Deploying Multicall3...");
  
  // Get contract factory from the multicall directory
  const Multicall3 = await ethers.getContractFactory("contracts/multicall/Multicall3.sol:Multicall3");
  
  console.log("   Estimating gas...");
  const deploymentData = Multicall3.getDeployTransaction();
  const estimatedGas = await deployer.estimateGas(deploymentData);
  console.log(`   Estimated Gas: ${estimatedGas.toString()}`);

  const multicall3 = await Multicall3.deploy();
  
  console.log("   Transaction sent, waiting for confirmation...");
  console.log(`   Transaction Hash: ${multicall3.deployTransaction.hash}`);

  // Step 3: Wait for deployment to finish
  await multicall3.deployed();
  
  console.log("✅ Deployment successful!\n");

  // Step 4: Log the final Multicall3 Address clearly
  console.log("🎉 MULTICALL3 DEPLOYMENT COMPLETE!");
  console.log("=" .repeat(50));
  console.log(`📍 MULTICALL3 ADDRESS: ${multicall3.address}`);
  console.log("=" .repeat(50));
  
  // Additional deployment info
  console.log("\n📊 Deployment Summary:");
  console.log(`   Contract: Multicall3`);
  console.log(`   Address: ${multicall3.address}`);
  console.log(`   Deployer: ${deployer.address}`);
  console.log(`   Network: Monad Mainnet (Chain ID: 143)`);
  console.log(`   Transaction: ${multicall3.deployTransaction.hash}`);
  console.log(`   Block Number: ${multicall3.deployTransaction.blockNumber || 'Pending'}`);
  
  // Test basic functionality
  console.log("\n🧪 Testing Basic Functionality...");
  try {
    const blockNumber = await multicall3.getBlockNumber();
    const chainId = await multicall3.getChainId();
    const ethBalance = await multicall3.getEthBalance(deployer.address);
    
    console.log(`   ✅ getBlockNumber(): ${blockNumber.toString()}`);
    console.log(`   ✅ getChainId(): ${chainId.toString()}`);
    console.log(`   ✅ getEthBalance(): ${ethers.utils.formatEther(ethBalance)} MON`);
    console.log("   ✅ All basic functions working correctly!");
  } catch (error) {
    console.log(`   ❌ Error testing functions: ${error.message}`);
  }

  // Save deployment info
  const deploymentInfo = {
    multicall3: {
      address: multicall3.address,
      deployer: deployer.address,
      transactionHash: multicall3.deployTransaction.hash,
      blockNumber: multicall3.deployTransaction.blockNumber,
      network: "monad",
      chainId: 143,
      deployedAt: new Date().toISOString()
    }
  };

  // Create deployments-info directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments-info');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  // Save deployment info
  const deploymentFile = path.join(deploymentsDir, 'monad-multicall-deployment.json');
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  console.log(`\n💾 Deployment info saved to: ${deploymentFile}`);

  console.log("\n🔗 Next Steps:");
  console.log("1. Add this Multicall3 address to your frontend configuration");
  console.log("2. Update your DEX interface to use this address for batch calls");
  console.log("3. Test multicall functionality with your frontend");
  
  console.log("\n🎯 READY FOR FRONTEND INTEGRATION!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });