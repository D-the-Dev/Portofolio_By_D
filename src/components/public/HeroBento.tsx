import React from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Terminal,
  Cpu,
  Layers,
  ArrowUpRight,
  Mail
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { GithubIcon, LinkedinIcon, TwitterIcon } from '../ui/Icons';
import type { ProfileConfig } from '../../types';

interface HeroBentoProps {
  profile: ProfileConfig;
  projectsCount: number;
  experiencesCount: number;
  certificatesCount: number;
  onOpenCV: () => void;
}

export const HeroBento: React.FC<HeroBentoProps> = ({
  profile,
  projectsCount,
  experiencesCount,
  certificatesCount,
  onOpenCV,
}) => {
  return (
    <section id="about" className="relative pt-20 sm:pt-28 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Subtle Radial Emerald Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[650px] h-[300px] sm:h-[450px] bg-emerald-500/10 blur-[90px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5"
        >
          {/* Main Large Card: Profile Headline & Bio */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 lg:col-span-3 rounded-xl sm:rounded-2xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md p-5 sm:p-8 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300 relative group overflow-hidden"
          >
            {/* Top status bar in card */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
              <Badge variant="cyber" size="sm" icon={<Terminal className="w-3.5 h-3.5 text-emerald-400" />}>
                MAHASISWA_INFORMATIKA
              </Badge>
              <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs text-gray-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span>ABOUT ME</span>
              </div>
            </div>

            {/* Profile info */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#F3F4F6] leading-[1.15] sm:leading-[1.1]">
                Halo, Saya <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] via-[#34D399] to-emerald-200">{profile.full_name}</span>
              </h1>
              <p className="text-sm sm:text-lg md:text-xl font-medium text-emerald-400/90 font-mono">
                {profile.headline}
              </p>
              <p className="text-xs sm:text-sm md:text-base text-gray-400 leading-relaxed max-w-2xl">
                {profile.bio}
              </p>
            </div>

            {/* Actions & Social Links */}
            <div className="pt-6 sm:pt-8 mt-5 sm:mt-6 border-t border-[#1F2924] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {profile.cv_file_url && (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onOpenCV}
                    leftIcon={<Download className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    Unduh CV (PDF)
                  </Button>
                )}
                <a href="#projects" className="w-full sm:w-auto">
                  <Button
                    variant="secondary"
                    size="md"
                    rightIcon={<ArrowUpRight className="w-4 h-4 text-emerald-400" />}
                    className="w-full sm:w-auto"
                  >
                    Eksplorasi Proyek
                  </Button>
                </a>
              </div>

              {/* Social icons with touch-friendly 44px tap targets */}
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 sm:pt-0">
                {profile.social_links?.github && (
                  <a
                    href={profile.social_links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[42px] min-h-[42px] p-2.5 rounded-lg bg-[#050505] border border-[#1F2924] text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center active:scale-95 transition-all"
                    title="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.social_links?.linkedin && (
                  <a
                    href={profile.social_links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[42px] min-h-[42px] p-2.5 rounded-lg bg-[#050505] border border-[#1F2924] text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center active:scale-95 transition-all"
                    title="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.social_links?.twitter && (
                  <a
                    href={profile.social_links.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-w-[42px] min-h-[42px] p-2.5 rounded-lg bg-[#050505] border border-[#1F2924] text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center active:scale-95 transition-all"
                    title="Twitter / X"
                  >
                    <TwitterIcon className="w-4 h-4" />
                  </a>
                )}
                {profile.social_links?.email && (
                  <a
                    href={`mailto:${profile.social_links.email}`}
                    className="min-w-[42px] min-h-[42px] p-2.5 rounded-lg bg-[#050505] border border-[#1F2924] text-gray-300 hover:text-emerald-400 hover:border-emerald-500/50 flex items-center justify-center active:scale-95 transition-all"
                    title="Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>

          {/* Side Card 1: Key Metrics (Responsive 3 cols on mobile, 1 col on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl sm:rounded-2xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md p-4 sm:p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-[11px] sm:text-xs font-mono text-gray-400">TELEMETRI DATA</span>
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-1 gap-2 sm:gap-4 text-center sm:text-left">
                <div className="p-2.5 sm:p-3 rounded-lg bg-[#050505] border border-[#1F2924]">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {projectsCount}+
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-mono mt-0.5 sm:mt-1 leading-tight">Proyek</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-[#050505] border border-[#1F2924]">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {certificatesCount}+
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-mono mt-0.5 sm:mt-1 leading-tight">Sertifikat</div>
                </div>
                <div className="p-2.5 sm:p-3 rounded-lg bg-[#050505] border border-[#1F2924]">
                  <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">
                    {experiencesCount}+
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 font-mono mt-0.5 sm:mt-1 leading-tight">Karier</div>
                </div>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#1F2924] text-center">
              <span className="text-[10px] sm:text-[11px] font-mono text-gray-500">
                STACK // VITE + REACT + SUPABASE
              </span>
            </div>
          </motion.div>

          {/* Core Technology Stack (Full Width Row) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="col-span-1 md:col-span-3 lg:col-span-4 rounded-xl sm:rounded-2xl border border-[#1F2924] bg-[#0F1412]/90 backdrop-blur-md p-4 sm:p-6 hover:border-emerald-500/50 transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 mb-3 sm:mb-4 pb-2.5 sm:pb-3 border-b border-[#1F2924]">
              <h3 className="text-xs sm:text-base font-semibold text-[#F3F4F6] flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                Core Technology Stack & Keahlian Utama
              </h3>
              <span className="text-[10px] sm:text-xs font-mono text-emerald-400/80">MODERN WEB & CLOUD ECOSYSTEM</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2.5">
              {[
                'React',
                'Python',
                'PHP',
                'Bootstrap CSS',
                'CI4',
                'FastAPI',
                'MySQL',
                'UI/UX',
                'Office Administration',
                'Computer Hardware',
                'AI',
                'Git & GitHub',
                'AI Automation',
                'Editing Foto & Video',
              ].map((tech) => (
                <span
                  key={tech}
                  className="text-[11px] sm:text-xs font-mono px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg bg-[#050505] border border-[#1F2924] text-gray-200 hover:text-emerald-400 hover:border-emerald-500/50 transition-all duration-150 cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
