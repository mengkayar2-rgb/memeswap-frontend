# FIX MEMESWAP: Langkah Visual Tanpa Terminal

## 1. Verifikasi MetaMask Sudah Ada Monad (3 detik)

Buka MetaMask → lihat network di atas.  
Jika tidak ada "Monad Mainnet (143)" → ikuti langkah visual di bawah.

**A. Tambah Network Monad (Visual):**

1. Klik **network dropdown** (biasanya "Ethereum Mainnet")
2. Klik **"Add network"**
3. Klik **"Add a network manually"**
4. Isi form ini (copy-paste):
   - **Network Name**: `Monad Mainnet`
   - **RPC URL**: `https://rpc4.monad.xyz`
   - **Chain ID**: `143`
   - **Currency symbol**: `MON`
   - **Block explorer URL**: `https://explorer.monad.xyz`
5. Klik **Save**

**Hasil**: MetaMask sekarang ada "Monad Mainnet (143)" di network list.

---

## 2. Verifikasi Subgraph Ada Data (5 detik)

Buka browser ke:  
`https://api.goldsky.com/api/public/project_cmj7jnjbsro2301stdkaz9yfm/subgraphs/monad-dex/1.0.0/gn`

**A. Jalankan Query (Visual):**

1. Hapus semua teks di kolom kiri (jika ada)
2. Ketik persis ini:

```graphql
{
  pairs(first: 1) {
    id
  }
}
```

3. Klik tombol **Play** (▶️) atau tekan **Ctrl+Enter**

**Hasil yang Diharapkan:**
- Jika ada data: Anda akan melihat response JSON dengan `id` pair
- Jika kosong: `{ "data": { "pairs": [] } }` — berarti belum ada liquidity pool

---

## 3. Verifikasi Website Berjalan (Visual)

**A. Buka Website di Browser:**

1. Buka browser (Chrome/Firefox/Brave)
2. Ketik URL: `http://localhost:3000` (development) atau URL Vercel Anda
3. Tunggu halaman load

**B. Cek Koneksi Wallet:**

1. Klik tombol **"Connect Wallet"** di pojok kanan atas
2. Pilih **MetaMask**
3. MetaMask popup muncul → Klik **"Connect"**
4. Pastikan network sudah **Monad Mainnet (143)**

**Hasil**: Wallet terhubung dan menampilkan address Anda.

---

## 4. Test Swap Interface (Visual)

**A. Buka Halaman Swap:**

1. Klik menu **"Swap"** atau **"Trade"**
2. Halaman swap akan muncul

**B. Pilih Token:**

1. Klik dropdown **"From"** → Pilih **MON** (native token)
2. Klik dropdown **"To"** → Pilih token lain yang tersedia
3. Masukkan jumlah di field **"From"**

**Hasil yang Diharapkan:**
- Jika ada liquidity: Harga dan estimasi output muncul
- Jika tidak ada liquidity: Pesan "Insufficient liquidity" muncul

---

## 5. Troubleshooting Visual

### Problem: "Network Error" atau Loading Terus

**Solusi Visual:**
1. Buka MetaMask → Klik **3 titik** (menu)
2. Pilih **"Settings"** → **"Networks"**
3. Klik **"Monad Mainnet"**
4. Pastikan RPC URL: `https://rpc4.monad.xyz`
5. Klik **Save**

### Problem: Token Tidak Muncul

**Solusi Visual:**
1. Di MetaMask, klik **"Import tokens"**
2. Masukkan **contract address** token
3. Klik **"Add Custom Token"**
4. Klik **"Import"**

### Problem: Transaksi Gagal

**Solusi Visual:**
1. Buka MetaMask → Klik **"Activity"**
2. Lihat transaksi yang gagal
3. Klik transaksi → Lihat **error message**
4. Jika "insufficient funds" → Tambah MON untuk gas
5. Jika "slippage" → Naikkan slippage di settings swap (⚙️)

---

## 6. Verifikasi Contract di Explorer (Visual)

**A. Cek Factory Contract:**

1. Buka: `https://explorer.monad.xyz`
2. Paste address Factory: `0xE4B0665a1C53A1F9ACe2d8d6E50c703a0f3Aa381`
3. Klik **Search**
4. Pastikan contract **verified** (ada centang hijau)

**B. Cek Router Contract:**

1. Di explorer yang sama
2. Paste address Router: `0x0f6b3e632f1195dB0b26A8a4d489F8BCf0F0f57e`
3. Klik **Search**
4. Pastikan contract **verified**

---

## 7. Checklist Final ✅

| Item | Status |
|------|--------|
| MetaMask ada Monad Mainnet (143) | ⬜ |
| RPC URL benar: `https://rpc4.monad.xyz` | ⬜ |
| Subgraph query berhasil | ⬜ |
| Website bisa dibuka | ⬜ |
| Wallet bisa connect | ⬜ |
| Swap interface muncul | ⬜ |
| Token bisa dipilih | ⬜ |

---

## Catatan Penting

- **Tidak perlu terminal** untuk langkah-langkah di atas
- Semua bisa dilakukan via **browser** dan **MetaMask UI**
- Jika masih ada masalah setelah semua checklist ✅, kemungkinan issue ada di:
  1. Smart contract belum deploy
  2. Liquidity pool belum dibuat
  3. Subgraph belum sync

---

*Dokumen ini dibuat untuk membantu user non-teknis menyelesaikan masalah MemeSwap tanpa menggunakan terminal.*
