-- ==============================================================================
-- RANCANGAN TEKNIS WEB PORTOFOLIO SINGLE-ADMIN (SUPABASE DATABASE & STORAGE SCHEMA)
-- Tema: Cyber Emerald Dark
-- ==============================================================================

-- 1. TABEL: profile_config (Single Row)
CREATE TABLE IF NOT EXISTS public.profile_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    headline VARCHAR(255) NOT NULL,
    bio TEXT NOT NULL,
    cv_file_url TEXT,
    cv_updated_at TIMESTAMPTZ DEFAULT NOW(),
    social_links JSONB DEFAULT '{"github": "", "linkedin": "", "email": "", "twitter": ""}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL: projects (Daftar Proyek)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL DEFAULT '{}',
    thumbnail_url TEXT NOT NULL,
    demo_url TEXT,
    repo_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL: certificates (Sertifikat)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date VARCHAR(100),
    file_url TEXT,
    credential_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL: experiences (Rekam Jejak)
CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    period VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- UID Admin: fabc1886-d4d1-470d-bc54-888ecb83e99b
-- ==============================================================================

-- Aktifkan RLS pada seluruh tabel
ALTER TABLE public.profile_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;

-- 1. Kebijakan Publik (Read-Only)
DROP POLICY IF EXISTS "Public can view profile" ON public.profile_config;
CREATE POLICY "Public can view profile" ON public.profile_config
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view certificates" ON public.certificates;
CREATE POLICY "Public can view certificates" ON public.certificates
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public can view experiences" ON public.experiences;
CREATE POLICY "Public can view experiences" ON public.experiences
    FOR SELECT USING (true);

-- 2. Kebijakan Single-Admin (Full Mutation INSERT, UPDATE, DELETE)
DO $$
BEGIN
    -- Profile Config Admin Policy
    DROP POLICY IF EXISTS "Only Single Admin can mutate profile" ON public.profile_config;
    CREATE POLICY "Only Single Admin can mutate profile" ON public.profile_config
        FOR ALL TO authenticated
        USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
        WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

    -- Projects Admin Policy
    DROP POLICY IF EXISTS "Only Single Admin can mutate projects" ON public.projects;
    CREATE POLICY "Only Single Admin can mutate projects" ON public.projects
        FOR ALL TO authenticated
        USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
        WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

    -- Certificates Admin Policy
    DROP POLICY IF EXISTS "Only Single Admin can mutate certificates" ON public.certificates;
    CREATE POLICY "Only Single Admin can mutate certificates" ON public.certificates
        FOR ALL TO authenticated
        USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
        WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

    -- Experiences Admin Policy
    DROP POLICY IF EXISTS "Only Single Admin can mutate experiences" ON public.experiences;
    CREATE POLICY "Only Single Admin can mutate experiences" ON public.experiences
        FOR ALL TO authenticated
        USING (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
        WITH CHECK (auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);
END $$;

-- ==============================================================================
-- STORAGE BUCKETS & POLICIES
-- Bucket: 'documents' (CV pdf maks 5MB)
-- Bucket: 'portfolio-media' (WebP/PNG/JPG thumbnails & sertifikat)
-- ==============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('documents', 'documents', true, 5242880, ARRAY['application/pdf']),
    ('portfolio-media', 'portfolio-media', true, 10485760, ARRAY['image/webp', 'image/png', 'image/jpeg', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies: Public Read
CREATE POLICY "Public Read Documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Public Read Portfolio Media" ON storage.objects
    FOR SELECT USING (bucket_id = 'portfolio-media');

-- Storage Policies: Admin Insert/Update/Delete
CREATE POLICY "Admin All Documents" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'documents' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (bucket_id = 'documents' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

CREATE POLICY "Admin All Portfolio Media" ON storage.objects
    FOR ALL TO authenticated
    USING (bucket_id = 'portfolio-media' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid)
    WITH CHECK (bucket_id = 'portfolio-media' AND auth.uid() = 'fabc1886-d4d1-470d-bc54-888ecb83e99b'::uuid);

-- ==============================================================================
-- DATA AWAL CONTOH (OPTIONAL INITIAL SEED)
-- ==============================================================================
INSERT INTO public.profile_config (id, full_name, headline, bio, cv_file_url, cv_updated_at, social_links)
VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Reyhan Maulana',
    'Full-Stack Developer & Cloud Systems Architect',
    'Mengembangkan aplikasi web performa tinggi dengan fokus pada arsitektur serverless, keamanan data, dan user experience modern berselera tinggi.',
    null,
    NOW(),
    '{"github": "https://github.com", "linkedin": "https://linkedin.com", "email": "admin@matrix.dev", "twitter": "https://twitter.com"}'::jsonb
) ON CONFLICT (id) DO NOTHING;
