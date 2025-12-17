# PancakeSwap V2 Router Deployment Guide - Phase 2

## Overview

This guide covers deploying the PancakeRouter contract to Monad Mainnet with your deployed Factory from Phase 1.

## Prerequisites

✅ **Phase 1 Completed**: Factory deployed with addresses:
- Factory: `0xb48dBe6D4130f4a664075250EE702715748051d9`
- Init Code Hash: `0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293`

✅ **Critical Modification Applied**: PancakeLibrary.sol updated with your init code hash

## Setup Instructions

### 1. Install Dependencies
```bash
cd pancake-swap-periphery
npm install
```

### 2. Setup Environment
```bash
cp .env.example .env
```

Edit `.env` file:
```bash
MONAD_RPC_URL=your_monad_rpc_url
PRIVATE_KEY=your_private_key_without_0x
FACTORY_ADDRESS=0xb48dBe6D4130f4a664075250EE702715748051d9
WETH_ADDRESS=  # Leave empty to deploy mock WETH
```

### 3. Verify Library Modification
The critical modification has been applied to:
**File**: `contracts/libraries/PancakeLibrary.sol`
**Line 23**: Updated init code hash to your factory's hash

## Deployment Options

### Option 1: Deploy Router with Mock WETH (Recommended)
```bash
npm run deploy:router
```
This will:
- Deploy a mock WETH (WMON) contract if no WETH_ADDRESS is provided
- Deploy PancakeRouter with your Factory and the WETH address
- Save all addresses for future phases

### Option 2: Deploy WETH Separately First
```bash
# Deploy WETH first
npm run deploy:weth

# Copy the WETH address to your .env file
# Then deploy router
npm run deploy:router
```

### Option 3: Use Existing WETH
If you have an existing WETH contract on Monad:
```bash
# Add WETH address to .env
WETH_ADDRESS=0xYourExistingWETHAddress

# Deploy router
npm run deploy:router
```

## Expected Output

After successful deployment:

```
🎯 PHASE 2 DEPLOYMENT SUMMARY
============================================================
🏭 Factory Address: 0xb48dBe6D4130f4a664075250EE702715748051d9
🔄 Router Address: 0x[NEW_ROUTER_ADDRESS]
💎 WETH Address: 0x[WETH_ADDRESS]
============================================================
```

## Testing Your Deployment

### Quick Test
```bash
npm run test:router
```

This verifies:
- Router connects to correct Factory
- WETH integration works
- Basic router functions respond
- View functions calculate correctly

## Important Files Created

- `deployments-info/monad-router-deployment.json` - Complete deployment details
- `contracts/WETH.sol` - Mock WETH contract (if deployed)
- `scripts/deploy-router.js` - Main deployment script

## Troubleshooting

### Common Issues

#### ❌ "Library modification not applied"
**Solution**: Verify `contracts/libraries/PancakeLibrary.sol` line 23 contains your init code hash

#### ❌ "Factory address mismatch"
**Solution**: Check FACTORY_ADDRESS in .env matches your Phase 1 deployment

#### ❌ "Compilation failed"
**Solution**: 
```bash
npm run clean
npm run compile
```

#### ❌ "WETH deployment failed"
**Solution**: Ensure sufficient ETH balance for gas fees

#### ❌ "Router deployment reverted"
**Solution**: 
- Verify Factory address is correct
- Check WETH address is valid contract
- Ensure sufficient gas limit

## Security Checklist

- [ ] Factory address verified from Phase 1
- [ ] Init code hash updated in PancakeLibrary.sol
- [ ] WETH contract deployed or verified
- [ ] Router deployment successful
- [ ] Test suite passes
- [ ] Addresses saved securely

## Next Steps

After successful Phase 2:

1. **Save Addresses**: Record Router and WETH addresses
2. **Test Functionality**: Run the test suite
3. **Proceed to Phase 3**: Deploy Farming contracts (MasterChef, CAKE token)
4. **Update Records**: Add Router address to your deployment documentation

## Phase 2 Completion Checklist

- [ ] PancakeLibrary.sol updated with correct init code hash
- [ ] WETH contract deployed (or existing address configured)
- [ ] PancakeRouter deployed successfully
- [ ] Router connects to correct Factory
- [ ] All tests pass
- [ ] Deployment info saved
- [ ] Ready for Phase 3

## Critical Addresses for Phase 3

Save these for the next phase:
```
Factory: 0xb48dBe6D4130f4a664075250EE702715748051d9
Router: [YOUR_ROUTER_ADDRESS_FROM_DEPLOYMENT]
WETH: [YOUR_WETH_ADDRESS_FROM_DEPLOYMENT]
Init Code Hash: 0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293
```

🎉 **Phase 2 Complete!** Your PancakeSwap AMM core is now ready for farming contracts!