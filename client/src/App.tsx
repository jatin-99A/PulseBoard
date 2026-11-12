import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { Activity } from 'lucide-react';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

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

  return isAuthenticated ? <DashboardPage /> : <AuthPage />;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

