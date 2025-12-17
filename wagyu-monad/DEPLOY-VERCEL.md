# MemeSwap DEX - Vercel Deployment

## 🚀 Production URL
**https://wagyu-monad.vercel.app**

## 📋 Deployment Info
- **Project**: wagyu-monad
- **Framework**: Next.js
- **Region**: Singapore (sin1)
- **Chain**: Monad (Chain ID: 143)

## 🔧 Environment Variables
| Variable | Value |
|----------|-------|
| NEXT_PUBLIC_CHAIN_ID | 143 |
| NEXT_PUBLIC_GRAPH_URL | https://api.goldsky.com/api/public/project_cmj7jnjbsro2301stdkaz9yfm/subgraphs/monad-dex/1.0.0/gn |

## 📝 Update Environment Variables
1. Go to https://vercel.com/dode-2s-projects/wagyu-monad/settings/environment-variables
2. Add/Edit variables
3. Redeploy for changes to take effect

## 🔄 Redeploy Commands
```bash
# Deploy to production
vercel --prod --token YOUR_TOKEN

# Deploy preview
vercel --token YOUR_TOKEN
```

## ⏪ Rollback Commands
```bash
# List deployments
vercel ls wagyu-monad --token YOUR_TOKEN

# Rollback to previous deployment
vercel rollback --token YOUR_TOKEN

# Remove specific deployment
vercel rm DEPLOYMENT_URL --yes --token YOUR_TOKEN
```

## 🛠 Local Development
```bash
cd wagyu-monad
yarn install
yarn dev
# Open http://localhost:3000
```

## 📦 Build Locally
```bash
yarn build
yarn start
```

## ⚠️ Important Notes
- SDK (`@memeswap/sdk`) is bundled inside `./memeswap-sdk` folder
- Pre-built dist folder is included for faster Vercel builds
- Monad RPC: https://rpc4.monad.xyz

## 🔗 Contract Addresses (Monad)
- Router: `0xbdAc7DBffeeBb33F403eB0ae6bf1A445b9c6f732`
- Factory: `0xb48dBe6D4130f4a664075250EE702715748051d9`
- MasterChef: `0x1cc3Bf03dBe64B1331C8D129308e31EC7a86fAe1`
- WMON: `0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899`
