import React, { useState } from 'react';
import { Copy, Check, Eye, BarChart2, Trash2, Calendar, Shield, Share2 } from 'lucide-react';
import type { Poll } from '../../types/polls';

interface PollCardProps {
  poll: Poll;
  onViewDetails: (poll: Poll) => void;
  onViewAnalysis: (poll: Poll) => void;
  onDelete: (poll: Poll) => void;
  onCopyLink: (link: string) => void;
}

export const PollCard: React.FC<PollCardProps> = ({
  poll,
  onViewDetails,
  onViewAnalysis,
  onDelete,
  onCopyLink,
}) => {
  const [copied, setCopied] = useState(false);

  const isExpired = !poll.isActive || new Date(poll.expiresAt).getTime() <= Date.now();
  const createdDate = new Date(poll.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const fullShareUrl = `${window.location.origin}/poll/${poll.publicLink}`;

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(fullShareUrl);
    setCopied(true);
    onCopyLink(fullShareUrl);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group relative rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 p-5 transition-all duration-200 flex flex-col justify-between backdrop-blur-sm hover:shadow-xl hover:shadow-indigo-500/5">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                !isExpired
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  !isExpired ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`}
              />
              {!isExpired ? 'Active' : 'Expired'}
            </span>

            {poll.isAnonymousAllowed && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800/80 text-slate-300 border border-slate-700/60">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>Anonymous</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50 transition-colors"
            title="Copy shareable link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>

        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors line-clamp-1">
          {poll.title}
        </h3>

        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed min-h-[32px]">
          {poll.description || 'No description provided for this poll.'}
        </p>

        <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Created {createdDate}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-slate-400">
            <Share2 className="w-3 h-3 text-indigo-400" />
            <span className="truncate max-w-[120px]">/{poll.publicLink}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800/60 grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onViewDetails(poll)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-200 border border-slate-700/50 transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>Details</span>
        </button>

        <button
          type="button"
          onClick={() => onViewAnalysis(poll)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2.5 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 border border-indigo-500/30 transition-colors"
        >
          <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>Results</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(poll)}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold py-2 px-2.5 rounded-xl hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-transparent hover:border-rose-500/30 transition-colors"
          title="Delete poll"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

