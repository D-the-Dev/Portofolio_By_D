import React from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Award, 
  Briefcase, 
  UserCheck, 
  LogOut, 
  ExternalLink, 
  Shield, 
  Database,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export type AdminTab = 'overview' | 'projects' | 'certificates' | 'experiences' | 'profile' | 'database';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  counts: {
    projects: number;
    certificates: number;
    experiences: number;
  };
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  counts,
  isOpenMobile = false,
  onCloseMobile,
}) => {
  const { signOut, user } = useAuth();

  const navItems: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'overview', label: 'Ringkasan Sistem', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'projects', label: 'Daftar Proyek', icon: <FolderKanban className="w-4 h-4" />, badge: counts.projects },
    { id: 'certificates', label: 'Sertifikasi', icon: <Award className="w-4 h-4" />, badge: counts.certificates },
    { id: 'experiences', label: 'Pengalaman', icon: <Briefcase className="w-4 h-4" />, badge: counts.experiences },
    { id: 'profile', label: 'Profil & Berkas CV', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'database', label: 'Panduan Supabase RLS', icon: <Database className="w-4 h-4" /> },
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full">
      <div>
        {/* Header Branding */}
        <div className="p-4 sm:p-5 border-b border-[#1F2924] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold font-mono tracking-wider text-[#F3F4F6]">
                ADMIN CONSOLE
              </h2>
              <p className="text-[10px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SINGLE_AUTH_MODE
              </p>
            </div>
          </div>

          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* User badge */}
        <div className="px-4 py-3 sm:px-5">
          <div className="p-2.5 rounded-lg bg-[#050505] border border-[#1F2924] text-xs font-mono text-gray-400">
            <div className="text-[10px] text-gray-500 uppercase">IDENTIFIER ADMIN</div>
            <div className="text-emerald-400 truncate mt-0.5" title={user?.email || ''}>
              {user?.email || 'admin@matrix.dev'}
            </div>
            <div className="text-[9px] font-mono text-emerald-500/80 mt-1 truncate" title={user?.id || ''}>
              UID: {user?.id}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-mono transition-all text-left ${
                  isActive
                    ? 'bg-emerald-500 text-black font-semibold shadow-emerald-glow'
                    : 'text-gray-300 hover:bg-[#050505] hover:text-white hover:border-[#1F2924]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-black' : 'text-emerald-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === 'number' && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                      isActive
                        ? 'bg-black/20 text-black font-bold'
                        : 'bg-[#050505] text-emerald-400 border border-[#1F2924]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-[#1F2924] space-y-2">
        <Link
          to="/"
          target="_blank"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-gray-400 hover:text-white hover:bg-[#050505] border border-transparent hover:border-[#1F2924] transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
          <span>Lihat Website Publik</span>
        </Link>

        <button
          onClick={signOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar Sesi Admin</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 bg-[#0F1412] border-r border-[#1F2924] flex-col justify-between shrink-0 min-h-screen">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <aside className="relative w-[280px] max-w-[85vw] bg-[#0F1412] border-r border-[#1F2924] h-full shadow-2xl z-10">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
