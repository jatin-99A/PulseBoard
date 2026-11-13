import React from 'react';
import { Button } from '../common/Button';
import { Sparkles, ArrowRight, Play, Star, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden text-center">
      {/* Radial Gradient Backdrop Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-violet-600/15 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 space-y-7">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-semibold shadow-inner shadow-indigo-500/10">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
          </span>
          <span>PulseEngine 2.0 &bull; Sub-50ms WebSocket Sync</span>
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12]">
          Turn passive listeners into{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200 bg-clip-text text-transparent">
            live participants.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Create dynamic real-time polls, live quizzes, and audience pulses for conferences, webinars, and team retros. Zero app downloads required.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onGetStarted}
            className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold shadow-indigo-600/40"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Create Your First Poll — Free
          </Button>

          <a
            href="#demo"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
            <span>Try Interactive Demo</span>
          </a>
        </div>

        {/* Highlights List */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-8 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Instant QR code sharing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Up to 1,000 live participants</span>
          </div>
        </div>

        {/* Social Proof Row */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs text-slate-400">
          <div className="flex -space-x-2 overflow-hidden">
            {[
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces',
              'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces',
              'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=64&h=64&fit=crop&crop=faces',
              'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&crop=faces',
            ].map((src, i) => (
              <img
                key={i}
                src={src}
                alt="Presenter Avatar"
                className="inline-block h-8 w-8 rounded-full ring-2 ring-slate-950 object-cover"
              />
            ))}
          </div>
          <div className="flex items-center gap-1 text-slate-300">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="font-semibold text-white ml-1">4.9/5</span>
            <span>from 15,000+ presenters</span>
          </div>
        </div>
      </div>
    </section>
  );
};

