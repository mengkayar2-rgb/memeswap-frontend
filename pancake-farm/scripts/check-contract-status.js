const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function checkContractStatus(address, name) {
  console.log(`\n🔍 Checking ${name} at ${address}...`);
  
  try {
    // Check if contract exists
    const code = await ethers.provider.getCode(address);
    if (code === "0x") {
      console.log(`❌ ${name}: No contract found at address`);
      return false;
    }
    
    console.log(`✅ ${name}: Contract exists (${code.length} bytes)`);
    
    // Get transaction count (nonce) to verify it's a contract
    const txCount = await ethers.provider.getTransactionCount(address);
    console.log(`📊 ${name}: Transaction count: ${txCount}`);
    
    // Try to get contract balance
    try {
      const balance = await ethers.provider.getBalance(address);
      console.log(`💰 ${name}: Balance: ${ethers.utils.formatEther(balance)} ETH`);
    } catch (error) {
      console.log(`⚠️  ${name}: Could not fetch balance`);
    }
    
    return true;
    
  } catch (error) {
    console.log(`❌ ${name}: Error checking contract - ${error.message}`);
    return false;
  }
}

async function testFarmContracts(deploymentInfo) {
  console.log("\n" + "=".repeat(70));
  console.log("🧪 TESTING FARM CONTRACT FUNCTIONS");
  console.log("=".repeat(70));
  
  try {
    // Test MMF Token contract
    console.log("\n🪙 Testing MMF Token contract...");
    const mmfToken = await ethers.getContractAt("CakeToken", deploymentInfo.mmfTokenAddress);
    
    const name = await mmfToken.name();
    const symbol = await mmfToken.symbol();
    const decimals = await mmfToken.decimals();
    const totalSupply = await mmfToken.totalSupply();
    const owner = await mmfToken.owner();
    
    console.log(`✅ MMF Name: ${name}`);
    console.log(`✅ MMF Symbol: ${symbol}`);
    console.log(`✅ MMF Decimals: ${decimals}`);
    console.log(`✅ MMF Total Supply: ${ethers.utils.formatEther(totalSupply)} MMF`);
    console.log(`✅ MMF Owner: ${owner}`);
    
    // Test SyrupBar contract
    console.log("\n🍯 Testing SyrupBar contract...");
    const syrupBar = await ethers.getContractAt("SyrupBar", deploymentInfo.syrupBarAddress);
    
    const syrupName = await syrupBar.name();
    const syrupSymbol = await syrupBar.symbol();
    const syrupOwner = await syrupBar.owner();
    const cakeToken = await syrupBar.cake();
    
    console.log(`✅ SyrupBar Name: ${syrupName}`);
    console.log(`✅ SyrupBar Symbol: ${syrupSymbol}`);
    console.log(`✅ SyrupBar Owner: ${syrupOwner}`);
    console.log(`✅ SyrupBar CAKE Token: ${cakeToken}`);
    
    // Test MasterChef contract
    console.log("\n👨‍🌾 Testing MasterChef contract...");
    const masterChef = await ethers.getContractAt("MasterChef", deploymentInfo.masterChefAddress);
    
    const masterCake = await masterChef.cake();
    const masterSyrup = await masterChef.syrup();
    const devAddr = await masterChef.devaddr();
    const cakePerBlock = await masterChef.cakePerBlock();
    const startBlock = await masterChef.startBlock();
    const poolLength = await masterChef.poolLength();
    const masterOwner = await masterChef.owner();
    
    console.log(`✅ MasterChef CAKE: ${masterCake}`);
    console.log(`✅ MasterChef Syrup: ${masterSyrup}`);
    console.log(`✅ MasterChef Dev: ${devAddr}`);
    console.log(`✅ MasterChef Rewards: ${ethers.utils.formatEther(cakePerBlock)} MMF/block`);
    console.log(`✅ MasterChef Start Block: ${startBlock.toString()}`);
    console.log(`✅ MasterChef Pool Length: ${poolLength.toString()}`);
    console.log(`✅ MasterChef Owner: ${masterOwner}`);
    
    // Verify connections
    console.log("\n🔗 VERIFYING CONTRACT CONNECTIONS:");
    
    if (owner.toLowerCase() === deploymentInfo.masterChefAddress.toLowerCase()) {
      console.log("✅ MMF Token -> MasterChef ownership: VERIFIED");
    } else {
      console.log("❌ MMF Token -> MasterChef ownership: FAILED");
    }
    
    if (syrupOwner.toLowerCase() === deploymentInfo.masterChefAddress.toLowerCase()) {
      console.log("✅ SyrupBar -> MasterChef ownership: VERIFIED");
    } else {
      console.log("❌ SyrupBar -> MasterChef ownership: FAILED");
    }
    
    if (cakeToken.toLowerCase() === deploymentInfo.mmfTokenAddress.toLowerCase()) {
      console.log("✅ SyrupBar -> MMF Token connection: VERIFIED");
    } else {
      console.log("❌ SyrupBar -> MMF Token connection: FAILED");
    }
    
    if (masterCake.toLowerCase() === deploymentInfo.mmfTokenAddress.toLowerCase()) {
      console.log("✅ MasterChef -> MMF Token connection: VERIFIED");
    } else {
      console.log("❌ MasterChef -> MMF Token connection: FAILED");
    }
    
    if (masterSyrup.toLowerCase() === deploymentInfo.syrupBarAddress.toLowerCase()) {
      console.log("✅ MasterChef -> SyrupBar connection: VERIFIED");
    } else {
      console.log("❌ MasterChef -> SyrupBar connection: FAILED");
    }
    
    // Check pre-mine
    console.log("\n💰 VERIFYING PRE-MINE:");
    const deployerBalance = await mmfToken.balanceOf(deploymentInfo.deployer);
    console.log(`Deployer MMF Balance: ${ethers.utils.formatEther(deployerBalance)} MMF`);
    
    if (deployerBalance.toString() === ethers.utils.parseEther("1000000000").toString()) {
      console.log("✅ Pre-mine verification: SUCCESS - 1 Billion MMF confirmed!");
    } else {
      console.log("❌ Pre-mine verification: FAILED");
    }
    
    return true;
    
  } catch (error) {
    console.error("❌ Function testing failed:", error.message);
    return false;
  }
}

async function main() {
  console.log("=".repeat(70));
  console.log("📊 MEME FINANCE CONTRACT STATUS CHECKER");
  console.log("=".repeat(70));

  // Load deployment info
  const deploymentFile = path.join(__dirname, "..", "deployments-info", `${hre.network.name}-farm-deployment.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: ${deploymentFile}`);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  
  console.log("📋 DEPLOYMENT SUMMARY:");
  console.log("-".repeat(50));
  console.log(`Network: ${deploymentInfo.network}`);
  console.log(`Chain ID: ${deploymentInfo.chainId}`);
  console.log(`Deployment Time: ${deploymentInfo.deploymentTime}`);
  console.log(`Deployer: ${deploymentInfo.deployer}`);
  console.log(`Pre-Mine: ${deploymentInfo.preMineAmount} MMF`);
  console.log(`Rewards: ${deploymentInfo.tokensPerBlock} MMF per block`);
  
  // Check network connection
  console.log("\n🌐 NETWORK STATUS:");
  console.log("-".repeat(50));
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    const gasPrice = await ethers.provider.getGasPrice();
    console.log(`✅ Current Block: ${blockNumber}`);
    console.log(`✅ Gas Price: ${ethers.utils.formatUnits(gasPrice, "gwei")} gwei`);
  } catch (error) {
    console.log("❌ Network connection failed:", error.message);
    process.exit(1);
  }
  
  // Check all contracts
  console.log("\n" + "=".repeat(70));
  console.log("🔍 CONTRACT EXISTENCE CHECK");
  console.log("=".repeat(70));
  
  const mmfExists = await checkContractStatus(deploymentInfo.mmfTokenAddress, "MMF Token");
  const syrupExists = await checkContractStatus(deploymentInfo.syrupBarAddress, "SyrupBar");
  const masterChefExists = await checkContractStatus(deploymentInfo.masterChefAddress, "MasterChef");
  
  // Test contract functions if all exist
  if (mmfExists && syrupExists && masterChefExists) {
    const functionsWork = await testFarmContracts(deploymentInfo);
    
    console.log("\n" + "=".repeat(70));
    console.log("📊 FINAL STATUS REPORT");
    console.log("=".repeat(70));
    
    console.log("Contract Deployment Status:");
    console.log(`🪙 MMF Token: ${mmfExists ? '✅ DEPLOYED' : '❌ MISSING'}`);
    console.log(`🍯 SyrupBar: ${syrupExists ? '✅ DEPLOYED' : '❌ MISSING'}`);
    console.log(`👨‍🌾 MasterChef: ${masterChefExists ? '✅ DEPLOYED' : '❌ MISSING'}`);
    console.log(`🧪 Functions: ${functionsWork ? '✅ WORKING' : '❌ FAILED'}`);
    
    if (mmfExists && syrupExists && masterChefExists && functionsWork) {
      console.log("\n🎉 ALL SYSTEMS OPERATIONAL!");
      console.log("✅ Ready for contract verification");
      console.log("✅ Ready for Phase 4 deployment");
      console.log("✅ 1 Billion MMF tokens available for liquidity");
    } else {
      console.log("\n⚠️  ISSUES DETECTED!");
      console.log("❌ Some contracts or functions are not working");
      console.log("💡 Check deployment and network connection");
    }
    
  } else {
    console.log("\n❌ CRITICAL: Some contracts are missing!");
    console.log("💡 Redeploy missing contracts before proceeding");
  }
  
  console.log("\n🌐 VERIFICATION LINKS:");
  console.log("-".repeat(50));
  console.log(`MMF Token: https://explorer.monad.xyz/address/${deploymentInfo.mmfTokenAddress}`);
  console.log(`SyrupBar: https://explorer.monad.xyz/address/${deploymentInfo.syrupBarAddress}`);
  console.log(`MasterChef: https://explorer.monad.xyz/address/${deploymentInfo.masterChefAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Status check failed:", error);
    process.exit(1);
  });