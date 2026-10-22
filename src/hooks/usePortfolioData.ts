import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import type { ProfileConfig, Project, Certificate, Experience } from '../types';
import { mockProfile, mockProjects, mockCertificates, mockExperiences } from '../lib/mockData';

export const useProfile = () => {
  return useQuery<ProfileConfig>({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('Memuat profil cadangan karena kueri Supabase:', error.message);
        return mockProfile;
      }

      return data || mockProfile;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useProjects = () => {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Memuat proyek cadangan karena kueri Supabase:', error.message);
        return mockProjects;
      }

      return data && data.length > 0 ? data : mockProjects;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useCertificates = () => {
  return useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Memuat sertifikat cadangan karena kueri Supabase:', error.message);
        return mockCertificates;
      }

      return data && data.length > 0 ? data : mockCertificates;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useExperiences = () => {
  return useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('experiences')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Memuat pengalaman cadangan karena kueri Supabase:', error.message);
        return mockExperiences;
      }

      return data && data.length > 0 ? data : mockExperiences;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const usePortfolioData = () => {
  const profileQuery = useProfile();
  const projectsQuery = useProjects();
  const certificatesQuery = useCertificates();
  const experiencesQuery = useExperiences();

  const isLoading =
    profileQuery.isLoading ||
    projectsQuery.isLoading ||
    certificatesQuery.isLoading ||
    experiencesQuery.isLoading;

  return {
    profile: profileQuery.data ?? mockProfile,
    projects: projectsQuery.data ?? mockProjects,
    certificates: certificatesQuery.data ?? mockCertificates,
    experiences: experiencesQuery.data ?? mockExperiences,
    isLoading,
    refetchAll: () => {
      profileQuery.refetch();
      projectsQuery.refetch();
      certificatesQuery.refetch();
      experiencesQuery.refetch();
    },
  };
};
