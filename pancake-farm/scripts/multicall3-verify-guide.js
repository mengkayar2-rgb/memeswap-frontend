const fs = require('fs');
const path = require('path');

// Load deployment info
const deploymentInfo = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'deployments-info', 'monad-multicall-deployment.json'), 'utf8')
);

console.log("🔍 MULTICALL3 MANUAL VERIFICATION GUIDE");
console.log("=" .repeat(60));
console.log();

console.log("📋 CONTRACT INFORMATION:");
console.log(`   Contract Name: Multicall3`);
console.log(`   Contract Address: ${deploymentInfo.multicall3.address}`);
console.log(`   Network: Monad Mainnet (Chain ID: 143)`);
console.log(`   Transaction Hash: ${deploymentInfo.multicall3.transactionHash}`);
console.log(`   Block Number: ${deploymentInfo.multicall3.blockNumber}`);
console.log();

console.log("🌐 MONAD BLOCK EXPLORER:");
console.log(`   Explorer URL: https://explorer.monad.xyz`);
console.log(`   Contract URL: https://explorer.monad.xyz/address/${deploymentInfo.multicall3.address}`);
console.log();

console.log("⚙️  COMPILER SETTINGS:");
console.log(`   Solidity Version: 0.8.12`);
console.log(`   EVM Version: london`);
console.log(`   Optimization: Enabled`);
console.log(`   Optimization Runs: 200`);
console.log(`   License: MIT`);
console.log();

console.log("📄 SOURCE CODE:");
console.log(`   Flattened File: flattened/Multicall3_flattened.sol`);
console.log(`   Contract Name in Source: Multicall3`);
console.log();

console.log("🔧 CONSTRUCTOR PARAMETERS:");
console.log(`   Constructor Arguments: None (Multicall3 has no constructor parameters)`);
console.log(`   ABI-Encoded Constructor: 0x (empty)`);
console.log();

console.log("📝 STEP-BY-STEP VERIFICATION PROCESS:");
console.log();
console.log("1. 🌐 Open Monad Block Explorer:");
console.log(`   Go to: https://explorer.monad.xyz/address/${deploymentInfo.multicall3.address}`);
console.log();
console.log("2. 📋 Navigate to Contract Tab:");
console.log("   - Click on the 'Contract' tab");
console.log("   - Click 'Verify and Publish' button");
console.log();
console.log("3. ⚙️  Configure Compiler Settings:");
console.log("   - Compiler Type: Solidity (Single file)");
console.log("   - Compiler Version: v0.8.12+commit.f00d7308");
console.log("   - Open Source License Type: MIT License (MIT)");
console.log();
console.log("4. 🔧 Optimization Settings:");
console.log("   - Optimization: Yes");
console.log("   - Runs: 200");
console.log("   - EVM Version: london");
console.log();
console.log("5. 📄 Source Code:");
console.log("   - Copy the entire content from: flattened/Multicall3_flattened.sol");
console.log("   - Paste it in the 'Enter the Solidity Contract Code' field");
console.log();
console.log("6. 🏗️  Constructor Arguments:");
console.log("   - Leave 'Constructor Arguments ABI-encoded' field EMPTY");
console.log("   - Multicall3 has no constructor parameters");
console.log();
console.log("7. ✅ Submit Verification:");
console.log("   - Click 'Verify and Publish'");
console.log("   - Wait for verification to complete");
console.log();

console.log("🧪 VERIFICATION TEST:");
console.log("After successful verification, test these functions:");
console.log(`   - getChainId() should return: 143`);
console.log(`   - getBlockNumber() should return current block number`);
console.log(`   - getEthBalance(${deploymentInfo.multicall3.deployer}) should return deployer balance`);
console.log();

console.log("📁 FILES NEEDED FOR VERIFICATION:");
console.log("   ✅ flattened/Multicall3_flattened.sol (source code)");
console.log("   ✅ This verification guide");
console.log();

console.log("🎯 VERIFICATION CHECKLIST:");
console.log("   □ Contract address copied correctly");
console.log("   □ Compiler version set to 0.8.12");
console.log("   □ Optimization enabled with 200 runs");
console.log("   □ EVM version set to london");
console.log("   □ MIT license selected");
console.log("   □ Flattened source code pasted");
console.log("   □ Constructor arguments left empty");
console.log("   □ Verification submitted");
console.log();

console.log("🔗 USEFUL LINKS:");
console.log(`   Contract: https://explorer.monad.xyz/address/${deploymentInfo.multicall3.address}`);
console.log(`   Transaction: https://explorer.monad.xyz/tx/${deploymentInfo.multicall3.transactionHash}`);
console.log("   Monad Docs: https://docs.monad.xyz");
console.log();

console.log("💡 TROUBLESHOOTING:");
console.log("   - If verification fails, check compiler version exactly matches");
console.log("   - Ensure optimization settings are correct (enabled, 200 runs)");
console.log("   - Make sure EVM version is set to 'london'");
console.log("   - Verify the source code is properly flattened");
console.log("   - Constructor arguments should be empty for Multicall3");
console.log();

console.log("🎉 Once verified, your Multicall3 contract will be publicly readable!");
console.log("Users can interact with it directly through the block explorer.");
console.log();

// Save this guide to a file
const guideContent = `# Multicall3 Manual Verification Guide

## Contract Information
- **Contract Name**: Multicall3
- **Contract Address**: ${deploymentInfo.multicall3.address}
- **Network**: Monad Mainnet (Chain ID: 143)
- **Transaction Hash**: ${deploymentInfo.multicall3.transactionHash}
- **Block Number**: ${deploymentInfo.multicall3.blockNumber}

## Monad Block Explorer
- **Explorer URL**: https://explorer.monad.xyz
- **Contract URL**: https://explorer.monad.xyz/address/${deploymentInfo.multicall3.address}

## Compiler Settings
- **Solidity Version**: 0.8.12
- **EVM Version**: london
- **Optimization**: Enabled
- **Optimization Runs**: 200
- **License**: MIT

## Source Code
- **Flattened File**: flattened/Multicall3_flattened.sol
- **Contract Name in Source**: Multicall3

## Constructor Parameters
- **Constructor Arguments**: None (Multicall3 has no constructor parameters)
- **ABI-Encoded Constructor**: 0x (empty)

## Step-by-Step Verification Process

### 1. Open Monad Block Explorer
Go to: https://explorer.monad.xyz/address/${deploymentInfo.multicall3.address}

### 2. Navigate to Contract Tab
- Click on the 'Contract' tab
- Click 'Verify and Publish' button

### 3. Configure Compiler Settings
- Compiler Type: Solidity (Single file)
- Compiler Version: v0.8.12+commit.f00d7308
- Open Source License Type: MIT License (MIT)

### 4. Optimization Settings
- Optimization: Yes
- Runs: 200
- EVM Version: london

### 5. Source Code
- Copy the entire content from: flattened/Multicall3_flattened.sol
- Paste it in the 'Enter the Solidity Contract Code' field

### 6. Constructor Arguments
- Leave 'Constructor Arguments ABI-encoded' field EMPTY
- Multicall3 has no constructor parameters

### 7. Submit Verification
- Click 'Verify and Publish'
- Wait for verification to complete

## Verification Test
After successful verification, test these functions:
- getChainId() should return: 143
- getBlockNumber() should return current block number
- getEthBalance(${deploymentInfo.multicall3.deployer}) should return deployer balance

## Files Needed for Verification
- ✅ flattened/Multicall3_flattened.sol (source code)
- ✅ This verification guide

## Verification Checklist
- [ ] Contract address copied correctly
- [ ] Compiler version set to 0.8.12
- [ ] Optimization enabled with 200 runs
- [ ] EVM version set to london
- [ ] MIT license selected
- [ ] Flattened source code pasted
- [ ] Constructor arguments left empty
- [ ] Verification submitted

## Useful Links
- Contract: https://explorer.monad.xyz/address/${deploymentInfo.multicall3.address}
- Transaction: https://explorer.monad.xyz/tx/${deploymentInfo.multicall3.transactionHash}
- Monad Docs: https://docs.monad.xyz

## Troubleshooting
- If verification fails, check compiler version exactly matches
- Ensure optimization settings are correct (enabled, 200 runs)
- Make sure EVM version is set to 'london'
- Verify the source code is properly flattened
- Constructor arguments should be empty for Multicall3

Once verified, your Multicall3 contract will be publicly readable!
Users can interact with it directly through the block explorer.
`;

const guideFile = path.join(__dirname, '..', 'MULTICALL3-VERIFICATION-GUIDE.md');
fs.writeFileSync(guideFile, guideContent);
console.log(`📄 Verification guide saved to: MULTICALL3-VERIFICATION-GUIDE.md`);