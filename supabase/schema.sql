-- =========================================================
-- LaporAman — Supabase schema, triggers & RLS policies
-- Jalankan file ini di Supabase Dashboard > SQL Editor
-- (atau: supabase db push jika pakai Supabase CLI)
-- =========================================================

-- Ekstensi yang dibutuhkan untuk gen_random_uuid()
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------
-- 1. PROFILES
-- Baris profil 1-1 dengan auth.users, dibuat otomatis lewat trigger
-- ---------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nama text not null,
  username text unique not null,
  avatar_url text,
  role text not null default 'user' check (role in ('user','admin')),
  status text not null default 'active' check (status in ('active','suspended')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: cek apakah user yang sedang login adalah admin.
-- security definer supaya tidak memicu rekursi RLS saat dipanggil dari policy profiles.
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Publik (termasuk yang belum login) boleh baca profil dasar — dipakai untuk
-- menampilkan nama & foto profil di komentar komunitas yang bersifat publik.
create policy "profiles_select_public"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_update_admin"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (true);

-- Trigger: setiap kali ada user baru di auth.users, buat baris profiles otomatis
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, nama, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nama', 'Pengguna Baru'),
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------
-- 2. REPORTS
-- ---------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  report_code text unique not null default ('LA-' || upper(substr(md5(random()::text), 1, 6))),
  user_id uuid references auth.users(id) on delete set null,
  jenis text not null check (jenis in ('Verbal','Fisik','Sosial/Relasional','Cyberbullying')),
  tanggal date not null,
  lokasi text,
  kronologi text not null,
  masih_berlangsung boolean not null default false,
  ada_saksi boolean not null default false,
  bukti_url text,
  is_anonymous boolean not null default false,
  status text not null default 'Received' check (status in ('Received','Reviewing','Follow-up','Resolved')),
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "reports_insert_own"
  on public.reports for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "reports_select_own"
  on public.reports for select
  to authenticated
  using (user_id = auth.uid());

create policy "reports_select_admin"
  on public.reports for select
  to authenticated
  using (public.is_admin());

create policy "reports_update_admin"
  on public.reports for update
  to authenticated
  using (public.is_admin())
  with check (true);

-- Catatan internal admin per laporan (status history + note)
create table if not exists public.report_updates (
  id uuid primary key default gen_random_uuid(),
  report_id uuid not null references public.reports(id) on delete cascade,
  status text not null,
  note text,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

alter table public.report_updates enable row level security;

create policy "report_updates_admin_all"
  on public.report_updates for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------
-- 3. COMMUNITY: comments, likes, reports-on-comments
-- ---------------------------------------------------------
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 1000),
  likes_count int not null default 0,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.comments enable row level security;

-- anon (belum login) hanya kebagian hidden=false; authenticated juga bisa lihat
-- punya sendiri yang sedang disembunyikan, dan admin bisa lihat semua.
create policy "comments_select_visible"
  on public.comments for select
  to anon, authenticated
  using (hidden = false or user_id = auth.uid() or public.is_admin());

create policy "comments_insert_own"
  on public.comments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "comments_delete_own_or_admin"
  on public.comments for delete
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

create policy "comments_update_admin"
  on public.comments for update
  to authenticated
  using (public.is_admin())
  with check (true);

create table if not exists public.comment_likes (
  comment_id uuid not null references public.comments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (comment_id, user_id)
);

alter table public.comment_likes enable row level security;

create policy "comment_likes_select_all"
  on public.comment_likes for select
  to authenticated
  using (true);

create policy "comment_likes_insert_own"
  on public.comment_likes for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "comment_likes_delete_own"
  on public.comment_likes for delete
  to authenticated
  using (user_id = auth.uid());

-- Jaga likes_count tetap sinkron otomatis via trigger
create or replace function public.sync_comment_likes_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (tg_op = 'INSERT') then
    update public.comments set likes_count = likes_count + 1 where id = new.comment_id;
  elsif (tg_op = 'DELETE') then
    update public.comments set likes_count = greatest(likes_count - 1, 0) where id = old.comment_id;
  end if;
  return null;
end;
$$;

drop trigger if exists on_comment_like_change on public.comment_likes;
create trigger on_comment_like_change
  after insert or delete on public.comment_likes
  for each row execute function public.sync_comment_likes_count();

create table if not exists public.comment_reports (
  id uuid primary key default gen_random_uuid(),
  comment_id uuid not null references public.comments(id) on delete cascade,
  reported_by uuid not null references auth.users(id) on delete cascade,
  reason text,
  created_at timestamptz not null default now(),
  unique (comment_id, reported_by)
);

alter table public.comment_reports enable row level security;

create policy "comment_reports_insert_own"
  on public.comment_reports for insert
  to authenticated
  with check (reported_by = auth.uid());

create policy "comment_reports_select_admin"
  on public.comment_reports for select
  to authenticated
  using (public.is_admin());

-- ---------------------------------------------------------
-- 4. NOTIFICATIONS (opsional, siap dipakai)
-- ---------------------------------------------------------
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ---------------------------------------------------------
-- 5. STORAGE: bucket untuk bukti laporan & foto profil
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('report-evidence', 'report-evidence', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "report_evidence_insert_own"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'report-evidence' and owner = auth.uid());

create policy "report_evidence_select_own_or_admin"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'report-evidence' and (owner = auth.uid() or public.is_admin()));

create policy "avatars_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars' and owner = auth.uid());

-- ---------------------------------------------------------
-- 6. SEED: jadikan satu akun sebagai admin (jalankan manual)
-- Ganti email di bawah dengan akun yang sudah kamu daftarkan lewat /register,
-- lalu jalankan baris ini sendiri setelah akun tsb ada di auth.users.
-- ---------------------------------------------------------
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'admin@contoh.com');

-- ---------------------------------------------------------
-- 7. MIGRASI (jalankan baris ini SAJA kalau schema versi lama
-- sudah pernah di-apply sebelum policy publik di atas ditambahkan)
-- ---------------------------------------------------------
-- drop policy if exists "profiles_select_all_authenticated" on public.profiles;
-- create policy "profiles_select_public" on public.profiles
--   for select to anon, authenticated using (true);
-- drop policy if exists "comments_select_visible" on public.comments;
-- create policy "comments_select_visible" on public.comments
--   for select to anon, authenticated
--   using (hidden = false or user_id = auth.uid() or public.is_admin());
