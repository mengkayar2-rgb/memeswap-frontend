# Wagyu Frontend - Monad Mainnet

DEX Frontend yang sudah dikonfigurasi untuk Monad Mainnet (Chain ID: 143).

## 🚀 Quick Start

```bash
# 1. Install dependencies (menggunakan yarn 1.x)
yarn install

# 2. Jalankan development server
yarn dev

# 3. Buka browser
# http://localhost:3000
```

## 📋 Konfigurasi

### Environment Variables (.env.local)

```env
NEXT_PUBLIC_CHAIN_ID=143
NEXT_PUBLIC_NODE=https://rpc.monad.xyz
NEXT_PUBLIC_FACTORY_ADDRESS=0xb48dBe6D4130f4a664075250EE702715748051d9
NEXT_PUBLIC_ROUTER_ADDRESS=0xbdAc7DBffeeBb33F403eB0ae6bf1A445b9c6f732
NEXT_PUBLIC_WETH_ADDRESS=0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899
NEXT_PUBLIC_MMF_ADDRESS=0x28dD3002Ca0040eAc4037759c9b372Ca66051af6
NEXT_PUBLIC_SYRUP_ADDRESS=0x0FfCe1fDD4ae2A296D8229784797f8fE4A7C9ac0
NEXT_PUBLIC_MASTERCHEF_ADDRESS=0x1cc3Bf03dBe64B1331C8D129308e31EC7a86fAe1
NEXT_PUBLIC_MULTICALL_ADDRESS=0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e
NEXT_PUBLIC_INIT_CODE_HASH=0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293
NEXT_PUBLIC_BLOCK_EXPLORER=https://explorer.monad.xyz
```

### Contract Addresses

| Contract | Address |
|----------|---------|
| Factory | `0xb48dBe6D4130f4a664075250EE702715748051d9` |
| Router | `0xbdAc7DBffeeBb33F403eB0ae6bf1A445b9c6f732` |
| WETH/WMON | `0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899` |
| **MMF Token (CAKE)** | `0x28dD3002Ca0040eAc4037759c9b372Ca66051af6` |
| Syrup | `0x0FfCe1fDD4ae2A296D8229784797f8fE4A7C9ac0` |
| MasterChef | `0x1cc3Bf03dBe64B1331C8D129308e31EC7a86fAe1` |
| Multicall | `0x752521d2aA5F2EB39b76B4738A7E6a78503fE07e` |

### Token Utama: MMF
MMF adalah token utama (pengganti CAKE) di Monad:
- Address: `0x28dD3002Ca0040eAc4037759c9b372Ca66051af6`
- Symbol: MMF
- Decimals: 18
- Harga placeholder: $1.00 (karena farms disabled)

### Init Code Hash
```
0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293
```

## 🦊 Tambah Network Monad di MetaMask

1. Buka MetaMask → Settings → Networks → Add Network
2. Isi dengan data berikut:

| Field | Value |
|-------|-------|
| Network Name | Monad Mainnet |
| RPC URL | https://rpc.monad.xyz |
| Chain ID | 143 |
| Currency Symbol | MON |
| Block Explorer | https://explorer.monad.xyz |

Atau klik tombol "Add Network" di aplikasi saat connect wallet.

## ⚠️ Fitur yang Dinonaktifkan

Beberapa fitur dinonaktifkan sementara karena belum ada subgraph:

- **Farms** - Redirect ke /swap
- **Pools** - Redirect ke /swap  
- **Lottery** - Redirect ke home
- **Info/Analytics** - Redirect ke /swap

Fitur ini akan diaktifkan setelah subgraph tersedia.

## 🛠️ Development Commands

```bash
# Development
yarn dev

# Build production
yarn build

# Start production server
yarn start

# Lint
yarn lint

# Type check
yarn typechain
```

## 🔄 Rollback ke Kode Asli

```bash
# Simpan perubahan saat ini
git stash

# Kembali ke branch utama
git checkout main

# Atau reset semua perubahan
git reset --hard HEAD
```

## 📁 Struktur Folder (Level 2)

```
wagyu-monad/
├── .github/
│   ├── workflows/       # CI/CD workflows
│   └── CODEOWNERS
├── .husky/
│   └── pre-commit       # Git hooks
├── cypress/
│   ├── integration/     # E2E tests
│   └── support/
├── doc/
│   ├── Cypress.md
│   ├── Farms.md
│   ├── Info.md
│   ├── Pools.md
│   └── Tokens.md
├── public/
│   ├── fonts/
│   ├── images/
│   ├── locales/
│   ├── favicon.ico
│   └── logo.png
├── scripts/
│   └── updateLPsAPR.ts
├── src/
│   ├── components/      # React components
│   │   ├── Menu/        # Navigation menu
│   │   ├── SubgraphHealthIndicator/
│   │   └── ...
│   ├── config/
│   │   ├── abi/         # Contract ABIs
│   │   ├── constants/   # Addresses, tokens, endpoints
│   │   └── localization/
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom hooks
│   ├── packages/
│   │   └── uikit/       # UI components
│   ├── pages/           # Next.js pages
│   │   ├── farms/       # (disabled - redirect)
│   │   ├── pools/       # (disabled - redirect)
│   │   ├── info/        # (disabled - redirect)
│   │   ├── swap.tsx     # ✅ Active
│   │   ├── liquidity.tsx # ✅ Active
│   │   └── lottery.tsx  # (disabled - redirect)
│   ├── state/           # Redux store
│   ├── utils/           # Helper functions
│   └── views/           # Page layouts
├── .env.local           # ✅ Monad config
├── package.json
├── yarn.lock            # Yarn 1.x lockfile
├── next.config.js
├── tsconfig.json
└── README-MONAD.md      # This file
```

## 🐛 Troubleshooting

### Error: "One base RPC URL is undefined"
Pastikan file `.env.local` ada dan berisi `NEXT_PUBLIC_NODE`.
```bash
# Cek file .env.local
cat .env.local | grep NEXT_PUBLIC_NODE
```

### MetaMask tidak connect
1. Pastikan Chain ID = 143
2. Pastikan RPC URL benar: `https://rpc.monad.xyz`
3. Clear cache MetaMask dan refresh page
4. Coba disconnect dan reconnect wallet

### Build error terkait TypeScript
```bash
yarn typechain
yarn build
```

### Error: "Module not found" atau dependency issues
```bash
# Hapus node_modules dan reinstall
rm -rf node_modules
rm yarn.lock
yarn install
```

### Error: Memory heap out of memory (RAM 8GB)
```bash
# Set NODE_OPTIONS untuk increase memory
set NODE_OPTIONS=--max-old-space-size=4096
yarn build
```

### Error: "Cannot find module '@wagyu-swap/sdk'"
SDK di-install dari GitHub. Pastikan koneksi internet stabil:
```bash
yarn add @wagyu-swap/sdk@https://github.com/wagyuswapapp/wagyu-swap-sdk.git#06b00c583ed662ac51ef0adb5fa27d1b4e9799e5
```

### Halaman Farms/Pools/Lottery redirect terus
Ini normal - fitur tersebut dinonaktifkan untuk Monad karena belum ada subgraph.

### Port 3000 sudah digunakan
```bash
# Gunakan port lain
yarn dev -p 3001
```

### Error saat swap: "Insufficient liquidity"
Pastikan ada liquidity pool untuk pair yang ingin di-swap di Monad.

### Error: "Cannot read properties of undefined (reading 'tokenPriceBusd')"
Error ini sudah di-fix dengan bypass selector farms. Jika masih muncul:
```bash
# Rebuild aplikasi
yarn build
yarn dev
```

### Harga MMF menampilkan $1.00
Ini normal - harga placeholder karena farms disabled. Harga real akan muncul setelah farms diaktifkan.

### Error: "Cannot convert undefined or null to object"
Error ini terjadi karena tokenMap untuk chain 143 tidak ada. Sudah di-fix dengan:
1. Menambahkan token MMF, WMON, SYRUP ke `tokenLists/pancake-default.tokenlist.json`
2. Update `src/hooks/Tokens.ts` untuk handle undefined tokenMap
3. Update `src/state/types.ts` dan `src/state/lists/hooks.ts` untuk include chain 143

### Error: "Cannot read properties of undefined (reading 'address')"
Error ini terjadi karena WETH[chainId] undefined untuk chain 143. Sudah di-fix dengan:
1. Update `src/hooks/useContract.ts` - tambah MONAD_WETH_ADDRESS
2. Update `src/utils/wrappedCurrency.ts` - tambah getWETH() dengan Monad support
3. Update `src/hooks/useWrapCallback.ts` - tambah MONAD_WMON token

### Error: "Cannot read properties of undefined (reading 'chainId')" di useBUSDPrice.ts
Error ini terjadi karena `busd` atau `WVLX` token undefined pada chain Monad. Sudah di-fix dengan:
1. Update `src/config/constants/tokens.ts` - tambah `busd: MONAD_TOKENS.MMF` di monadTokens
2. Update `src/hooks/useBUSDPrice.ts` - tambah early return jika `!busd || !WVLX`
3. Tambah safe-guard di tokenPairs useMemo untuk return empty pairs jika token undefined

### Error: "Cannot destructure property 'components' of 'object null' as it is null"
Error ini terjadi karena `pageProps` null di `_app.tsx`. Sudah di-fix dengan:
1. Update `src/pages/_app.tsx` - tambah safe-guard `const safePageProps = pageProps || {}`
2. Tambah early return jika `!Component` untuk handle undefined Component
3. Gunakan `safePageProps` instead of `pageProps` di seluruh file

## 📸 Screenshot

Setelah menjalankan `yarn dev`, buka http://localhost:3000 di browser:

```
┌─────────────────────────────────────────────────────────────┐
│  🥩 WagyuSwap                    [Trade ▼] [More ▼]  [🔗]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────────┐                      │
│                    │     Swap        │                      │
│                    ├─────────────────┤                      │
│                    │ From:           │                      │
│                    │ [MON    ▼] 0.0  │                      │
│                    │                 │                      │
│                    │       ↓         │                      │
│                    │                 │                      │
│                    │ To:             │                      │
│                    │ [Select ▼] 0.0  │                      │
│                    │                 │                      │
│                    │ [Connect Wallet]│                      │
│                    └─────────────────┘                      │
│                                                             │
│  Chain: Monad Mainnet (143)                                 │
└─────────────────────────────────────────────────────────────┘
```

Fitur yang tersedia:
- ✅ Swap tokens
- ✅ Add/Remove Liquidity
- ✅ Connect Wallet (MetaMask, WalletConnect)
- ⏳ Farms (coming soon)
- ⏳ Pools (coming soon)

## 🔧 Perubahan Teknis (Update Terbaru)

### A. Chain Dropdown - Monad Mainnet (143)
File: `src/components/NetworkSwitcher/index.tsx`
- Menampilkan "Monad Mainnet (143)" di dropdown
- Tombol "Add Monad" untuk menambah network ke wallet

### B. Balance Token Load Cepat
- RPC: `https://rpc.monad.xyz`
- Chain ID: 143
- Konfigurasi di `.env.local`, `.env.development`, `.env.production`

### C. Swap & LP dengan Init Code Hash Benar
File: `src/utils/pairAddress.ts` (baru)
- Custom `computePairAddress()` untuk Monad
- Init Code Hash: `0x67bc0babb7c46b28f84870387b02369e61d55e3b07da260cfeb73b382d275293`

File yang diupdate:
- `src/hooks/usePairs.ts` - menggunakan `computePairAddress`
- `src/utils/getLpAddress.ts` - menggunakan `computePairAddress`

### D. Subgraph Dinonaktifkan
File: `src/config/constants/endpoints.ts`
- `INFO_CLIENT[143] = null`
- `BLOCKS_CLIENT[143] = null`
- `GRAPH_API_LOTTERY[143] = null`

File yang diupdate untuk handle null:
- `src/utils/graphql.ts` - dummy endpoint jika null
- `src/state/swap/fetch/fetchDerivedPriceData.ts` - skip jika null
- `src/state/info/queries/tokens/priceData.ts` - return empty jika null

### E. SDK Update
File: `node_modules/@wagyu-swap/sdk/src/addresses.json`
- Ditambahkan konfigurasi chain 143 (Monad)

File: `node_modules/@wagyu-swap/sdk/src/constants.ts`
- Ditambahkan `ChainId.MONAD = 143`
- Ditambahkan `FACTORY_ADDRESS_MAP` dan `INIT_CODE_HASH_MAP`

## 📋 Create Pair MMF-WMON

Jika pair belum ada, buat via explorer:

1. Buka https://explorer.monad.xyz
2. Go to Factory contract: `0xb48dBe6D4130f4a664075250EE702715748051d9`
3. Write Contract → `createPair`
4. Parameter:
   - tokenA: `0x28dD3002Ca0040eAc4037759c9b372Ca66051af6` (MMF)
   - tokenB: `0xFfDFF1bAb47d8e6D1Da119F5C925fAC91FAfA899` (WMON)
5. Execute dengan MetaMask

Atau gunakan UI "Create Pair" di aplikasi.

## 📞 Support

- Docs: https://docs.wagyuswap.xyz
- GitHub: https://github.com/wagyuswapapp

---

✅ **Monad 143 tersedia – swap & LP aktif – dev lancar di http://localhost:3000**
