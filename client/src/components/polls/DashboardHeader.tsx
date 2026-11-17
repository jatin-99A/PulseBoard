import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../common/Button';
import { LogOut, Home } from 'lucide-react';
import type { User } from '../../types/auth';

interface DashboardHeaderProps {
  user: User | null;
  onNavigateHome?: () => void;
  onLogout: () => void;
  isLoggingOut: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  onNavigateHome,
  onLogout,
  isLoggingOut,
}) => {
  const initials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button onClick={onNavigateHome} className="hover:opacity-90 transition-opacity">
            <BrandLogo size="sm" />
          </button>
          {onNavigateHome && (
            <button
              type="button"
              onClick={onNavigateHome}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Explore Landing</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-[11px] font-bold text-white shadow-sm">
              {initials}
            </div>
            <span className="text-xs font-medium text-slate-200 hidden sm:inline">
              {user?.firstName} {user?.lastName}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            isLoading={isLoggingOut}
            leftIcon={<LogOut className="w-3.5 h-3.5" />}
            className="text-slate-300 hover:text-white border-slate-700 hover:border-slate-600"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

