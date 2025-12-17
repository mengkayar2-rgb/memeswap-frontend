# Multicall3 Manual Verification Guide

## Contract Information
- **Contract Name**: Multicall3
- **Contract Address**: 0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e
- **Network**: Monad Mainnet (Chain ID: 143)
- **Transaction Hash**: 0x1ad15efa4793f9c33c910817eb2a0dad3e04355b4a22b3017e81d31a7f6762ce
- **Block Number**: 41427670

## Monad Block Explorer
- **Explorer URL**: https://explorer.monad.xyz
- **Contract URL**: https://explorer.monad.xyz/address/0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e

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
Go to: https://explorer.monad.xyz/address/0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e

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
- getEthBalance(0xc04AfA16f7eAE1a51dc8d5159f113a03dB1DF102) should return deployer balance

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
- Contract: https://explorer.monad.xyz/address/0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e
- Transaction: https://explorer.monad.xyz/tx/0x1ad15efa4793f9c33c910817eb2a0dad3e04355b4a22b3017e81d31a7f6762ce
- Monad Docs: https://docs.monad.xyz

## Troubleshooting
- If verification fails, check compiler version exactly matches
- Ensure optimization settings are correct (enabled, 200 runs)
- Make sure EVM version is set to 'london'
- Verify the source code is properly flattened
- Constructor arguments should be empty for Multicall3

Once verified, your Multicall3 contract will be publicly readable!
Users can interact with it directly through the block explorer.
