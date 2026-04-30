# 🎛️ Admin Features - Lumino Cafe

## ✅ Fitur Admin yang Sudah Tersedia

Sekarang Anda dapat mengedit **SEMUA konten website** melalui admin panel!

### 1️⃣ **Website Settings** (`/admin/settings`)
Edit semua pengaturan website:

**📋 Business Information**
- Nama bisnis
- Tagline
- Deskripsi bisnis

**📞 Contact Details**
- Alamat lengkap
- Nomor telepon
- Email
- Jam operasional

**🌐 Social Media**
- URL Instagram
- URL Facebook

**📍 Location & Maps**
- Latitude (koordinat GPS)
- Longitude (koordinat GPS)
- Google Maps API Key (opsional)
- Preview map langsung

### 2️⃣ **Hero Section** (`/admin/hero`)
Edit konten utama homepage:
- Badge text (contoh: "Premium Coffee Experience")
- Main title (contoh: "Welcome to Lumino Cafe")
- Subtitle
- Text tombol CTA primary
- Text tombol CTA secondary
- Live preview

### 3️⃣ **All You Can Drink Package** (`/admin/aycd`)
Kelola paket AYCD:
- Harga package (Rp)
- Features list (tambah/hapus fitur)
- Terms & conditions list
- Duration info
- Contact info

### 4️⃣ **Categories** (`/admin/categories`)
Kelola kategori menu:
- Tambah kategori baru
- Edit nama kategori
- Hapus kategori
- Atur urutan dengan tombol naik/turun

### 5️⃣ **Menu Items** (`/admin/menu`)
Kelola menu items seperti biasa

### 6️⃣ **Gallery** (`/admin/gallery`)
Upload dan kelola foto gallery

### 7️⃣ **Reviews** (`/admin/reviews`)
Kelola customer reviews

### 8️⃣ **Promos** (`/admin/promos`)
Buat dan kelola promo

### 9️⃣ **Bookings** (`/admin/bookings`)
Lihat dan kelola reservasi

## 🗺️ Cara Setup Google Maps

### Opsi 1: Tanpa API Key (Simple)
1. Buka Google Maps
2. Cari lokasi cafe Anda
3. Klik kanan pada lokasi → Pilih koordinat (latitude, longitude)
4. Copy koordinat tersebut
5. Masuk ke Admin → Settings → Location & Maps
6. Paste latitude dan longitude
7. Save Changes
8. Maps akan langsung muncul di halaman Location!

**Contoh koordinat Jakarta:**
- Latitude: `-6.2088`
- Longitude: `106.8456`

### Opsi 2: Dengan API Key (Recommended untuk production)
1. Buka [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Buat project baru atau pilih yang sudah ada
3. Enable **Maps Embed API**
4. Buat API Key
5. Copy API key
6. Masuk ke Admin → Settings → Location & Maps
7. Paste API key di field "Google Maps API Key"
8. Masukkan koordinat latitude & longitude
9. Save Changes

## 🔄 Alur Kerja Admin

### Setup Awal (Lakukan Sekali)
1. Login ke admin panel: `/admin/login`
2. Masuk ke **Settings** → Isi semua informasi bisnis
3. Masukkan koordinat GPS untuk maps
4. Update social media URLs
5. Masuk ke **Hero Section** → Customize homepage hero
6. Masuk ke **AYCD Package** → Set harga dan fitur
7. Masuk ke **Categories** → Buat kategori menu Anda

### Update Rutin
- **Menu Items**: Tambah menu baru, update harga
- **Gallery**: Upload foto-foto terbaru
- **Reviews**: Approve dan feature review pelanggan
- **Promos**: Buat promo spesial
- **Bookings**: Monitor reservasi yang masuk

## 📱 Konten yang Akan Otomatis Update di Website

### Homepage (`/`)
- ✅ Hero badge, title, subtitle, CTA buttons (dari Hero Section)
- ✅ Featured menu items
- ✅ Customer reviews
- ✅ Gallery preview

### Footer (Semua Halaman)
- ✅ Business name & tagline (dari Settings)
- ✅ Business description (dari Settings)
- ✅ Address, phone, email (dari Settings)
- ✅ Instagram & Facebook links (dari Settings)

### Location Page (`/location`)
- ✅ Contact information (dari Settings)
- ✅ Opening hours (dari Settings)
- ✅ **Google Maps** dengan GPS coordinates (dari Settings)
- ✅ Instagram URL

### All You Can Drink Page (`/all-you-can-drink`)
- ✅ Package price (dari AYCD)
- ✅ Features list (dari AYCD)
- ✅ Terms & conditions (dari AYCD)
- ✅ Duration info (dari AYCD)
- ✅ Contact info (dari AYCD)

### Menu Page (`/menu`)
- ✅ Categories filter (dari Categories)
- ✅ Menu items (dari Menu Items)

## 💡 Tips & Best Practices

### Google Maps Coordinates
- **Cara mudah dapat koordinat:**
  1. Buka [Google Maps](https://maps.google.com)
  2. Cari lokasi Anda
  3. Klik kanan pada pin lokasi
  4. Klik angka koordinat di bagian atas (akan auto-copy)
  5. Format: `-6.2088, 106.8456` (latitude, longitude)

### Social Media URLs
- Gunakan URL lengkap: `https://instagram.com/username`
- Pastikan akun public agar link berfungsi
- Test link sebelum save

### Hero Section
- Main title: Maksimal 2 baris untuk tampilan optimal
- Subtitle: Maksimal 3 baris, singkat dan menarik
- CTA text: Singkat dan action-oriented (contoh: "Lihat Menu", "Pesan Sekarang")

### AYCD Package
- Features: Fokus pada benefit untuk customer
- Terms: Jelas dan mudah dipahami
- Gunakan bahasa yang friendly

### Categories
- Buat kategori yang jelas dan mudah dipahami
- Urutan kategori akan muncul di filter menu
- Contoh kategori: Coffee, Non-Coffee, Tea, Snacks, Desserts

## 🚀 Kesimpulan

Dengan admin panel yang lengkap ini, Anda dapat:
- ✅ Mengedit SEMUA konten website tanpa coding
- ✅ Update informasi kontak kapan saja
- ✅ Ganti social media links dengan mudah
- ✅ Tampilkan lokasi di Google Maps
- ✅ Customize hero section homepage
- ✅ Manage package AYCD lengkap
- ✅ Organize menu dengan categories

**Tidak perlu edit code sama sekali!** 🎉

Semua perubahan langsung terlihat di website setelah save.

---

**Need Help?**
Semua fitur sudah lengkap dan siap digunakan. Tinggal login ke `/admin/login` dan mulai edit konten Anda!
