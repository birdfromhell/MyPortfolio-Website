# Custom Spotify Track Feature

Fitur ini memungkinkan Anda untuk menampilkan track kustom di component "Spotify Now Playing" tanpa harus memutarnya di Spotify. Fitur sync Spotify normal tetap aktif dan dapat digunakan kapan saja.

## NEW: Song Search Feature 🔍

Sekarang Anda dapat **mencari lagu langsung dari database Spotify** tanpa perlu menulis manual!

### Cara Menggunakan Search:

1. **Aktifkan Custom Track** di dashboard admin
2. **Gunakan Search Box** untuk mencari lagu:
   - Ketik judul lagu: "Levitating"
   - Ketik nama artis: "Dua Lipa"
   - Ketik album: "Future Nostalgia"
   - Kombinasi: "Dua Lipa Levitating"
3. **Klik hasil pencarian** untuk otomatis mengisi form
4. **Sesuaikan pengaturan** jika diperlukan
5. **Simpan Custom Track**

### Keunggulan Search Feature:

- ✅ **No Manual Typing** - Cukup cari dan klik
- ✅ **Real Spotify Data** - Informasi akurat dari database Spotify
- ✅ **Auto-fill Everything** - Judul, artis, album, gambar, durasi otomatis terisi
- ✅ **Fast & Accurate** - Hasil pencarian real-time
- ✅ **10 Top Results** - Menampilkan hasil pencarian terbaik

## Cara Menggunakan

### 1. Akses Admin Dashboard

Kunjungi `/admin` di browser Anda untuk mengakses dashboard admin.

### 2. Custom Spotify Track Section

Di dashboard admin, Anda akan melihat section "Spotify Now Playing" dengan fitur-fitur berikut:

#### **Toggle Custom Track**

- **Enable Custom Track**: Aktifkan untuk menggunakan track kustom
- **Disable**: Kembali ke sync Spotify normal

#### **Form Input Track**

Ketika custom track diaktifkan, Anda dapat mengisi:

- **Song Title**: Judul lagu (wajib)
- **Artist**: Nama artis (wajib)
- **Album**: Nama album
- **Duration**: Durasi dalam detik (default: 180)
- **Album Image URL**: URL gambar album
- **Song URL**: URL lagu (opsional, untuk link eksternal)
- **Show as Playing**: Tampilkan sebagai sedang diputar

#### **Preview**

Lihat preview bagaimana track akan ditampilkan sebelum disimpan.

### 3. Menyimpan Custom Track

1. Isi form dengan informasi track yang diinginkan
2. Klik tombol "Save Custom Track"
3. Track kustom akan langsung ditampilkan di component Now Playing

## Features

### **Smart Toggle System**

- **Custom Mode**: Menampilkan track kustom yang Anda tentukan
- **Spotify Sync**: Kembali ke sync normal dengan akun Spotify
- **Seamless Switch**: Bisa berganti mode kapan saja tanpa restart

### **Visual Indicators**

- **Custom Badge**: Badge "Custom" muncul di Now Playing ketika menggunakan track kustom
- **Status Indicator**: Status "Custom Active" atau "Spotify Sync" di admin panel
- **Link Behavior**: External link hanya muncul untuk track Spotify asli

### **Data Persistence**

- Custom track tersimpan di file `storage/custom-track.json`
- Settings tetap tersimpan meskipun aplikasi di-restart
- Tidak mengganggu konfigurasi Spotify yang sudah ada

## How It Works

### **API Modification**

API `/api/spotify` telah dimodifikasi untuk:

1. Cek apakah custom track diaktifkan
2. Jika ya, return data custom track
3. Jika tidak, lanjutkan dengan sync Spotify normal

### **Component Integration**

Component `NowPlaying.vue` menampilkan:

- Badge "Custom" untuk track kustom
- Icon edit untuk membedakan dari track Spotify
- Link eksternal hanya untuk track Spotify asli

### **Admin Interface**

- Form yang user-friendly untuk input track
- Preview real-time
- Toggle switch yang mudah digunakan
- Status indicators yang jelas

## Use Cases

### **Content Creation**

- Menampilkan lagu yang sedang Anda kerjakan
- Promote track terbaru tanpa harus play di Spotify
- Showcase musik favorit untuk portfolio

### **Development & Testing**

- Test tampilan component tanpa harus play musik
- Demo untuk client dengan data yang konsisten
- Development offline tanpa koneksi Spotify

### **Professional Branding**

- Kontrol penuh atas musik yang ditampilkan
- Consistent branding dengan track yang dipilih
- Flexibilitas untuk special occasions

## Technical Details

### **File Structure**

```
├── components/
│   ├── CustomTrackManager.vue    # Admin component
│   └── NowPlaying.vue           # Updated dengan custom indicator
├── server/api/
│   ├── admin/custom-track.ts    # Custom track management API
│   └── spotify.ts              # Modified untuk support custom
├── storage/
│   ├── custom-track.json       # Data storage (auto-created)
│   └── .gitignore             # Ignore custom track file
└── pages/
    └── admin.vue              # Updated dengan CustomTrackManager
```

### **Data Format**

```json
{
  "enabled": true,
  "title": "Song Title",
  "artist": "Artist Name",
  "album": "Album Name",
  "albumImageUrl": "https://example.com/image.jpg",
  "songUrl": "https://example.com/song",
  "isPlaying": true,
  "duration": 180,
  "progress": 0
}
```

### **API Endpoints**

#### **GET `/api/admin/custom-track`**

Mengambil data custom track saat ini.

#### **POST `/api/admin/custom-track`**

Menyimpan/update custom track dengan data baru.

#### **GET `/api/spotify`**

API yang sudah dimodifikasi:

- Cek custom track terlebih dahulu
- Fallback ke Spotify sync jika custom disabled

## Security & Performance

- **File-based Storage**: Ringan dan tidak memerlukan database
- **Admin Only**: Hanya accessible melalui `/admin` route
- **No Spotify Interference**: Tidak mengganggu konfigurasi Spotify
- **Instant Switch**: Pergantian mode real-time tanpa restart

## Troubleshooting

### **Custom Track Tidak Muncul**

1. Pastikan toggle "Enable Custom Track" aktif
2. Cek apakah title dan artist sudah diisi
3. Klik "Save Custom Track" setelah mengisi form

### **Gambar Tidak Muncul**

1. Pastikan URL gambar valid dan accessible
2. Coba gunakan URL yang support CORS
3. Gunakan https:// untuk URL gambar

### **Progress Bar Tidak Bergerak**

- Progress bar pada custom track bersifat static
- Hanya Spotify sync yang memiliki real-time progress

### **Reset ke Spotify Sync**

1. Toggle off "Enable Custom Track"
2. Atau klik tombol "Reset" pada form

Fitur ini memberikan kontrol penuh atas display musik di portfolio Anda sambil tetap mempertahankan fungsionalitas Spotify sync yang sudah ada.
