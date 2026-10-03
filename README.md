# LaporAman

Web app anti-bullying — React + Vite + Tailwind CSS + Supabase.

## Stack
React 18 · Vite · Tailwind CSS · React Router · Supabase (Auth, Postgres, Storage, RLS) · Lucide React

## 1. Install

```bash
npm install
```

## 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor** → tempel isi `supabase/schema.sql` → **Run**.
   File ini membuat semua tabel (`profiles`, `reports`, `report_updates`, `comments`,
   `comment_likes`, `comment_reports`, `notifications`), trigger otomatis
   (profil dibuat saat user daftar, likes_count tersinkron otomatis), RLS policy,
   dan storage bucket (`report-evidence`, `avatars`).
3. Daftar satu akun lewat halaman `/register` di app.
4. Jadikan akun itu admin — jalankan di SQL Editor:
   ```sql
   update public.profiles set role = 'admin'
   where id = (select id from auth.users where email = 'emailkamu@contoh.com');
   ```

## 3. Environment variables

```bash
cp .env.example .env
```
Isi `.env` dengan **Project URL** dan **anon public key** dari
Supabase Dashboard → Project Settings → API.

## 4. Jalankan

```bash
npm run dev
```
Buka `http://localhost:5173`.

## 5. Deploy ke Vercel

1. Push project ini ke GitHub.
2. Import repo di [vercel.com](https://vercel.com/new).
3. Framework preset: **Vite**.
4. Tambahkan environment variables `VITE_SUPABASE_URL` dan
   `VITE_SUPABASE_ANON_KEY` di Vercel project settings.
5. Deploy.

## Struktur project

```
src/
├── components/     # Navbar, Footer, ThemeToggle, ProtectedRoute
├── contexts/        # AuthContext (Supabase auth)
├── lib/              # Supabase client
├── pages/            # Semua halaman publik + Profile
│   └── admin/         # Dashboard admin (Overview, Reports, Comments, Users)
├── App.jsx            # Routing
├── main.jsx          # Entry point
└── index.css          # Tailwind + design tokens
supabase/
└── schema.sql          # Tabel, trigger, RLS, storage policy
```

## Catatan tentang "laporan anonim"

Laporan anonim (`is_anonymous`) disembunyikan dari tampilan komunitas/publik,
tapi `user_id` tetap tersimpan di database (hanya admin yang punya akses lewat
RLS) supaya status laporan masih bisa dipantau pelapornya di halaman Profile.
Anonimitas penuh terhadap admin butuh arsitektur tambahan (mis. proxy identitas)
di luar cakupan project ini.

## Dibuat oleh

Nizam Makbullah Shihab
