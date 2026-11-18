import React from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Shield } from 'lucide-react';

interface LivePollHeaderProps {
  isConnected: boolean;
  isExpired?: boolean;
  isAnonymousAllowed?: boolean;
}

export const LivePollHeader: React.FC<LivePollHeaderProps> = ({
  isConnected,
  isExpired,
  isAnonymousAllowed,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a href="/" className="hover:opacity-90 transition-opacity">
          <BrandLogo size="sm" />
        </a>

        <div className="flex items-center gap-2.5">
          {/* Socket Connection Status */}
          <div
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
              isConnected
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            <span className="relative flex h-2 w-2">
              {isConnected && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <span>{isConnected ? 'Live Sync Connected' : 'Connecting...'}</span>
          </div>

          {/* Anonymous status */}
          {isAnonymousAllowed && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>Anonymous Allowed</span>
            </span>
          )}

          {isExpired && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
              Expired
            </span>
          )}
        </div>
      </div>
    </header>
  );
};
