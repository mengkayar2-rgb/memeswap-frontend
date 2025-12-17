# PancakeSwap V2 Core Deployment Guide

## Phase 1: Factory Deployment to Monad Mainnet

### Prerequisites

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   - `MONAD_RPC_URL`: Your Monad Mainnet RPC endpoint
   - `PRIVATE_KEY`: Your deployer wallet private key (without 0x prefix)

3. **Verify Monad Network Configuration**
   - Chain ID: 34443
   - Update `hardhat.config.js` if Monad RPC URL changes

### Deployment Commands

#### Option 1: Direct Script Deployment (Recommended)
```bash
npm run deploy:factory
# or
yarn deploy:factory
```

#### Option 2: Using Hardhat Deploy
```bash
npm run deploy:all
# or
yarn deploy:all
```

#### Option 3: Local Testing First
```bash
# Start local node
npm run node

# Deploy to local network (in another terminal)
npm run deploy:factory:local
```

### Expected Output

After successful deployment, you'll see:

```
🎯 CRITICAL INFORMATION FOR NEXT PHASES:
============================================================
🏭 FACTORY_ADDRESS: 0x1234567890123456789012345678901234567890
🔑 INIT_CODE_HASH: 0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
============================================================
```

### Important Files Created

- `deployments-info/monad-deployment.json`: Contains all deployment details
- This file will be used in subsequent phases

### Next Steps

1. **Save the FACTORY_ADDRESS and INIT_CODE_HASH** - you'll need them for Phase 2
2. **Proceed to Phase 2**: Deploy PancakeRouter
3. **Update PancakeLibrary.sol** with the INIT_CODE_HASH before router deployment

### Troubleshooting

- **Insufficient funds**: Ensure your wallet has enough ETH for gas fees
- **RPC errors**: Verify your Monad RPC URL is correct and accessible
- **Private key errors**: Ensure your private key is correct (without 0x prefix)
- **Network issues**: Check if Monad Mainnet is accessible

### Security Notes

- Never commit your `.env` file
- Use a dedicated deployment wallet
- Verify contract addresses after deployment
- Keep your private keys secure