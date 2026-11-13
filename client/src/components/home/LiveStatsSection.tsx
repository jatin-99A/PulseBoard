import React from 'react';

export const LiveStatsSection: React.FC = () => {
  const stats = [
    {
      value: '10M+',
      label: 'Live Votes Processed',
      subtext: 'across 45,000+ sessions',
    },
    {
      value: '< 45ms',
      label: 'Median Latency',
      subtext: 'global edge Redis sync',
    },
    {
      value: '99.99%',
      label: 'Platform Reliability',
      subtext: 'zero keynote interruptions',
    },
    {
      value: '140+',
      label: 'Countries Worldwide',
      subtext: 'supporting multivariant locales',
    },
  ];

  return (
    <section className="py-12 border-y border-slate-900 bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-2xl bg-slate-900/30 border border-slate-800/40 backdrop-blur-sm"
            >
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-indigo-400 via-indigo-200 to-white bg-clip-text text-transparent tracking-tight">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-slate-200 mt-1 uppercase tracking-wide">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

