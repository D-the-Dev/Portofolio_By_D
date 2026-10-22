export interface SocialLinks {
  github?: string;
  linkedin?: string;
  email?: string;
  twitter?: string;
  [key: string]: string | undefined;
}

export interface ProfileConfig {
  id: string;
  full_name: string;
  headline: string;
  bio: string;
  cv_file_url: string | null;
  cv_updated_at: string | null;
  social_links: SocialLinks;
  created_at?: string;
  updated_at?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech_stack: string[];
  thumbnail_url: string;
  demo_url: string | null;
  repo_url: string | null;
  is_featured: boolean;
  created_at: string;
  updated_at?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issue_date?: string;
  file_url: string | null;
  credential_url: string | null;
  created_at?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  is_current?: boolean;
  created_at?: string;
}

export interface PortfolioData {
  profile: ProfileConfig | null;
  projects: Project[];
  certificates: Certificate[];
  experiences: Experience[];
}
