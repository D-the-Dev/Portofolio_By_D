import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, KeyRound, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAdmin, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: authError } = await signIn(email, password);
      if (authError) {
        setError(authError.message || 'Kredensial tidak valid atau akun admin belum terdaftar.');
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Terjadi kesalahan saat otentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F3F4F6] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden bg-dot-pattern">
      {/* Background Emerald Blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Back to Home Link */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
        <Link
          to="/"
          className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-gray-400 hover:text-emerald-400 transition-colors p-2 rounded-lg hover:bg-[#0F1412] border border-transparent hover:border-[#1F2924]"
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>KEMBALI KE PORTOFOLIO</span>
        </Link>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#0F1412]/95 border border-[#1F2924] rounded-2xl shadow-2xl p-5 sm:p-8 backdrop-blur-md relative z-10 hover:border-emerald-500/40 transition-colors my-12 sm:my-0">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-5 border-b border-[#1F2924] mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-emerald-glow-sm">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold font-mono text-[#F3F4F6] tracking-wider">
                ADMIN AUTHENTICATION
              </h1>
              <p className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                SINGLE_ADMIN_GATEWAY
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-1 rounded bg-[#050505] text-gray-400 border border-[#1F2924]">
            v2.4_SECURE
          </span>
        </div>

        {/* Security Warning Notice */}
        <div className="mb-6 p-3 rounded-lg bg-[#050505] border border-[#1F2924] text-[11px] font-mono text-gray-400 leading-relaxed">
          <span className="text-emerald-400 font-semibold">ZERO-TRUST SECURITY:</span> Sesi hanya dapat dibuka oleh akun dengan UUID Admin tunggal yang terverifikasi pada Supabase Row Level Security.
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-xs font-mono text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            label="EMAIL ADMIN"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="admin@matrix.dev"
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <Input
            label="KATA SANDI"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••••••"
            leftIcon={<KeyRound className="w-4 h-4" />}
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isLoading}
            leftIcon={<Shield className="w-4 h-4" />}
          >
            Verifikasi Sesi Admin
          </Button>
        </form>
      </div>
    </div>
  );
};
