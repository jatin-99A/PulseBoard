import React, { useState } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import { SigninForm } from '../components/auth/SigninForm';
import { SignupForm } from '../components/auth/SignupForm';
import { ShieldCheck, BarChart3, Zap, Users2 } from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin' }) => {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#07090e] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Decorative ambient background lights */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left Branding & Highlights Column (Hidden on mobile/tablet, visible on lg) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-6">
          <div className="space-y-6">
            <BrandLogo size="lg" />

            <div className="space-y-3 pt-4">
              <h1 className="text-4xl font-extrabold text-white tracking-tight leading-tight">
                Realtime Polls & Instant Audience Insights.
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Empower your presentations, classrooms, and team retrospectives with dynamic, live-updating votes and feedback.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Sub-second Latency</h4>
                  <p className="text-[11px] text-slate-400">Instant vote propagation via Redis & WebSockets</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Live Visual Analytics</h4>
                  <p className="text-[11px] text-slate-400">Interactive charts and exportable engagement data</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                  <Users2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-200">Session Security</h4>
                  <p className="text-[11px] text-slate-400">JWT cookies, refresh token rotation & anti-abuse checks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-4 border-t border-slate-800/60">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>End-to-end encrypted session & secure token rotation</span>
          </div>
        </div>

        {/* Right Form Card Column */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          {/* Mobile Brand Header */}
          <div className="lg:hidden flex justify-center mb-6">
            <BrandLogo size="md" />
          </div>

          <div className="rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-2xl shadow-black/80 backdrop-blur-xl p-6 sm:p-8">
            {/* Tab switch control */}
            <div className="flex p-1 bg-slate-950/70 rounded-xl border border-slate-800/70 mb-6">
              <button
                type="button"
                onClick={() => setMode('signin')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === 'signin'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setMode('signup')}
                className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all duration-200 ${
                  mode === 'signup'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Active Form */}
            {mode === 'signin' ? (
              <SigninForm onSwitchToSignup={() => setMode('signup')} />
            ) : (
              <SignupForm onSwitchToSignin={() => setMode('signin')} />
            )}
          </div>

          {/* Bottom Security / Trust Footer */}
          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-500 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Protected by PulseBoard Secure Auth &bull; Strict Cookies</span>
          </div>
        </div>
      </div>
    </div>
  );
};

