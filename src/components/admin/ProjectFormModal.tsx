import React, { useState, useEffect } from 'react';
import { Plus, X, Save, AlertCircle } from 'lucide-react';
import type { Project } from '../../types';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { FileDropzone } from '../ui/FileDropzone';
import { Badge } from '../ui/Badge';
import { useCreateProject, useUpdateProject, uploadStorageFile } from '../../hooks/useAdminMutation';

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState<string[]>([]);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [demoUrl, setDemoUrl] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createMutation = useCreateProject();
  const updateMutation = useUpdateProject();

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setSlug(projectToEdit.slug);
      setDescription(projectToEdit.description);
      setTechStack(projectToEdit.tech_stack || []);
      setThumbnailUrl(projectToEdit.thumbnail_url || '');
      setDemoUrl(projectToEdit.demo_url || '');
      setRepoUrl(projectToEdit.repo_url || '');
      setIsFeatured(projectToEdit.is_featured);
    } else {
      setTitle('');
      setSlug('');
      setDescription('');
      setTechStack(['React', 'TypeScript', 'Tailwind CSS']);
      setThumbnailUrl('');
      setDemoUrl('');
      setRepoUrl('');
      setIsFeatured(false);
    }
    setThumbnailFile(null);
    setErrorMessage(null);
  }, [projectToEdit, isOpen]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!projectToEdit) {
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  const handleAddTag = (e?: React.KeyboardEvent | React.MouseEvent) => {
    if (e && 'key' in e && e.key !== 'Enter') return;
    if (e) e.preventDefault();

    const trimmed = currentTagInput.trim();
    if (trimmed && !techStack.includes(trimmed)) {
      setTechStack([...techStack, trimmed]);
      setCurrentTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      let finalThumbnailUrl = thumbnailUrl;

      if (thumbnailFile) {
        finalThumbnailUrl = await uploadStorageFile('portfolio-media', thumbnailFile, 'projects');
      }

      if (!finalThumbnailUrl) {
        throw new Error('Mohon pilih berkas gambar atau masukkan URL thumbnail proyek.');
      }

      if (projectToEdit) {
        await updateMutation.mutateAsync({
          id: projectToEdit.id,
          title,
          slug,
          description,
          tech_stack: techStack,
          thumbnail_url: finalThumbnailUrl,
          demo_url: demoUrl || null,
          repo_url: repoUrl || null,
          is_featured: isFeatured,
        });
      } else {
        await createMutation.mutateAsync({
          title,
          slug: slug || `project-${Date.now()}`,
          description,
          tech_stack: techStack,
          thumbnail_url: finalThumbnailUrl,
          demo_url: demoUrl || null,
          repo_url: repoUrl || null,
          is_featured: isFeatured,
        });
      }

      onClose();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage((err as Error).message || 'Gagal menyimpan proyek.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Ubah Data Proyek' : 'Tambah Proyek Baru'}
      description="Simpan spesifikasi proyek, arsitektur teknologi, dan media ke database"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-mono text-red-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="JUDUL PROYEK"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            placeholder="Contoh: Sentinel Code Analyzer"
          />
          <Input
            label="SLUG URL (UNIQUE)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            placeholder="sentinel-code-analyzer"
          />
        </div>

        <Textarea
          label="DESKRIPSI LENGKAP & FITUR SOLUSI"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          placeholder="Jelaskan masalah yang diselesaikan, arsitektur, dan performa yang dicapai..."
        />

        {/* Tech Stack Array Tags */}
        <div className="space-y-1.5 text-left">
          <label className="block text-xs font-mono font-medium text-gray-300">
            TECH STACK TAGS (ARRAY[])
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={currentTagInput}
              onChange={(e) => setCurrentTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Ketik tag lalu tekan Enter (contoh: React, PostgreSQL)"
              className="flex-1 bg-[#050505] text-[#F3F4F6] text-sm px-3.5 py-2 rounded-lg border border-[#1F2924] outline-none focus:border-emerald-500"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddTag}
              leftIcon={<Plus className="w-3.5 h-3.5" />}
            >
              Tambah
            </Button>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1.5">
            {techStack.map((tag) => (
              <Badge key={tag} variant="cyber" size="sm" className="gap-1 pr-1.5">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400 p-0.5 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        {/* Thumbnail Image Dropzone */}
        <div>
          <FileDropzone
            label="GAMBAR THUMBNAIL (.WEBP / .PNG / .JPG)"
            accept="image/*"
            maxSizeMB={10}
            currentFileUrl={thumbnailUrl}
            onFileSelect={(file) => setThumbnailFile(file)}
            onClear={() => {
              setThumbnailFile(null);
              setThumbnailUrl('');
            }}
            helperText="Diunggah otomatis ke bucket portfolio-media"
          />
          <div className="mt-1">
            <Input
              label="ATAU MASUKKAN URL GAMBAR LANGSUNG"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            label="DEMO URL (OPSIONAL)"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://demo.example.com"
          />
          <Input
            label="REPOSITORY GITHUB URL (OPSIONAL)"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
            placeholder="https://github.com/org/repo"
          />
        </div>

        {/* Checkbox Featured */}
        <div className="flex items-center gap-2 pt-1">
          <input
            id="isFeaturedCheck"
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-[#1F2924] bg-[#050505] text-emerald-500 focus:ring-emerald-500/50"
          />
          <label htmlFor="isFeaturedCheck" className="text-xs font-mono text-gray-300 cursor-pointer">
            Tandai sebagai Proyek Unggulan (Tampil dengan badge sorotan di beranda)
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-[#1F2924]">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
            leftIcon={<Save className="w-4 h-4" />}
          >
            {projectToEdit ? 'Simpan Perubahan' : 'Buat Proyek'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
