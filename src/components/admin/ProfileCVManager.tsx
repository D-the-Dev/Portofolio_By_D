import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';
import type { ProfileConfig } from '../../types';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { FileDropzone } from '../ui/FileDropzone';
import { useUpdateProfile, uploadStorageFile, deleteStorageFile } from '../../hooks/useAdminMutation';

interface ProfileCVManagerProps {
  initialProfile: ProfileConfig;
}

export const ProfileCVManager: React.FC<ProfileCVManagerProps> = ({ initialProfile }) => {
  const [fullName, setFullName] = useState(initialProfile.full_name || '');
  const [headline, setHeadline] = useState(initialProfile.headline || '');
  const [bio, setBio] = useState(initialProfile.bio || '');
  const [github, setGithub] = useState(initialProfile.social_links?.github || '');
  const [linkedin, setLinkedin] = useState(initialProfile.social_links?.linkedin || '');
  const [email, setEmail] = useState(initialProfile.social_links?.email || '');
  const [twitter, setTwitter] = useState(initialProfile.social_links?.twitter || '');

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [currentCvUrl, setCurrentCvUrl] = useState<string | null>(initialProfile.cv_file_url || null);

  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const updateProfileMutation = useUpdateProfile();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('idle');
    setErrorMessage(null);

    try {
      let finalCvUrl = currentCvUrl;

      // Unggah CV jika ada file baru dipilih
      if (cvFile) {
        if (currentCvUrl) {
          await deleteStorageFile('documents', currentCvUrl);
        }
        finalCvUrl = await uploadStorageFile('documents', cvFile, 'cv');
        setCurrentCvUrl(finalCvUrl);
      }

      await updateProfileMutation.mutateAsync({
        full_name: fullName,
        headline,
        bio,
        cv_file_url: finalCvUrl,
        cv_updated_at: new Date().toISOString(),
        social_links: {
          github,
          linkedin,
          email,
          twitter,
        },
      });

      setCvFile(null);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 4000);
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage((err as Error).message || 'Gagal menyimpan profil.');
      setSaveStatus('error');
    }
  };

  const handleRemoveCv = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus berkas CV aktif?')) {
      if (currentCvUrl) {
        await deleteStorageFile('documents', currentCvUrl);
      }
      setCurrentCvUrl(null);
      setCvFile(null);
      await updateProfileMutation.mutateAsync({
        cv_file_url: null,
        cv_updated_at: null,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 sm:p-6 rounded-xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#1F2924] mb-6 gap-2">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-[#F3F4F6] font-mono">
              MANAJEMEN PROFIL & DOKUMEN CV
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Kelola informasi profil utama, tautan jejaring, dan dokumen Curriculum Vitae resmi.
            </p>
          </div>
          {saveStatus === 'success' && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/30 self-start sm:self-auto">
              <CheckCircle2 className="w-4 h-4" />
              Perubahan Berhasil Disimpan
            </div>
          )}
        </div>

        {errorMessage && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-5">
          {/* Baris Nama & Headline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="NAMA LENGKAP"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Contoh: Reyhan Maulana"
            />
            <Input
              label="HEADLINE / JABATAN UTAMA"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              required
              placeholder="Contoh: Full-Stack Developer & Cloud Architect"
            />
          </div>

          {/* Ringkasan Profil / Bio */}
          <Textarea
            label="BIO / RINGKASAN PROFESIONAL"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            required
            placeholder="Tuliskan spesialisasi, pengalaman kunci, dan fokus arsitektur perangkat lunak Anda..."
          />

          {/* Tautan Sosial Media (JSONB) */}
          <div className="pt-4 border-t border-[#1F2924]">
            <h4 className="text-xs font-mono font-bold text-gray-300 uppercase mb-3">
              TAUTAN JEJARING PROFESIONAL (JSONB)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="GITHUB URL"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
              />
              <Input
                label="LINKEDIN URL"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
              <Input
                label="EMAIL PROFESIONAL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@example.com"
              />
              <Input
                label="TWITTER / X URL"
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="https://twitter.com/username"
              />
            </div>
          </div>

          {/* Berkas CV Storage Bucket */}
          <div className="pt-4 border-t border-[#1F2924]">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h4 className="text-xs font-mono font-bold text-gray-300 uppercase">
                  BERKAS CV RESMI (PDF HINGGA 5MB)
                </h4>
                <p className="text-[11px] text-gray-500">
                  Disimpan langsung ke bucket privat/publik Supabase Storage <code className="text-emerald-400">documents</code>.
                </p>
              </div>
              {currentCvUrl && (
                <button
                  type="button"
                  onClick={handleRemoveCv}
                  className="text-xs font-mono text-red-400 hover:text-red-300 flex items-center gap-1 p-1 hover:bg-red-500/10 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Hapus Berkas CV
                </button>
              )}
            </div>

            <FileDropzone
              accept="application/pdf"
              maxSizeMB={5}
              currentFileUrl={currentCvUrl}
              onFileSelect={(file) => setCvFile(file)}
              onClear={() => setCvFile(null)}
              helperText="Hanya menerima berkas .pdf dengan ukuran maksimal 5MB"
            />
          </div>

          {/* Tombol Simpan */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={updateProfileMutation.isPending}
              leftIcon={<Save className="w-4 h-4" />}
              className="w-full sm:w-auto justify-center"
            >
              Simpan Perubahan Profil
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
