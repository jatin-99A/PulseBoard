import React, { useState } from 'react';
import { Users, RotateCcw, Check, Radio, QrCode } from 'lucide-react';

interface PollOption {
  id: string;
  label: string;
  votes: number;
}

export const InteractiveDemoSection: React.FC = () => {
  const [options, setOptions] = useState<PollOption[]>([
    { id: '1', label: 'Event-Driven Realtime Services', votes: 142 },
    { id: '2', label: 'Edge Computing & Serverless', votes: 98 },
    { id: '3', label: 'Modular Monoliths with Redis', votes: 76 },
    { id: '4', label: 'AI Agent Workflows & Pipelines', votes: 184 },
  ]);

  const [selectedId, setSelectedId] = useState<string | null>('4');
  const [hasVoted, setHasVoted] = useState(true);

  const totalVotes = options.reduce((sum, opt) => sum + opt.votes, 0);

  const handleVote = (id: string) => {
    if (selectedId === id) return;

    setOptions((prev) =>
      prev.map((opt) => {
        if (opt.id === id) return { ...opt, votes: opt.votes + 1 };
        if (selectedId && opt.id === selectedId) return { ...opt, votes: Math.max(0, opt.votes - 1) };
        return opt;
      })
    );
    setSelectedId(id);
    setHasVoted(true);
  };

  const handleReset = () => {
    if (selectedId) {
      setOptions((prev) =>
        prev.map((opt) => (opt.id === selectedId ? { ...opt, votes: opt.votes - 1 } : opt))
      );
    }
    setSelectedId(null);
    setHasVoted(false);
  };

  return (
    <section id="demo" className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6">
      <div className="text-center space-y-3 mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
          <Radio className="w-3.5 h-3.5 animate-pulse text-indigo-400" />
          <span>Interactive Live Simulator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experience the zero-latency magic
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Cast a vote below to see how votes update instantly across thousands of screens simultaneously.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Live Voting Card Simulator */}
        <div className="lg:col-span-8 rounded-3xl bg-slate-900/90 border border-slate-800 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Live Poll #PULSE-802
              </span>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 font-medium text-slate-300">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{totalVotes} Votes Cast</span>
              </div>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                title="Reset simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          {/* Poll Question */}
          <h3 className="text-lg sm:text-xl font-bold text-white mb-6">
            Which software architecture are you prioritizing to scale in 2026?
          </h3>

          {/* Poll Options */}
          <div className="space-y-3">
            {options.map((opt) => {
              const percentage = Math.round((opt.votes / totalVotes) * 100) || 0;
              const isSelected = selectedId === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleVote(opt.id)}
                  className={`w-full relative overflow-hidden text-left p-4 rounded-2xl border transition-all duration-300 group ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/30 shadow-md shadow-indigo-600/10'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {/* Realtime Animated Fill Bar */}
                  <div
                    className={`absolute inset-y-0 left-0 transition-all duration-500 ease-out ${
                      isSelected
                        ? 'bg-indigo-600/25 border-r border-indigo-500/50'
                        : 'bg-slate-800/40'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />

                  {/* Option Text and Stats */}
                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-indigo-400 bg-indigo-500 text-white'
                            : 'border-slate-700 group-hover:border-slate-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {opt.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs">
                      <span className="text-slate-400 font-mono">{opt.votes}</span>
                      <span className="font-bold text-slate-100 font-mono w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback note */}
          <div className="mt-5 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60">
            <span>{hasVoted ? '✓ Your vote was recorded in real time' : 'Click any option to cast your vote'}</span>
            <span className="text-emerald-400 font-medium">⚡ Latency: 24ms</span>
          </div>
        </div>

        {/* Presenter Room Info Card */}
        <div className="lg:col-span-4 rounded-3xl bg-slate-900/60 border border-slate-800/90 p-6 space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 tracking-wider">
              Presenter Room
            </span>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              PIN: 894-220
            </span>
          </div>

          {/* Mock QR Join Card */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center space-y-3 text-center">
            <div className="p-3 bg-white rounded-xl shadow-lg">
              <QrCode className="w-28 h-28 text-slate-950" />
            </div>
            <p className="text-xs text-slate-400">
              Audience members scan with their smartphone camera to join instantly.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-400">
              <span>Security Check</span>
              <span className="text-emerald-400 font-medium">1 Vote / IP Throttled</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-800/60 text-slate-400">
              <span>WebSocket Stream</span>
              <span className="text-slate-200 font-mono">active (250 rps)</span>
            </div>
            <div className="flex justify-between py-1.5 text-slate-400">
              <span>Display View</span>
              <span className="text-indigo-400 font-medium">Projector Mode Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
