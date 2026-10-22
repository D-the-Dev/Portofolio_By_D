# 🌐 Web Portofolio Single-Admin (Cyber Emerald Dark)

Aplikasi Web Portofolio Pribadi modern berarsitektur **Serverless** dengan integrasi langsung **Supabase** (PostgreSQL, Auth JWT, Storage Buckets) dan proteksi ketat **PostgreSQL Row Level Security (RLS)** untuk satu akun Single-Admin.

Tema visual mengusung estetika **Cyber Emerald Dark / Matrix**:
- **Primary Background**: Hitam Obsidian Deep (`#050505` / `bg-[#050505]`)
- **Surface / Card Background**: Surface Slate (`#0F1412` / `bg-[#0F1412]/90`)
- **Primary Emerald Accent**: Hijau Emerald (`#10B981` / `bg-emerald-500 text-black`)
- **Secondary Neon Accent**: Hijau Neon (`#34D399` / `text-emerald-400`)
- **Subtle Card Border**: Obsidian Border (`#1F2924`, transisi ke `#10B981` saat hover)
- **Typography**: Plus Jakarta Sans (Headings & Body), JetBrains Mono (Tech Stack, Angka, Tanggal, Slug)

---

## 🛠️ Tech Stack & Spesifikasi

| Komponen | Pilihan Teknologi | Deskripsi Implementasi |
|---|---|---|
| **Frontend Framework** | React.js 18 + Vite + TypeScript | Type-safe entities, modular components, instant HMR |
| **Styling & Animasi** | Tailwind CSS + Framer Motion | Cyber emerald theme, dot-matrix radial glow, bento grid, smooth modals |
| **Routing** | React Router DOM v6 | Public (`/`), Hidden Auth (`/login`), Protected Admin (`/admin/dashboard`) |
| **Backend & Database** | Supabase (PostgreSQL) | Menyimpan profile, projects, certificates, dan experiences |
| **File Storage** | Supabase Storage | 2 Buckets: `documents` (PDF CV maks 5MB) dan `portfolio-media` (thumbnails & sertifikat) |
| **Authentication** | Supabase Auth (JWT) | Validasi sesi tunggal email & kata sandi dengan verifikasi token JWT |
| **Data Fetching & Cache** | TanStack Query (React Query) | Caching instan publik dan auto-invalidation kueri setiap mutasi CRUD |

---

## 📂 Struktur Direktori Proyek

```
src/
├── components/
│   ├── ui/                    # Komponen atomik (Button, Modal, Badge, Input, FileDropzone, Icons)
│   ├── public/                # Komponen halaman publik (Navbar, HeroBento, ProjectGrid, CertificateLightbox, ExperienceTimeline, CVViewer)
│   └── admin/                 # Komponen CRUD admin (AdminSidebar, ProfileCVManager, ProjectFormModal, CertificateFormModal, ExperienceFormModal)
├── context/
│   └── AuthContext.tsx        # Provider autentikasi Supabase & guard VITE_ADMIN_UID
├── hooks/
│   ├── usePortfolioData.ts    # TanStack Query custom hooks untuk publik
│   └── useAdminMutation.ts    # Custom hooks mutasi CRUD & manajemen Storage
├── lib/
│   ├── supabaseClient.ts      # Client Supabase & pendeteksi konfigurasi .env
│   └── mockData.ts            # Fallback data awal siap pakai
├── pages/
│   ├── Home.tsx               # Halaman portofolio publik utama
│   ├── Login.tsx              # Portal login tersembunyi Single-Admin
│   └── Dashboard.tsx          # Panel kendali CRUD terpadu berbasis tab
├── types/
│   └── index.ts               # Definisi strict TypeScript interface
└── App.tsx                    # Rute publik & AdminProtectedRoute Guard
```

---

## 🔐 Keamanan & Panduan Row Level Security (RLS)

### 1. Prinsip Zero-Trust Frontend
Penyembunyian tombol di UI React hanyalah kenyamanan visual. Keamanan data yang sebenarnya dijamin oleh kebijakan **Row Level Security (RLS)** pada level PostgreSQL di mana mutasi (`INSERT`, `UPDATE`, `DELETE`) hanya diizinkan untuk satu `auth.uid()` admin.

### 2. File Skema SQL
File DDL & aturan RLS lengkap telah tersedia di file:
👉 **[`supabase/schema.sql`](./supabase/schema.sql)**

### 3. Langkah Menghubungkan Supabase:
1. Buka dashboard proyek Anda di [supabase.com](https://supabase.com).
2. Buat akun admin di menu **Authentication > Users** (klik *Add User > Create user*). Salin **User UID** akun tersebut.
3. Masuk ke **Authentication > Providers > Email**, lalu **matikan** opsi *"Allow new users to sign up"* (sesuai spesifikasi Single-Admin).
4. Buka menu **SQL Editor**, buka file `supabase/schema.sql`, ganti `'00000000-0000-0000-0000-000000000000'` dengan UID admin Anda, lalu klik **Run**.
5. Buka berkas `.env` pada proyek ini, isi dengan kredensial Supabase Anda:
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_ADMIN_UID=your-actual-admin-uuid-here
   ```

---

## 🚀 Menjalankan Aplikasi

### Development Mode:
```bash
npm run dev
```
Buka browser di `http://localhost:5173`.

### Production Build:
```bash
npm run build
npm run preview
```

### Deployment ke Vercel:
1. Hubungkan repository GitHub ini ke [Vercel](https://vercel.com).
2. Tambahkan **Environment Variables** di dashboard Vercel:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_UID`
3. Vercel akan otomatis mendeteksi pengaturan Vite dan file `vercel.json` untuk SPA routing. Klik **Deploy**.
