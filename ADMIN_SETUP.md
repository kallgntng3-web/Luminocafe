# Admin Setup Guide - Lumino Cafe

## Cara Membuat Admin User

Ada 2 cara untuk membuat admin user:

### Cara 1: Melalui Database Query (Recommended)

1. Pergi ke database Enter Cloud
2. Buka SQL Editor
3. Jalankan query berikut untuk membuat user admin:

```sql
-- 1. Daftarkan user baru (ganti email dan password sesuai kebutuhan)
-- Catat user_id yang dihasilkan dari query ini
INSERT INTO auth.users (
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  'admin@luminocafe.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  false,
  'authenticated'
) RETURNING id;

-- 2. Set user tersebut sebagai admin
-- Ganti 'USER_ID_DARI_STEP_1' dengan id yang didapat dari query sebelumnya
UPDATE profiles 
SET is_admin = true 
WHERE id = 'USER_ID_DARI_STEP_1';
```

### Cara 2: Melalui Signup Normal + Database Update

1. Buka website di browser
2. Daftar user baru melalui form signup (jika ada)
3. Pergi ke database Enter Cloud
4. Buka SQL Editor
5. Jalankan query untuk set user sebagai admin:

```sql
-- Ganti dengan email yang baru didaftarkan
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@luminocafe.com';
```

## Login ke Admin Panel

1. Akses: `/admin/login`
2. Gunakan email dan password yang sudah dibuat
3. Setelah login berhasil, Anda akan diarahkan ke Admin Dashboard

## Fitur Admin Panel

### 1. Dashboard (`/admin`)
- Statistik total menu items, gallery photos, reviews, dan bookings
- Quick actions untuk akses cepat ke berbagai fitur

### 2. Menu Management (`/admin/menu`)
- Tambah, edit, hapus menu items
- Atur kategori menu
- Set availability
- Upload gambar menu

### 3. Gallery Management (`/admin/gallery`)
- Upload foto gallery
- Set featured photos untuk homepage
- Tambah caption

### 4. Reviews Management (`/admin/reviews`)
- Tambah customer reviews
- Set featured reviews untuk homepage
- Atur rating

### 5. Promos Management (`/admin/promos`)
- Buat promo baru
- Set periode promo
- Upload banner promo
- Aktifkan/nonaktifkan promo

### 6. Bookings Management (`/admin/bookings`)
- Lihat semua booking yang masuk
- Update status booking (Pending → Confirmed → Completed/Cancelled)
- Real-time updates

## Tips

- Gunakan email yang valid untuk admin account
- Password minimal 6 karakter
- Auto-confirm email sudah diaktifkan untuk kemudahan testing
- Backup data secara berkala
