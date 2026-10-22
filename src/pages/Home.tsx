import React, { useState } from 'react';
import { Navbar } from '../components/public/Navbar';
import { HeroBento } from '../components/public/HeroBento';
import { ProjectGrid } from '../components/public/ProjectGrid';
import { CertificateLightbox } from '../components/public/CertificateLightbox';
import { ExperienceTimeline } from '../components/public/ExperienceTimeline';
import { CVViewer } from '../components/public/CVViewer';
import { usePortfolioData } from '../hooks/usePortfolioData';
import { Terminal, Shield, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  const { profile, projects, certificates, experiences, isLoading } = usePortfolioData();
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-mono text-emerald-400">
        <div className="w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4 animate-pulse">
          <Terminal className="w-6 h-6 text-emerald-400" />
        </div>
        <p className="text-sm font-semibold tracking-wider">Loading...</p>
        <p className="text-xs text-gray-500 mt-1">Tunggu Bentar Cuy...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F4F6] relative selection:bg-emerald-500 selection:text-black bg-dot-pattern">
      {/* Fixed Navbar */}
      <Navbar profile={profile} onOpenCV={() => setIsCVModalOpen(true)} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        <HeroBento
          profile={profile}
          projectsCount={projects.length}
          experiencesCount={experiences.length}
          certificatesCount={certificates.length}
          onOpenCV={() => setIsCVModalOpen(true)}
        />

        <ProjectGrid projects={projects} />

        <CertificateLightbox certificates={certificates} />

        <ExperienceTimeline experiences={experiences} />
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-[#1F2924] bg-[#0F1412]/80 backdrop-blur-md py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#050505] border border-[#1F2924] flex items-center justify-center text-emerald-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-mono font-bold text-[#F3F4F6]">
                  {profile.full_name} // PORTFOLIO
                </p>
                <p className="text-[11px] font-mono text-gray-500">
                  dewataforwork@gmail.com
                </p>
              </div>
            </div>

            {/* Social links & status */}
            <div className="flex items-center gap-4 text-xs font-mono text-gray-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ALL SYSTEMS OPERATIONAL
              </span>
              <span>•</span>
              <Link to="/login" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Portal Admin
              </Link>
            </div>

            {/* Back to top */}
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-lg bg-[#050505] border border-[#1F2924] text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#1F2924]/60 text-center text-xs font-mono text-gray-500">
            &copy; {new Date().getFullYear()} {profile.full_name}. Hak Cipta Dilindungi.
          </div>
        </div>
      </footer>

      {/* CV Modal Viewer */}
      <CVViewer
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
        cvUrl={profile.cv_file_url}
        cvUpdatedAt={profile.cv_updated_at}
        candidateName={profile.full_name}
      />
    </div>
  );
};
