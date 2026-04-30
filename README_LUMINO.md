# Lumino Cafe Website

Website modern untuk Lumino Cafe dengan sistem manajemen admin lengkap. Dibangun dengan React, TypeScript, Tailwind CSS, dan Enter Cloud (Supabase).

## 🌟 Fitur Utama

### Untuk Pengunjung
- **Homepage** dengan informasi lengkap cafe
- **Menu** lengkap dengan kategori (Coffee, Non-Coffee, Tea)
- **All You Can Drink** package details
- **Gallery** foto-foto cafe (#LuminoMoment)
- **Promo** terbaru dan penawaran spesial
- **Location** & contact information
- **Book Table** - reservasi meja online

### Untuk Admin
- **Dashboard** dengan statistik lengkap
- **Menu Management** - kelola menu items
- **Gallery Management** - kelola foto gallery
- **Reviews Management** - kelola customer reviews
- **Promos Management** - kelola promo dan penawaran
- **Bookings Management** - kelola reservasi dengan real-time updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ dan pnpm
- Enter Cloud sudah terhubung (otomatis)

### Installation
```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Website akan berjalan di `http://localhost:5173`

## 👤 Setup Admin User

Untuk membuat admin user pertama, ikuti panduan di [ADMIN_SETUP.md](./ADMIN_SETUP.md)

**Quick Setup:**
1. Buka SQL Editor di Enter Cloud
2. Jalankan query untuk membuat admin user
3. Login di `/admin/login`

## 📁 Struktur Project

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── admin/           # Admin-specific components
│   ├── Layout.tsx       # Main layout wrapper
│   ├── Navbar.tsx       # Navigation bar
│   └── Footer.tsx       # Footer
├── contexts/
│   └── AuthContext.tsx  # Authentication context
├── pages/
│   ├── Home.tsx         # Homepage
│   ├── Menu.tsx         # Menu page
│   ├── AllYouCanDrink.tsx
│   ├── Gallery.tsx
│   ├── Promo.tsx
│   ├── Location.tsx
│   ├── BookTable.tsx
│   └── admin/           # Admin pages
│       ├── Dashboard.tsx
│       ├── MenuManagement.tsx
│       ├── GalleryManagement.tsx
│       ├── ReviewsManagement.tsx
│       ├── PromosManagement.tsx
│       └── BookingsManagement.tsx
├── integrations/
│   └── supabase/        # Auto-generated Supabase integration
└── router.tsx           # Route definitions
```

## 🗄️ Database Schema

### Tables
- **categories** - Kategori menu (Coffee, Non-Coffee, Tea)
- **menu_items** - Menu items dengan detail lengkap
- **reviews** - Customer reviews
- **gallery_photos** - Gallery photos
- **promos** - Promotional offers
- **bookings** - Table reservations
- **profiles** - User profiles dengan admin flag

### Security
- Row Level Security (RLS) enabled pada semua tables
- Public dapat melihat data publik
- Admin memiliki akses penuh

## 🎨 Design System

Website menggunakan color palette warm cafe theme:
- **Primary**: Warna coklat tua untuk teks dan elemen utama
- **Secondary**: Warna krem untuk background
- **Accent**: Warna coklat medium untuk highlights
- **Muted**: Warna netral untuk supporting text

Design responsif untuk semua ukuran layar (mobile, tablet, desktop).

## 📱 Routes

### Public Routes
- `/` - Homepage
- `/menu` - Menu page
- `/all-you-can-drink` - Package details
- `/gallery` - Photo gallery
- `/promo` - Promotions
- `/location` - Location & contact
- `/book` - Table reservation

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin` - Dashboard
- `/admin/menu` - Menu management
- `/admin/gallery` - Gallery management
- `/admin/reviews` - Reviews management
- `/admin/promos` - Promos management
- `/admin/bookings` - Bookings management

## 🔧 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **Backend**: Enter Cloud (Supabase)
- **Database**: PostgreSQL
- **Auth**: Supabase Auth
- **Routing**: React Router v6
- **Form Handling**: React Hook Form (ready)
- **Notifications**: Sonner

## 📝 Environment Variables

Tidak perlu setup manual - semua sudah dikonfigurasi otomatis oleh Enter Cloud.

## 🚀 Deployment

Project ini sudah siap deploy. Build dengan:

```bash
pnpm build
```

Output akan ada di folder `dist/`.

## 📖 Documentation

- [FEATURES.md](./FEATURES.md) - Daftar lengkap semua fitur
- [ADMIN_SETUP.md](./ADMIN_SETUP.md) - Panduan setup admin user

## 💡 Tips

1. **Testing Admin**: Auto-confirm email sudah aktif untuk kemudahan testing
2. **Sample Data**: Sudah ada sample data (categories & menu items)
3. **Real-time**: Bookings menggunakan real-time updates
4. **Images**: Upload gambar via URL (bisa integrasi upload service)

## 🐛 Troubleshooting

### Tidak bisa login admin
- Pastikan sudah membuat user dan set `is_admin = true` di database
- Check email & password yang digunakan

### Data tidak muncul
- Check browser console untuk error
- Pastikan RLS policies sudah benar
- Verify data ada di database

### Build error
- Jalankan `pnpm install` ulang
- Clear cache: `rm -rf node_modules/.vite`

## 📞 Support

Untuk pertanyaan atau masalah, silakan buka issue di repository ini.

## 📄 License

MIT License - Lumino Cafe 2026
