-- Script untuk membuat Admin User pertama di Lumino Cafe
-- Jalankan script ini di SQL Editor Enter Cloud

-- LANGKAH 1: Buat user baru di auth.users
-- GANTI 'admin@luminocafe.com' dan 'YourSecurePassword123' sesuai kebutuhan
DO $$
DECLARE
    new_user_id uuid;
BEGIN
    -- Insert user baru
    INSERT INTO auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        confirmation_token,
        recovery_token,
        email_change_token_new,
        email_change,
        created_at,
        updated_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        confirmation_sent_at
    )
    VALUES (
        '00000000-0000-0000-0000-000000000000'::uuid,
        gen_random_uuid(),
        'authenticated',
        'authenticated',
        'namahaikal8@gmail.com',  -- GANTI DENGAN EMAIL ANDA
        crypt('Haikal123', gen_salt('bf')),  -- GANTI DENGAN PASSWORD ANDA
        now(),
        '',
        '',
        '',
        '',
        now(),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{}'::jsonb,
        false,
        now()
    )
    RETURNING id INTO new_user_id;

    -- Set user sebagai admin
    UPDATE profiles 
    SET is_admin = true true WHERE email = 'namahaikal8@gmail.com';
    WHERE id = new_user_id;

    -- Tampilkan info
    RAISE NOTICE 'Admin user created successfully!';
    RAISE NOTICE 'User ID: %', new_user_id;
    RAISE NOTICE 'Email: admin@luminocafe.com';
    RAISE NOTICE 'You can now login at /admin/login';
END $$;

-- Atau jika Anda sudah punya user yang terdaftar, jalankan query ini:
-- UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
