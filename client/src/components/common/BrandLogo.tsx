import React from 'react';
import { Activity } from 'lucide-react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ size = 'md', className = '' }) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const titleSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`${iconSizes[size]} relative rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center`}
      >
        <div className="w-full h-full bg-slate-950/70 backdrop-blur-sm rounded-[10px] flex items-center justify-center">
          <Activity className="w-1/2 h-1/2 text-indigo-400 animate-pulse" />
        </div>
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
      </div>
      <div>
        <div className={`font-extrabold tracking-tight ${titleSizes[size]} bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent flex items-center gap-1`}>
          Pulse<span className="text-indigo-400">Board</span>
        </div>
        {size !== 'sm' && (
          <p className="text-[11px] font-medium tracking-wide text-slate-400 uppercase">
            Realtime Polling & Insights
          </p>
        )}
      </div>
    </div>
  );
};

