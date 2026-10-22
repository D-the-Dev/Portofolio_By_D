import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ProfileConfig, Project, Certificate, Experience } from '../types';

// =============================================================
// STORAGE OPERATIONS (SUPABASE STORAGE)
// =============================================================
export const uploadStorageFile = async (
  bucket: 'documents' | 'portfolio-media',
  file: File,
  folder: string = ''
): Promise<string> => {
  if (bucket === 'documents' && file.size > 5 * 1024 * 1024) {
    throw new Error('Ukuran berkas CV melebihi batas maksimal 5MB.');
  }

  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const filePath = folder ? `${folder}/${Date.now()}_${cleanFileName}` : `${Date.now()}_${cleanFileName}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Gagal mengunggah berkas ke Supabase Storage: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
};

export const deleteStorageFile = async (
  bucket: 'documents' | 'portfolio-media',
  fileUrl: string
): Promise<void> => {
  if (!fileUrl) return;

  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${bucket}/`);
    if (pathParts.length > 1) {
      const filePath = decodeURIComponent(pathParts[1]);
      await supabase.storage.from(bucket).remove([filePath]);
    }
  } catch (err) {
    console.warn('Gagal menghapus berkas storage:', err);
  }
};

// =============================================================
// PROFILE MUTATIONS
// =============================================================
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updated: Partial<ProfileConfig>) => {
      // Ambil baris profil yang ada
      const { data: existingList, error: fetchErr } = await supabase
        .from('profile_config')
        .select('*')
        .limit(1);

      if (fetchErr) throw fetchErr;

      const existing = existingList && existingList.length > 0 ? existingList[0] : null;

      if (existing) {
        const { data, error } = await supabase
          .from('profile_config')
          .update({ ...updated, updated_at: new Date().toISOString() })
          .eq('id', existing.id)
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error(
            'Perubahan profil ditolak oleh Row Level Security (RLS) PostgreSQL. Pastikan skrip fix_rls.sql telah dijalankan di Supabase SQL Editor.'
          );
        }
        return data[0];
      } else {
        const { data, error } = await supabase
          .from('profile_config')
          .insert([{ ...updated, updated_at: new Date().toISOString() }])
          .select();

        if (error) throw error;
        if (!data || data.length === 0) {
          throw new Error(
            'Pembuatan profil ditolak oleh Row Level Security (RLS) PostgreSQL. Pastikan skrip fix_rls.sql telah dijalankan di Supabase SQL Editor.'
          );
        }
        return data[0];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// =============================================================
// PROJECTS MUTATIONS
// =============================================================
export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Omit<Project, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Gagal menambah proyek: Ditolak oleh Row Level Security (RLS).');
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...changes }: Partial<Project> & { id: string }) => {
      const { data, error } = await supabase
        .from('projects')
        .update(changes)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Gagal mengubah proyek: Ditolak oleh Row Level Security (RLS).');
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (project: Project) => {
      if (project.thumbnail_url) {
        await deleteStorageFile('portfolio-media', project.thumbnail_url);
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;
      return project.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

// =============================================================
// CERTIFICATES MUTATIONS
// =============================================================
export const useCreateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cert: Omit<Certificate, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('certificates')
        .insert([cert])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Gagal menambah sertifikat: Ditolak oleh Row Level Security (RLS).');
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useUpdateCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...changes }: Partial<Certificate> & { id: string }) => {
      const { data, error } = await supabase
        .from('certificates')
        .update(changes)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Gagal mengubah sertifikat: Ditolak oleh Row Level Security (RLS).');
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

export const useDeleteCertificate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cert: Certificate) => {
      if (cert.file_url) {
        await deleteStorageFile('portfolio-media', cert.file_url);
      }

      const { error } = await supabase
        .from('certificates')
        .delete()
        .eq('id', cert.id);

      if (error) throw error;
      return cert.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
};

// =============================================================
// EXPERIENCES MUTATIONS
// =============================================================
export const useCreateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (exp: Omit<Experience, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('experiences')
        .insert([exp])
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Gagal menambah pengalaman: Ditolak oleh Row Level Security (RLS).');
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
};

export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...changes }: Partial<Experience> & { id: string }) => {
      const { data, error } = await supabase
        .from('experiences')
        .update(changes)
        .eq('id', id)
        .select();

      if (error) throw error;
      if (!data || data.length === 0) {
        throw new Error('Gagal mengubah pengalaman: Ditolak oleh Row Level Security (RLS).');
      }
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
};

export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('experiences')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
};
