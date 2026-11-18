import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LivePollPage } from './pages/LivePollPage';
import { Activity } from 'lucide-react';

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen w-full bg-[#07090e] flex flex-col items-center justify-center space-y-4">
    <div className="relative rounded-2xl bg-indigo-600/20 border border-indigo-500/30 p-4 shadow-xl shadow-indigo-600/10">
      <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
    </div>
    <p className="text-xs font-medium text-slate-400 tracking-wider uppercase animate-pulse">
      Connecting to PulseBoard...
    </p>
  </div>
);

const ProtectedDashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/auth" replace />;

  return <DashboardPage onNavigateHome={() => navigate('/')} />;
};

const AuthRoute: React.FC<{ defaultMode?: 'signin' | 'signup' }> = ({ defaultMode = 'signin' }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <AuthPage
      initialMode={defaultMode}
      onBackToHome={() => navigate('/')}
      onSuccess={() => navigate('/dashboard')}
    />
  );
};

const HomeRoute: React.FC = () => {
  const navigate = useNavigate();
  return (
    <HomePage
      onNavigateAuth={(mode) => navigate(mode === 'signup' ? '/signup' : '/auth')}
      onNavigateDashboard={() => navigate('/dashboard')}
    />
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/auth" element={<AuthRoute defaultMode="signin" />} />
          <Route path="/signin" element={<AuthRoute defaultMode="signin" />} />
          <Route path="/signup" element={<AuthRoute defaultMode="signup" />} />
          <Route path="/dashboard" element={<ProtectedDashboard />} />
          <Route path="/poll/:publicLink" element={<LivePollPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
