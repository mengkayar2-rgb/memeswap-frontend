# DEX Monad Fork - PancakeSwap untuk Monad Mainnet

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Copy environment file
cp apps/web/.env.example apps/web/.env.local

# 3. Build packages
pnpm build:packages

# 4. Run development server
pnpm dev
```

Buka http://localhost:3000 di browser.

## Konfigurasi

Chain default: **Monad Mainnet (Chain ID: 143)**

### Contract Addresses
| Contract | Address |
|----------|---------|
| Factory | `0xb48dBe6D4130f4a664075250EE702715748051d9` |
| Router | `0xbdAc7DBffeeBb33F403eB0ae6bf1A445b9c6f732` |
| WETH/WMON | `0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899` |
| MasterChef | `0x1cc3Bf03dBe64B1331C8D129308e31EC7a86fAe1` |
| Multicall | `0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e` |
| INIT_CODE_HASH | `0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293` |

### RPC & Explorer
- RPC: `https://monad-mainnet.rpc.xyz`
- Explorer: `https://explorer.monad.xyz`

## Rollback

```bash
git checkout main
```

## Catatan
- Fitur yang membutuhkan subgraph (lottery, prediction, v3 analytics) mungkin tidak berfungsi tanpa konfigurasi subgraph khusus
- Pastikan RPC endpoint aktif dan dapat diakses

---
✅ DEX siap di http://localhost:3000 – Selamat ber-trading di Monad!
