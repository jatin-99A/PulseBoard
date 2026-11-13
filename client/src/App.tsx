import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { Activity } from 'lucide-react';

type PageView = 'home' | 'auth' | 'dashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState<PageView>('home');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#07090e] flex flex-col items-center justify-center space-y-4">
        <div className="relative rounded-2xl bg-indigo-600/20 border border-indigo-500/30 p-4 shadow-xl shadow-indigo-600/10">
          <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
        <p className="text-xs font-medium text-slate-400 tracking-wider uppercase animate-pulse">
          Connecting to PulseBoard...
        </p>
      </div>
    );
  }

  const navigateToAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthMode(mode);
    setCurrentPage('auth');
  };

  const navigateToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  if (currentPage === 'dashboard') {
    return isAuthenticated ? (
      <DashboardPage onNavigateHome={navigateToHome} />
    ) : (
      <AuthPage
        initialMode="signin"
        onBackToHome={navigateToHome}
        onSuccess={() => setCurrentPage('dashboard')}
      />
    );
  }

  if (currentPage === 'auth') {
    return isAuthenticated ? (
      <DashboardPage onNavigateHome={navigateToHome} />
    ) : (
      <AuthPage
        initialMode={authMode}
        onBackToHome={navigateToHome}
        onSuccess={() => setCurrentPage('dashboard')}
      />
    );
  }

  return (
    <HomePage
      onNavigateAuth={navigateToAuth}
      onNavigateDashboard={navigateToDashboard}
    />
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
