# Contract Verification Guide for Monad Mainnet

## Overview

Contract verification is essential for transparency and allows users to interact with your contracts through block explorers. Here are multiple methods to verify your PancakeFactory contract.

## Prerequisites

1. **Successful Deployment**: Ensure your contract is deployed successfully
2. **Deployment Info**: Have your deployment details from `deployments-info/monad-deployment.json`
3. **Source Code**: Access to the original contract source code

## Method 1: Automated Verification (Hardhat)

### Step 1: Install Dependencies
```bash
npm install @nomiclabs/hardhat-etherscan
```

### Step 2: Configure API Key
Add to your `.env` file:
```bash
MONAD_EXPLORER_API_KEY=your_api_key_here
```

### Step 3: Run Verification
```bash
npm run verify:factory
```

## Method 2: Manual Verification (Block Explorer)

### Step 1: Get Verification Details
```bash
npm run verify:manual-guide
```

This will output all the information you need for manual verification.

### Step 2: Prepare Source Code

#### Option A: Flattened Contract (Recommended)
```bash
npm run flatten:factory
```
This creates `flattened/PancakeFactory-flattened.sol` with all dependencies in one file.

#### Option B: Multi-file Upload
Use the original contract files in the `contracts/` directory.

### Step 3: Manual Verification Steps

1. **Go to Monad Block Explorer**
   - Navigate to your contract address
   - Click on the "Contract" tab
   - Click "Verify and Publish"

2. **Fill in Contract Details**
   ```
   Contract Address: [Your deployed address]
   Contract Name: PancakeFactory
   Compiler Version: 0.5.16
   Optimization: Enabled
   Optimization Runs: 999999
   EVM Version: istanbul
   ```

3. **Add Source Code**
   - Paste the flattened source code OR
   - Upload multiple files from contracts/ directory

4. **Constructor Arguments**
   - Enter the ABI-encoded constructor arguments
   - Format: `0x000000000000000000000000[YOUR_FEE_TO_SETTER_ADDRESS]`

5. **Submit Verification**
   - Complete any captcha
   - Click "Verify and Publish"

## Method 3: Using Sourcify

### Step 1: Prepare Metadata
```bash
# Compile contracts to generate metadata
npm run compile
```

### Step 2: Submit to Sourcify
1. Go to https://sourcify.dev
2. Upload your contract metadata and source files
3. Sourcify will automatically verify across multiple explorers

## Method 4: Command Line Verification

### Using Hardhat Verify Command
```bash
# Basic verification
npx hardhat verify --network monad [CONTRACT_ADDRESS] [CONSTRUCTOR_ARGS]

# Example
npx hardhat verify --network monad 0x1234...5678 0x9876...4321
```

### Using Foundry (if available)
```bash
forge verify-contract \
  --chain-id 143 \
  --num-of-optimizations 999999 \
  --compiler-version 0.5.16 \
  [CONTRACT_ADDRESS] \
  contracts/PancakeFactory.sol:PancakeFactory \
  --constructor-args $(cast abi-encode "constructor(address)" [FEE_TO_SETTER])
```

## Verification Checklist

Before submitting verification, ensure:

- [ ] Contract is successfully deployed
- [ ] You have the correct contract address
- [ ] Compiler version matches exactly (0.5.16)
- [ ] Optimization settings are correct (enabled, 999999 runs)
- [ ] Constructor arguments are properly formatted
- [ ] Source code is complete and unmodified
- [ ] Network configuration is correct

## Common Issues and Solutions

### Issue: "Compilation Error"
**Solution**: 
- Check compiler version matches deployment
- Ensure all imports are included (use flattened version)
- Verify optimization settings

### Issue: "Constructor Arguments Mismatch"
**Solution**:
- Use ABI-encoded format for constructor arguments
- Verify the fee-to-setter address is correct
- Remove any extra spaces or characters

### Issue: "Already Verified"
**Solution**:
- Contract may already be verified
- Check the contract page on the explorer
- If partially verified, try re-verification

### Issue: "Bytecode Mismatch"
**Solution**:
- Ensure exact compiler version (0.5.16)
- Check optimization runs (999999)
- Verify EVM version (istanbul)
- Use the exact source code from deployment

## Verification Status Check

After verification, you should see:
- ✅ Green checkmark on the contract page
- 📄 "Contract" tab with readable source code
- 🔍 "Read Contract" and "Write Contract" functions
- 📊 Contract ABI available for download

## Security Notes

- Always verify contracts for transparency
- Double-check the contract address before verification
- Ensure the source code matches what was actually deployed
- Keep your API keys secure and don't commit them to version control

## Support

If verification fails:
1. Check the troubleshooting section above
2. Review the deployment logs for any issues
3. Ensure all prerequisites are met
4. Try alternative verification methods
5. Contact Monad support if explorer-specific issues occur