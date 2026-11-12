import React, { useState } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, Sparkles, Plus, BarChart2, Radio } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user, signout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const initials = `${user?.firstName?.[0] || 'U'}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <BrandLogo size="sm" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-slate-800/50 border border-slate-700/50 px-3 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                {initials}
              </div>
              <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                {user?.firstName} {user?.lastName}
              </span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              isLoading={isLoggingOut}
              leftIcon={<LogOut className="w-3.5 h-3.5" />}
              className="text-slate-300 hover:text-white border-slate-700 hover:border-slate-600"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentication Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              You are signed into PulseBoard. Your session tokens are active and secured with HttpOnly cookies.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="primary"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => alert('Poll creation feature can be connected to /api/v1/polls')}
            >
              Create New Poll
            </Button>
            <Button
              variant="secondary"
              size="md"
              leftIcon={<Radio className="w-4 h-4 text-emerald-400" />}
              onClick={() => alert('Live rooms view')}
            >
              Explore Live Polls
            </Button>
          </div>
        </div>

        {/* User Profile & Account Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="lg:col-span-1 rounded-2xl bg-slate-900/70 border border-slate-800 p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-indigo-600/30">
                {initials}
              </div>
              <div>
                <h3 className="font-bold text-base text-white">
                  {user?.firstName} {user?.lastName}
                </h3>
                <p className="text-xs text-slate-400 break-all">{user?.email}</p>
                <div className="inline-flex items-center gap-1.5 mt-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Account
                </div>
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">User ID</span>
                <span className="text-slate-200 font-mono text-[11px] truncate max-w-[170px]" title={user?.id}>
                  {user?.id}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/40">
                <span className="text-slate-400">Security Mode</span>
                <span className="text-indigo-400 font-medium flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  JWT + Refresh Cookie
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Role</span>
                <span className="text-slate-200 font-medium">Poll Administrator</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics & System Status */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Active Polls</span>
                <BarChart2 className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-white">0</div>
                <p className="text-xs text-slate-400 mt-1">Ready to create your first realtime audience poll</p>
              </div>
            </div>

            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Audience Votes</span>
                <UserIcon className="w-4 h-4 text-violet-400" />
              </div>
              <div className="mt-4">
                <div className="text-3xl font-extrabold text-white">0</div>
                <p className="text-xs text-slate-400 mt-1">Realtime participation updates automatically</p>
              </div>
            </div>

            <div className="sm:col-span-2 rounded-2xl bg-slate-900/40 border border-slate-800/60 p-5 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-200">Backend Connection</h4>
                <p className="text-xs text-slate-400 mt-0.5">Connected to PulseBoard Express API at port 8002</p>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Live
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

