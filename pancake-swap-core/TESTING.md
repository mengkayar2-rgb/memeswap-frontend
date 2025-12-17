# PancakeFactory Contract Testing Guide

## Overview

This guide provides comprehensive testing for your deployed PancakeFactory contract on Monad Mainnet. The tests verify functionality, security, and readiness for Phase 2.

## Prerequisites

1. **Deployed Contract**: Ensure PancakeFactory is deployed successfully
2. **Environment Setup**: `.env` file configured with RPC and private key
3. **Dependencies**: All npm packages installed

## Quick Test Commands

### 🏥 Health Check (Recommended First)
```bash
npm run test:health
```
**Purpose**: Quick verification that your contract is operational
**Duration**: ~30 seconds
**What it checks**:
- Contract exists and has bytecode
- Contract responds to function calls
- Init code hash consistency
- Access control configuration
- Pair creation readiness

### 🧪 Full Functionality Test
```bash
npm run test:deployed
```
**Purpose**: Comprehensive testing of all contract features
**Duration**: ~2-3 minutes
**What it tests**:
- Basic contract information retrieval
- Mock token deployment
- Pair creation functionality
- Event emission
- Access control mechanisms

### 🤝 Contract Interaction
```bash
npm run test:interact
```
**Purpose**: Interactive exploration of contract state
**Duration**: ~30 seconds
**What it shows**:
- Current contract configuration
- All existing pairs
- Fee settings
- Pair details

### 🎯 Run All Tests
```bash
npm run test:all
```
**Purpose**: Complete test suite execution
**Duration**: ~3-4 minutes

## Test Scenarios Covered

### 1. Contract Deployment Verification
- ✅ Contract bytecode exists
- ✅ Contract address is valid
- ✅ Network configuration correct
- ✅ Gas usage within limits

### 2. Basic Functionality Tests
- ✅ `feeToSetter()` returns correct address
- ✅ `feeTo()` returns current fee recipient
- ✅ `INIT_CODE_PAIR_HASH()` returns consistent hash
- ✅ `allPairsLength()` returns pair count
- ✅ Contract responds to all view functions

### 3. Pair Creation Tests
- ✅ Deploy mock ERC20 tokens
- ✅ Create new trading pairs
- ✅ Verify pair addresses
- ✅ Check pair storage in arrays
- ✅ Prevent duplicate pair creation
- ✅ Validate pair creation events

### 4. Access Control Tests
- ✅ Only `feeToSetter` can modify fee settings
- ✅ `setFeeTo()` function works correctly
- ✅ `setFeeToSetter()` function works correctly
- ✅ Unauthorized access is prevented

### 5. Event Emission Tests
- ✅ `PairCreated` events are emitted
- ✅ Event parameters are correct
- ✅ Event indexing works properly

### 6. Edge Case Tests
- ✅ Identical token addresses rejected
- ✅ Zero address validation
- ✅ Existing pair detection
- ✅ Large number handling

## Expected Test Results

### Successful Health Check Output:
```
🏥 PANCAKEFACTORY HEALTH CHECK
============================================================
📊 HEALTH SCORE SUMMARY
============================================================
Score: 10/10 (100%)
🟢 EXCELLENT - Contract is fully operational

📋 RECOMMENDATIONS:
- Contract is ready for Phase 2 (Router deployment)
- All systems operational
```

### Successful Functionality Test Output:
```
🧪 TESTING DEPLOYED PANCAKEFACTORY CONTRACT
============================================================
📋 TEST SUMMARY
============================================================
✅ Contract connection: PASSED
✅ Basic info retrieval: PASSED
✅ Init code hash verification: PASSED
✅ Token deployment: PASSED
✅ Pair creation: PASSED
✅ Event emission: PASSED

🎉 CONTRACT TESTING COMPLETED!
Your PancakeFactory is working correctly on Monad Mainnet!
```

## Troubleshooting

### Common Issues and Solutions

#### ❌ "Contract not found"
**Cause**: Contract address incorrect or not deployed
**Solution**: 
```bash
# Verify deployment
cat deployments-info/monad-deployment.json
# Re-deploy if necessary
npm run deploy:factory
```

#### ❌ "Network connection failed"
**Cause**: RPC URL issues or network problems
**Solution**:
```bash
# Check .env file
cat .env
# Test network connection
curl -X POST [YOUR_RPC_URL] -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

#### ❌ "Insufficient funds for gas"
**Cause**: Low ETH balance in deployer wallet
**Solution**:
```bash
# Check balance in test output
# Add more ETH to your wallet
```

#### ❌ "Transaction reverted"
**Cause**: Contract logic error or invalid parameters
**Solution**:
- Check constructor arguments
- Verify contract compilation
- Review transaction parameters

#### ❌ "Timeout error"
**Cause**: Network congestion or slow RPC
**Solution**:
- Increase timeout in hardhat.config.js
- Try different RPC endpoint
- Wait and retry

### Test Failure Analysis

#### Health Score < 100%
- **90-99%**: Minor issues, contract mostly functional
- **70-89%**: Some problems, investigate failed tests
- **50-69%**: Significant issues, may need redeployment
- **<50%**: Critical problems, definitely need redeployment

#### Specific Test Failures
1. **Contract existence failure**: Redeploy contract
2. **Function call failures**: Check network and RPC
3. **Init code hash mismatch**: Recompile and redeploy
4. **Access control failures**: Verify deployer permissions
5. **Pair creation failures**: Check token contracts

## Performance Metrics

### Expected Gas Usage
- **Contract Deployment**: ~3,100,000 gas
- **Pair Creation**: ~2,500,000 gas per pair
- **View Functions**: <50,000 gas each
- **Admin Functions**: ~50,000-100,000 gas

### Expected Response Times
- **Health Check**: <30 seconds
- **Basic Queries**: <5 seconds each
- **Pair Creation**: 10-30 seconds (depending on network)
- **Full Test Suite**: 2-4 minutes

## Next Steps After Successful Testing

1. **Save Test Results**: Keep logs for reference
2. **Document Contract Addresses**: Update your deployment records
3. **Proceed to Phase 2**: Deploy PancakeRouter with verified INIT_CODE_HASH
4. **Monitor Contract**: Set up monitoring for production use

## Security Considerations

- ✅ All tests use read-only operations where possible
- ✅ Test tokens are deployed temporarily
- ✅ No mainnet funds at risk during testing
- ✅ Access control properly validated
- ✅ Event emission confirms proper operation

## Support

If tests fail consistently:
1. Review this troubleshooting guide
2. Check network status and RPC health
3. Verify contract deployment was successful
4. Consider redeployment if critical issues persist

Remember: Successful testing here means your contract is ready for Phase 2 (Router deployment)!