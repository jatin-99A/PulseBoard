import React from 'react';
import { Button } from '../common/Button';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

interface CtaBannerSectionProps {
  onGetStarted: () => void;
}

export const CtaBannerSection: React.FC<CtaBannerSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-900/60 via-slate-900/90 to-purple-900/60 border border-indigo-500/30 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
        {/* Glow blur background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/20 blur-3xl pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Free &bull; No Setup Required</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Ready to engage your audience in real time?
          </h2>

          <p className="text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Join thousands of event organizers, team leads, and educators creating interactive pulses in seconds.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 font-bold shadow-indigo-600/40"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Get Started Free
            </Button>
          </div>

          <div className="pt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Full privacy controls</span>
            </div>
            <span>&bull;</span>
            <span>Zero software downloads</span>
            <span>&bull;</span>
            <span>Free forever tier</span>
          </div>
        </div>
      </div>
    </section>
  );
};

