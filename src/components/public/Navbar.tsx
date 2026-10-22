import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Shield, Download, Menu, X, ArrowUpRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import type { ProfileConfig } from '../../types';

interface NavbarProps {
  profile: ProfileConfig | null;
  onOpenCV: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ profile, onOpenCV }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Kunci scroll saat drawer menu mobile terbuka
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Tentang', href: '#about' },
    { name: 'Proyek', href: '#projects' },
    { name: 'Sertifikasi', href: '#certificates' },
    { name: 'Pengalaman', href: '#experiences' },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-[#050505]/90 backdrop-blur-md border-b border-[#1F2924] shadow-lg shadow-black/50 py-3'
            : 'bg-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="flex items-center gap-2 sm:gap-2.5 group min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#0F1412] border border-[#1F2924] flex items-center justify-center text-emerald-400 group-hover:border-emerald-500 group-hover:shadow-emerald-glow transition-all duration-300 shrink-0">
              <Terminal className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-[#F3F4F6] group-hover:text-emerald-400 transition-colors truncate max-w-[130px] sm:max-w-none">
                {profile?.full_name ? profile.full_name.toUpperCase() : 'PORTFOLIO'}
              </span>
              <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SYSTEM // ONLINE
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs font-mono text-gray-300 hover:text-emerald-400 transition-colors uppercase tracking-wider relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-200 group-hover:w-full"></span>
              </a>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {profile?.cv_file_url && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenCV}
                leftIcon={<Download className="w-3.5 h-3.5" />}
              >
                Unduh CV
              </Button>
            )}

            {/* Admin Direct Access */}
            {isAdmin ? (
              <Link to="/admin/dashboard">
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Shield className="w-3.5 h-3.5" />}
                >
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link
                to="/login"
                title="Admin Authentication Portal"
                className="p-2 rounded-lg text-gray-400 hover:text-emerald-400 hover:bg-[#0F1412] border border-transparent hover:border-[#1F2924] transition-all"
              >
                <Shield className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="md:hidden flex items-center gap-2">
            {profile?.cv_file_url && (
              <Button
                variant="primary"
                size="sm"
                onClick={onOpenCV}
                leftIcon={<Download className="w-3 h-3" />}
                className="text-xs py-1.5 px-2.5"
              >
                CV
              </Button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-[#0F1412] border border-[#1F2924] text-gray-300 hover:text-white active:scale-95 transition-all"
              aria-label={mobileMenuOpen ? 'Tutup Menu' : 'Buka Menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-emerald-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu & Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-30 md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Slide-down Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative top-[60px] mx-3 bg-[#0F1412]/98 border border-[#1F2924] rounded-2xl shadow-2xl p-5 overflow-hidden backdrop-blur-xl"
            >
              <div className="space-y-1 pb-4 border-b border-[#1F2924]">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={handleLinkClick}
                    className="flex items-center justify-between text-sm font-mono text-gray-200 hover:text-emerald-400 hover:bg-[#050505] p-3 rounded-xl transition-all"
                  >
                    <span>{link.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-500" />
                  </a>
                ))}
              </div>

              {/* Mobile Drawer Footer Actions */}
              <div className="pt-4 space-y-3">
                {profile?.cv_file_url && (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenCV();
                    }}
                    leftIcon={<Download className="w-4 h-4" />}
                  >
                    Unduh CV (PDF)
                  </Button>
                )}

                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      onClick={handleLinkClick}
                      className="w-full text-center py-2 px-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" /> Buka Admin Dashboard
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      onClick={handleLinkClick}
                      className="text-gray-400 hover:text-emerald-400 flex items-center gap-1.5 py-1 px-2"
                    >
                      <Shield className="w-3.5 h-3.5" /> Portal Login Admin
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
