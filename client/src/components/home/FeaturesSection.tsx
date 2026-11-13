import React from 'react';
import { Zap, QrCode, ShieldCheck, BarChart3, Lock, FileSpreadsheet } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: <Zap className="w-5 h-5 text-indigo-400" />,
      title: 'Sub-50ms WebSocket Sync',
      description:
        'Powered by Redis Pub/Sub, votes propagate in real time without lag, even with 10,000+ concurrent voters.',
      badge: 'Realtime Engine',
    },
    {
      icon: <QrCode className="w-5 h-5 text-violet-400" />,
      title: 'Instant QR & 6-Digit PIN Join',
      description:
        'Participants just aim their camera and vote directly in their mobile browser. No downloads or signups required.',
      badge: 'Zero Friction',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Anti-Abuse & Duplicate Prevention',
      description:
        'Advanced device fingerprinting and IP throttling prevent ballot-stuffing so your poll data remains clean and trusted.',
      badge: 'Fraud Shield',
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-sky-400" />,
      title: 'Presenter Projector Mode',
      description:
        'Full-screen presenter views with animated bar charts, donut graphs, and glowing vote pulses designed for stages.',
      badge: 'Stage Ready',
    },
    {
      icon: <Lock className="w-5 h-5 text-amber-400" />,
      title: 'Anonymous & Private By Design',
      description:
        'Encourage honest feedback and high participation with 100% anonymous voting options and GDPR compliance.',
      badge: 'Privacy First',
    },
    {
      icon: <FileSpreadsheet className="w-5 h-5 text-rose-400" />,
      title: 'One-Click Data Export',
      description:
        'Download raw votes, timestamps, and aggregated summaries in CSV or PDF format right after your event concludes.',
      badge: 'Data Export',
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center space-y-3 mb-12">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">
          Platform Architecture
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Engineered for high-stakes presentations
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Everything you need to engage live audiences, gather actionable data, and impress conference attendees.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 p-6 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/40">
                  {feature.badge}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                {feature.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

