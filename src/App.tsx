import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Home } from './pages/Home';

// Lazy load admin dan auth routes untuk mengoptimalkan first-load performance publik
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));

// Loading fallback dengan Cyber Emerald aesthetic
const PageFallback: React.FC = () => (
  <div className="min-h-screen bg-[#050505] text-[#10B981] font-mono flex items-center justify-center">
    <div className="flex items-center gap-3">
      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
      <span className="text-sm tracking-wide">Memuat antarmuka...</span>
    </div>
  </div>
);

// Inisialisasi TanStack Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Komponen Proteksi Rute Frontend (React Router Guard) sesuai spesifikasi PDF 3.B
export const AdminProtectedRoute: React.FC = () => {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#10B981] p-8 font-mono flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
          <span>Memuat sesi admin...</span>
        </div>
      </div>
    );
  }

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Rute Publik Utama */}
              <Route path="/" element={<Home />} />

              {/* Halaman Autentikasi Tersembunyi */}
              <Route path="/login" element={<Login />} />

              {/* Rute Terproteksi Single-Admin */}
              <Route element={<AdminProtectedRoute />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
              </Route>

              {/* Fallback ke Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
