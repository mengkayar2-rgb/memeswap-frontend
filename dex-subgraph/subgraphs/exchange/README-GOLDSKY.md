# DEX Monad Subgraph - Goldsky Deployment Guide

## Konfigurasi Monad Chain 143

```
FACTORY=0xb48dBe6D4130f4a664075250EE702715748051d9
ROUTER=0xbdAc7DBffeeBb33F403eB0ae6bf1A445b9c6f732
MASTERCHEF=0x1cc3Bf03dBe64B1331C8D129308e31EC7a86fAe1
INIT_CODE_HASH=0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293
CHAIN_ID=143
RPC=https://rpc4.monad.xyz
SUBGRAPH_NAME=dex-monad-subgraph
```

## Langkah Deployment

### A. Persiapan

```bash
# Install Goldsky CLI
npm i -g @goldskycom/cli

# Login ke Goldsky
goldsky login

# Masuk ke folder subgraph
cd dex-subgraph/subgraphs/exchange

# Install dependencies
npm install --ignore-scripts
```

### B. Build Subgraph

```bash
# Generate types
npx graph codegen subgraph.yaml

# Build subgraph
npx graph build subgraph.yaml
```

### C. Deploy ke Goldsky

```bash
# Create subgraph
goldsky subgraph create dex-monad-subgraph

# Deploy
goldsky subgraph deploy dex-monad-subgraph/1.0.0 \
  --path . \
  --network monad
```

### D. URL Query

Setelah deploy berhasil, URL query akan tersedia di:
```
https://api.goldsky.com/api/public/<PROJECT_ID>/subgraphs/dex-monad-subgraph/1.0.0/gn
```

### E. Test Query

```graphql
{
  pairs(first: 5) {
    id
    token0 { symbol }
    token1 { symbol }
    reserve0
    reserve1
  }
}
```

### F. Rollback

```bash
# Stash changes
git stash

# Atau rollback ke versi sebelumnya
goldsky subgraph deploy dex-monad-subgraph/<PREVIOUS_VERSION> --path .
```

## File yang Dikonfigurasi

- `subgraph.yaml` - Network: monad, Factory address, startBlock
- `mappings/utils/index.ts` - FACTORY_ADDRESS, ROUTER_ADDRESS, INIT_CODE_HASH
- `mappings/pricing.ts` - WMON_ADDRESS, WHITELIST tokens

## Catatan

- Pastikan Goldsky sudah mendukung Monad chain
- Jika belum, hubungi Goldsky support untuk menambahkan chain
- Alternatif: gunakan The Graph hosted service atau self-hosted node
