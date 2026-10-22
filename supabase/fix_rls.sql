-- ==============================================================================
-- SQL FIX: UPDATE ROW LEVEL SECURITY (RLS) & STORAGE UNTUK UID ADMIN
-- Jalankan skrip ini sekali di menu SQL Editor pada Dashboard Supabase Anda!
-- ==============================================================================

-- 1. PASTIKAN RLS AKTIF PADA SEMUA TABEL
ALTER TABLE public.profile_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 2. HAPUS KEBIJAKAN LAMA (AGAR TIDAK TERKUNCI OLEH UUID PLACEHOLDER SEBELUMNYA)
DROP POLICY IF EXISTS "Public can view profile" ON public.profile_config;
DROP POLICY IF EXISTS "Only Single Admin can mutate profile" ON public.profile_config;

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
DROP POLICY IF EXISTS "Only Single Admin can mutate projects" ON public.projects;

DROP POLICY IF EXISTS "Public can view certificates" ON public.certificates;
DROP POLICY IF EXISTS "Only Single Admin can mutate certificates" ON public.certificates;

DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
DROP POLICY IF EXISTS "Only Single Admin can mutate experiences" ON public.experiences;

-- 3. KEBIJAKAN BACA UNTUK PUBLIK (READ-ONLY)
CREATE POLICY "Public can view profile" ON public.profile_config
    FOR SELECT USING (true);

CREATE POLICY "Public can view projects" ON public.projects
    FOR SELECT USING (true);

CREATE POLICY "Public can view certificates" ON public.certificates
    FOR SELECT USING (true);

CREATE POLICY "Public can view experiences" ON public.experiences
    FOR SELECT USING (true);

-- 4. KEBIJAKAN MUTASI HANYA UNTUK UID ADMIN: fabc1886-d4d1-470d-bc54-888ecb83e99b
CREATE POLICY "Only Single Admin can mutate profile" ON public.profile_config
    FOR ALL TO authenticated
    USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

CREATE POLICY "Only Single Admin can mutate projects" ON public.projects
    FOR ALL TO authenticated
    USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

CREATE POLICY "Only Single Admin can mutate certificates" ON public.certificates
    FOR ALL TO authenticated
    USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

CREATE POLICY "Only Single Admin can mutate experiences" ON public.experiences
    FOR ALL TO authenticated
    USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

-- 5. PERBARUI KEBIJAKAN SUPABASE STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('documents', 'documents', true, 5242880, ARRAY['application/pdf']),
    ('portfolio-media', 'portfolio-media', true, 10485760, ARRAY['image/webp', 'image/png', 'image/jpeg', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Hapus kebijakan storage lama
DROP POLICY IF EXISTS "Public Read Documents" ON storage.objects;
DROP POLICY IF EXISTS "Public Read Portfolio Media" ON storage.objects;
DROP POLICY IF EXISTS "Admin All Documents" ON storage.objects;
DROP POLICY IF EXISTS "Admin All Portfolio Media" ON storage.objects;

-- Buat kebijakan storage baru dengan UID Admin Anda
CREATE POLICY "Public Read Documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Public Read Portfolio Media" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio-media');

CREATE POLICY "Admin All Documents" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'documents' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (bucket_id = 'documents' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

CREATE POLICY "Admin All Portfolio Media" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'portfolio-media' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (bucket_id = 'portfolio-media' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);
