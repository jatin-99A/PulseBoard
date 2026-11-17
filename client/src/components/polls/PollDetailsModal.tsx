import React, { useState } from 'react';
import { X, Copy, Check, BarChart2, Calendar, Shield, Share2 } from 'lucide-react';
import { Button } from '../common/Button';
import type { Poll } from '../../types/polls';

interface PollDetailsModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenAnalysis: (poll: Poll) => void;
  onCopyLink: (url: string) => void;
}

export const PollDetailsModal: React.FC<PollDetailsModalProps> = ({
  poll,
  isOpen,
  onClose,
  onOpenAnalysis,
  onCopyLink,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !poll) return null;

  const isExpired = !poll.isActive || new Date(poll.expiresAt).getTime() <= Date.now();
  const shareUrl = `${window.location.origin}/poll/${poll.publicLink}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    onCopyLink(shareUrl);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                !isExpired
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${!isExpired ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
              {!isExpired ? 'Active Poll' : 'Expired'}
            </span>
            {poll.isAnonymousAllowed && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-slate-800 text-slate-300 border border-slate-700/60">
                <Shield className="w-3 h-3 text-indigo-400" />
                <span>Anonymous Allowed</span>
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">{poll.title}</h2>
          {poll.description && (
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{poll.description}</p>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden text-xs font-mono text-slate-300">
            <Share2 className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="truncate">{shareUrl}</span>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Questions ({poll.questions?.length || 0})
          </h3>
          <div className="space-y-3">
            {poll.questions && poll.questions.length > 0 ? (
              poll.questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {idx + 1}. {q.questionText}
                    </span>
                    {q.isMandatory && (
                      <span className="text-[10px] text-rose-400 font-medium">Required</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {q.options.map((opt, oi) => (
                      <div
                        key={oi}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-2"
                      >
                        <span className="text-slate-400 text-[11px] font-mono">{oi + 1}.</span>
                        <span className="truncate">{opt.optionText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No questions retrieved for this poll.</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Expires {new Date(poll.expiresAt).toLocaleDateString()}</span>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              onOpenAnalysis(poll);
            }}
            leftIcon={<BarChart2 className="w-3.5 h-3.5" />}
          >
            View Live Results
          </Button>
        </div>
      </div>
    </div>
  );
};

