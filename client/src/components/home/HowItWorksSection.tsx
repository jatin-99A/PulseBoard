import React from 'react';
import { PenSquare, Share2, TrendingUp } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      step: '01',
      icon: <PenSquare className="w-5 h-5 text-indigo-400" />,
      title: 'Craft your question',
      description:
        'Type your poll or quiz question, add multiple-choice options, and toggle anonymous voting or word-cloud mode.',
    },
    {
      step: '02',
      icon: <Share2 className="w-5 h-5 text-violet-400" />,
      title: 'Display QR & Room Code',
      description:
        'Project the high-res QR code on your stage screen or paste the one-click short-link in your Zoom/Meet chat.',
    },
    {
      step: '03',
      icon: <TrendingUp className="w-5 h-5 text-emerald-400" />,
      title: 'Live insights on stage',
      description:
        'Watch live vote percentages, dynamic bars, and audience feedback animate with zero refresh or delay.',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
          Simple Workflow
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Three steps to live audience engagement
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          No complex software configurations, hardware dongles, or app store downloads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((item, idx) => (
          <div
            key={idx}
            className="relative rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700/60">
                  {item.icon}
                </div>
                <span className="text-2xl font-black text-slate-800 select-none">
                  {item.step}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/50 text-[11px] font-semibold text-indigo-400">
              Ready in under 30 seconds &rarr;
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

