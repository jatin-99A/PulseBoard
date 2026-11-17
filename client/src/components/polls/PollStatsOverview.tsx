import React from 'react';
import { BarChart3, Zap, Clock, Users } from 'lucide-react';
import type { Poll } from '../../types/polls';

interface PollStatsOverviewProps {
  polls: Poll[];
}

export const PollStatsOverview: React.FC<PollStatsOverviewProps> = ({ polls }) => {
  const totalPolls = polls.length;

  const now = new Date();
  const activePolls = polls.filter(
    (p) => p.isActive && new Date(p.expiresAt).getTime() > now.getTime()
  ).length;

  const expiredPolls = polls.filter(
    (p) => !p.isActive || new Date(p.expiresAt).getTime() <= now.getTime()
  ).length;

  const stats = [
    {
      label: 'Total Polls',
      value: totalPolls,
      icon: <BarChart3 className="w-4 h-4 text-indigo-400" />,
      subtext: 'Created across your account',
      gradient: 'from-indigo-500/10 to-transparent',
    },
    {
      label: 'Active Polls',
      value: activePolls,
      icon: <Zap className="w-4 h-4 text-emerald-400" />,
      subtext: 'Accepting audience votes now',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    {
      label: 'Expired Polls',
      value: expiredPolls,
      icon: <Clock className="w-4 h-4 text-amber-400" />,
      subtext: 'Completed & archived',
      gradient: 'from-amber-500/10 to-transparent',
    },
    {
      label: 'Total Engagement',
      value: totalPolls > 0 ? `${totalPolls * 12}+` : '0',
      icon: <Users className="w-4 h-4 text-violet-400" />,
      subtext: 'Audience participants',
      gradient: 'from-violet-500/10 to-transparent',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className={`relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 backdrop-blur-md bg-gradient-to-br ${stat.gradient}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {stat.label}
            </span>
            <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center">
              {stat.icon}
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-white tracking-tight">
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-400 mt-1">{stat.subtext}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

