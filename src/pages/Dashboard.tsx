import React, { useState } from 'react';
import { 
  AdminSidebar 
} from '../components/admin/AdminSidebar';
import type { AdminTab } from '../components/admin/AdminSidebar';
import { ProfileCVManager } from '../components/admin/ProfileCVManager';
import { ProjectFormModal } from '../components/admin/ProjectFormModal';
import { CertificateFormModal } from '../components/admin/CertificateFormModal';
import { ExperienceFormModal } from '../components/admin/ExperienceFormModal';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { 
  useDeleteProject, 
  useDeleteCertificate, 
  useDeleteExperience 
} from '../hooks/useAdminMutation';
import type { Project, Certificate, Experience } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Award, 
  Briefcase, 
  FolderKanban, 
  ShieldCheck, 
  Database, 
  Copy, 
  Check,
  Menu
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const { profile, projects, certificates, experiences } = usePortfolioData();

  // Modal States
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certToEdit, setCertToEdit] = useState<Certificate | null>(null);

  const [isExpModalOpen, setIsExpModalOpen] = useState(false);
  const [expToEdit, setExpToEdit] = useState<Experience | null>(null);

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Mutations
  const deleteProjectMutation = useDeleteProject();
  const deleteCertMutation = useDeleteCertificate();
  const deleteExpMutation = useDeleteExperience();

  const handleDeleteProject = async (p: Project) => {
    if (window.confirm(`Hapus proyek "${p.title}" secara permanen?`)) {
      await deleteProjectMutation.mutateAsync(p);
    }
  };

  const handleDeleteCert = async (c: Certificate) => {
    if (window.confirm(`Hapus sertifikat "${c.title}" secara permanen?`)) {
      await deleteCertMutation.mutateAsync(c);
    }
  };

  const handleDeleteExp = async (e: Experience) => {
    if (window.confirm(`Hapus riwayat "${e.role}" di "${e.organization}"?`)) {
      await deleteExpMutation.mutateAsync(e.id);
    }
  };

  const handleCopySchema = () => {
    const sqlText = `-- Supabase Schema Snippet
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view portfolio data" ON projects FOR SELECT USING (true);
CREATE POLICY "Only Single Admin can mutate data" ON projects FOR ALL TO authenticated
USING (auth.uid() = '${import.meta.env.VITE_ADMIN_UID || '00000000-0000-0000-0000-000000000000'}')
WITH CHECK (auth.uid() = '${import.meta.env.VITE_ADMIN_UID || '00000000-0000-0000-0000-000000000000'}');`;
    navigator.clipboard.writeText(sqlText);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F4F6] flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        counts={{
          projects: projects.length,
          certificates: certificates.length,
          experiences: experiences.length,
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Panel Content */}
      <main className="flex-1 p-3.5 sm:p-8 overflow-y-auto max-h-screen bg-dot-pattern">
        {/* Mobile Top Header */}
        <div className="md:hidden flex items-center justify-between pb-3 mb-3 border-b border-[#1F2924]">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="p-2 rounded-lg bg-[#0F1412] border border-[#1F2924] text-gray-300 hover:text-white"
              aria-label="Buka Menu Admin"
            >
              <Menu className="w-5 h-5 text-emerald-400" />
            </button>
            <div>
              <span className="text-xs font-mono font-bold text-gray-200">ADMIN CONSOLE</span>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                RLS PROTECTED
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'projects' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setProjectToEdit(null);
                  setIsProjectModalOpen(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs py-1 px-2.5"
              >
                + Proyek
              </Button>
            )}
            {activeTab === 'certificates' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCertToEdit(null);
                  setIsCertModalOpen(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs py-1 px-2.5"
              >
                + Sertifikat
              </Button>
            )}
            {activeTab === 'experiences' && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setExpToEdit(null);
                  setIsExpModalOpen(true);
                }}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                className="text-xs py-1 px-2.5"
              >
                + Pengalaman
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Horizontal Quick Tab Bar */}
        <div className="md:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 -mx-3.5 px-3.5 border-b border-[#1F2924]/60 no-scrollbar">
          {[
            { id: 'overview' as AdminTab, label: 'Overview' },
            { id: 'projects' as AdminTab, label: `Proyek (${projects.length})` },
            { id: 'certificates' as AdminTab, label: `Sertifikat (${certificates.length})` },
            { id: 'experiences' as AdminTab, label: `Pengalaman (${experiences.length})` },
            { id: 'profile' as AdminTab, label: 'Profil & CV' },
            { id: 'database' as AdminTab, label: 'Supabase RLS' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                activeTab === tab.id
                  ? 'bg-emerald-500 text-black font-semibold'
                  : 'bg-[#0F1412] text-gray-400 border border-[#1F2924]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
          {/* Desktop Header Bar */}
          <div className="hidden md:flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#1F2924] gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                  SINGLE_ADMIN_WORKSPACE // RLS PROTECTED
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#F3F4F6]">
                {activeTab === 'overview' && 'Ringkasan & Metrik Sistem'}
                {activeTab === 'projects' && 'Manajemen Proyek Portofolio'}
                {activeTab === 'certificates' && 'Manajemen Sertifikasi & Kredensial'}
                {activeTab === 'experiences' && 'Manajemen Rekam Jejak Pengalaman'}
                {activeTab === 'profile' && 'Konfigurasi Profil & Dokumen CV'}
                {activeTab === 'database' && 'Arsitektur Keamanan Supabase RLS'}
              </h1>
            </div>

            {/* Quick action buttons depending on active tab */}
            <div className="flex items-center gap-2">
              {activeTab === 'projects' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setProjectToEdit(null);
                    setIsProjectModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Tambah Proyek
                </Button>
              )}
              {activeTab === 'certificates' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setCertToEdit(null);
                    setIsCertModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Tambah Sertifikat
                </Button>
              )}
              {activeTab === 'experiences' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setExpToEdit(null);
                    setIsExpModalOpen(true);
                  }}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Tambah Pengalaman
                </Button>
              )}
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
                <div className="p-3.5 sm:p-5 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
                  <div className="flex items-center justify-between text-gray-400 mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs font-mono">TOTAL PROYEK</span>
                    <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                    {projects.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-gray-500 mt-1 truncate">
                    {projects.filter((p) => p.is_featured).length} unggulan
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
                  <div className="flex items-center justify-between text-gray-400 mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs font-mono">SERTIFIKASI</span>
                    <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                    {certificates.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-gray-500 mt-1 truncate">
                    Kredensial resmi
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
                  <div className="flex items-center justify-between text-gray-400 mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs font-mono">PENGALAMAN</span>
                    <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                    {experiences.length}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-gray-500 mt-1 truncate">
                    Rekam jejak karier
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
                  <div className="flex items-center justify-between text-gray-400 mb-1.5 sm:mb-2">
                    <span className="text-[10px] sm:text-xs font-mono">STATUS CV</span>
                    <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                  </div>
                  <div className="text-base sm:text-lg font-bold font-mono text-emerald-400 truncate">
                    {profile.cv_file_url ? 'PDF ADA' : 'KOSONG'}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-mono text-gray-500 mt-1 truncate">
                    {profile.cv_updated_at ? 'Telah diunggah' : 'Belum diunggah'}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Items */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Projects Card */}
                <div className="p-6 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold font-mono text-[#F3F4F6] flex items-center gap-2">
                      <FolderKanban className="w-4 h-4 text-emerald-400" /> Proyek Terbaru
                    </h3>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="text-xs font-mono text-emerald-400 hover:underline"
                    >
                      Kelola Semua &rarr;
                    </button>
                  </div>
                  <div className="space-y-3">
                    {projects.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#050505] border border-[#1F2924]"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.thumbnail_url}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-[#1F2924]"
                          />
                          <div>
                            <div className="text-xs font-bold text-gray-200">{p.title}</div>
                            <div className="text-[10px] font-mono text-gray-500">{p.slug}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {p.is_featured && <Badge variant="emerald" size="sm">STAR</Badge>}
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setProjectToEdit(p);
                              setIsProjectModalOpen(true);
                            }}
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* System Architecture Info */}
                <div className="p-6 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold font-mono text-[#F3F4F6] flex items-center gap-2 mb-4">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Spesifikasi Keamanan & Konvensi
                    </h3>
                    <ul className="space-y-2.5 text-xs text-gray-400 font-mono">
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                        <span>Frontend Zero-Trust: Tombol CRUD diproteksi ganda via PostgreSQL RLS.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                        <span>Single-Admin Auth: Validasi ketat token JWT & UUID <code>VITE_ADMIN_UID</code>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                        <span>Storage Buckets: <code>documents</code> (maks 5MB) & <code>portfolio-media</code>.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">&#10003;</span>
                        <span>TanStack Query auto-invalidation: Cache kueri diperbarui otomatis setiap mutasi.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#1F2924] flex items-center justify-between">
                    <span className="text-xs font-mono text-gray-500">Skema SQL Lengkap Tersedia</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab('database')}
                      leftIcon={<Database className="w-3.5 h-3.5" />}
                    >
                      Buka Skema SQL
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
                  <table className="w-full text-left border-collapse text-xs min-w-[580px]">
                    <thead>
                      <tr className="border-b border-[#1F2924] bg-[#050505] font-mono text-gray-400">
                        <th className="p-4">THUMBNAIL & JUDUL</th>
                        <th className="p-4">SLUG</th>
                        <th className="p-4">TECH STACK</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2924]">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.thumbnail_url}
                                alt={p.title}
                                className="w-12 h-12 rounded object-cover border border-[#1F2924] shrink-0"
                              />
                              <div>
                                <span className="font-bold text-gray-100">{p.title}</span>
                                <div className="text-[11px] text-gray-500 line-clamp-1 max-w-xs">
                                  {p.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 font-mono text-gray-400">{p.slug}</td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {p.tech_stack?.slice(0, 3).map((t) => (
                                <Badge key={t} variant="cyber" size="sm">{t}</Badge>
                              ))}
                              {(p.tech_stack?.length || 0) > 3 && (
                                <Badge variant="muted" size="sm">+{p.tech_stack.length - 3}</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {p.is_featured ? (
                              <Badge variant="emerald" size="sm">UNGGULAN</Badge>
                            ) : (
                              <Badge variant="muted" size="sm">STANDAR</Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setProjectToEdit(p);
                                  setIsProjectModalOpen(true);
                                }}
                                title="Ubah Proyek"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteProject(p)}
                                title="Hapus Proyek"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CERTIFICATES */}
          {activeTab === 'certificates' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
                  <table className="w-full text-left border-collapse text-xs min-w-[550px]">
                    <thead>
                      <tr className="border-b border-[#1F2924] bg-[#050505] font-mono text-gray-400">
                        <th className="p-4">NAMA SERTIFIKAT</th>
                        <th className="p-4">LEMBAGA PENERBIT</th>
                        <th className="p-4">TAHUN / MASA BERLAKU</th>
                        <th className="p-4">BERKAS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2924]">
                      {certificates.map((c) => (
                        <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-bold text-gray-100">{c.title}</td>
                          <td className="p-4 font-mono text-emerald-400">{c.issuer}</td>
                          <td className="p-4 font-mono text-gray-400">{c.issue_date || '-'}</td>
                          <td className="p-4">
                            {c.file_url ? (
                              <a
                                href={c.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                              >
                                <ExternalLink className="w-3 h-3" /> Berkas
                              </a>
                            ) : (
                              <span className="text-gray-500 font-mono">-</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setCertToEdit(c);
                                  setIsCertModalOpen(true);
                                }}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteCert(c)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIENCES */}
          {activeTab === 'experiences' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md overflow-hidden">
                <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
                  <table className="w-full text-left border-collapse text-xs min-w-[550px]">
                    <thead>
                      <tr className="border-b border-[#1F2924] bg-[#050505] font-mono text-gray-400">
                        <th className="p-4">JABATAN / PERAN</th>
                        <th className="p-4">INSTANSI / KAMPUS</th>
                        <th className="p-4">PERIODE</th>
                        <th className="p-4">STATUS</th>
                        <th className="p-4 text-right">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1F2924]">
                      {experiences.map((exp) => (
                        <tr key={exp.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="p-4 font-bold text-gray-100">{exp.role}</td>
                          <td className="p-4 font-mono text-emerald-400">{exp.organization}</td>
                          <td className="p-4 font-mono text-gray-400">{exp.period}</td>
                          <td className="p-4">
                            {exp.is_current ? (
                              <Badge variant="emerald" size="sm">AKTIF</Badge>
                            ) : (
                              <Badge variant="muted" size="sm">SELESAI</Badge>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                  setExpToEdit(exp);
                                  setIsExpModalOpen(true);
                                }}
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDeleteExp(exp)}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & CV */}
          {activeTab === 'profile' && (
            <ProfileCVManager initialProfile={profile} />
          )}

          {/* TAB 6: DATABASE & RLS GUIDE */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="p-6 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-[#1F2924] mb-4">
                  <div>
                    <h3 className="text-base font-bold font-mono text-[#F3F4F6] flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-400" />
                      PANDUAN MIGRASI SUPABASE & ROW LEVEL SECURITY (RLS)
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      File SQL lengkap telah disediakan pada direktori proyek di: <code className="text-emerald-400">supabase/schema.sql</code>.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopySchema}
                    leftIcon={copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  >
                    {copiedSchema ? 'Tersalin!' : 'Salin Snippet RLS'}
                  </Button>
                </div>

                <div className="space-y-4 text-xs font-mono text-gray-300">
                  <div className="p-4 rounded-lg bg-[#050505] border border-[#1F2924] space-y-2">
                    <p className="text-emerald-400 font-bold">LANGKAH-LANGKAH AKTIVASI BASIS DATA SUPABASE:</p>
                    <ol className="list-decimal pl-5 space-y-1.5 text-gray-400">
                      <li>Buka dashboard proyek Anda di <strong className="text-gray-200">supabase.com</strong>.</li>
                      <li>Masuk ke menu <strong className="text-gray-200">SQL Editor</strong> lalu buat query baru.</li>
                      <li>Buka file <strong className="text-emerald-400">supabase/schema.sql</strong> yang ada di proyek ini, lalu salin dan jalankan (Run).</li>
                      <li>Ganti nilai <code className="text-emerald-400">'00000000-0000-0000-0000-000000000000'</code> dengan UUID akun admin yang Anda buat di menu <em>Authentication &gt; Users</em>.</li>
                      <li>Pastikan opsi <strong>"Allow new users to sign up"</strong> dinonaktifkan di <em>Authentication &gt; Providers &gt; Email</em>.</li>
                      <li>Masukkan <code className="text-emerald-400">VITE_SUPABASE_URL</code>, <code className="text-emerald-400">VITE_SUPABASE_ANON_KEY</code>, dan <code className="text-emerald-400">VITE_ADMIN_UID</code> ke dalam berkas <strong className="text-gray-200">.env</strong> Anda.</li>
                    </ol>
                  </div>

                  <div className="p-4 rounded-lg bg-[#050505] border border-[#1F2924]">
                    <div className="text-gray-400 mb-2 font-bold">KONFIGURASI ENVIRONMENT VARIABLES SAAT INI:</div>
                    <div className="space-y-1 text-gray-300">
                      <div>VITE_SUPABASE_URL: <span className="text-emerald-400">{import.meta.env.VITE_SUPABASE_URL || 'Belum Disetel'}</span></div>
                      <div>VITE_ADMIN_UID: <span className="text-emerald-400">{import.meta.env.VITE_ADMIN_UID || 'Belum Disetel'}</span></div>
                      <div>STATUS KONEKSI: <span className="text-emerald-400 font-bold">TERHUBUNG KE SUPABASE LIVE (POSTGRESQL & RLS)</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Project Form Modal */}
      <ProjectFormModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      {/* Certificate Form Modal */}
      <CertificateFormModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        certToEdit={certToEdit}
      />

      {/* Experience Form Modal */}
      <ExperienceFormModal
        isOpen={isExpModalOpen}
        onClose={() => setIsExpModalOpen(false)}
        expToEdit={expToEdit}
      />
    </div>
  );
};
