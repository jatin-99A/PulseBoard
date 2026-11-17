import React, { useState, useEffect, useCallback } from 'react';
import { X, Trophy, Users, RefreshCw, BarChart2 } from 'lucide-react';
import { pollsApi } from '../../api/polls-api';
import type { Poll, PollAnalysis } from '../../types/polls';

interface PollAnalysisModalProps {
  poll: Poll | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PollAnalysisModal: React.FC<PollAnalysisModalProps> = ({
  poll,
  isOpen,
  onClose,
}) => {
  const [analysis, setAnalysis] = useState<PollAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = useCallback(async (pollId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await pollsApi.getPollAnalysis(pollId);
      if (res.data) setAnalysis(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch poll analysis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && poll) {
      fetchAnalysis(poll.id);
    } else {
      setAnalysis(null);
    }
  }, [isOpen, poll, fetchAnalysis]);

  if (!isOpen || !poll) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">{poll.title}</h2>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" />
                <span>{analysis ? `${analysis.totalResponses} Total Responses` : 'Loading responses...'}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAnalysis(poll.id)}
              disabled={isLoading}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Refresh results"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 text-xs text-rose-300 bg-rose-950/40 border border-rose-800/60 rounded-xl">
            {error}
          </div>
        )}

        {isLoading && !analysis ? (
          <div className="space-y-4 py-8 animate-pulse">
            <div className="h-6 bg-slate-800 rounded-lg w-1/3" />
            <div className="space-y-2">
              <div className="h-10 bg-slate-800 rounded-xl" />
              <div className="h-10 bg-slate-800 rounded-xl" />
            </div>
          </div>
        ) : analysis && analysis.questions.length > 0 ? (
          <div className="space-y-6">
            {analysis.questions.map((question, qIdx) => {
              const maxVotes = Math.max(...question.options.map((o) => o.votes), 0);

              return (
                <div key={question.id || qIdx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                      {qIdx + 1}. {question.questionText}
                    </h3>
                    <span className="text-xs font-mono text-slate-400">{question.totalVotes} votes</span>
                  </div>

                  <div className="space-y-2.5">
                    {question.options.map((option) => {
                      const isLeading = maxVotes > 0 && option.votes === maxVotes;
                      return (
                        <div key={option.id} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5 font-medium text-slate-200">
                              <span>{option.optionText}</span>
                              {isLeading && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/30">
                                  <Trophy className="w-3 h-3" />
                                  <span>Leading</span>
                                </span>
                              )}
                            </div>
                            <span className="font-mono font-semibold text-slate-300">
                              {option.votes} ({option.percentage}%)
                            </span>
                          </div>

                          <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isLeading
                                  ? 'bg-gradient-to-r from-indigo-500 to-violet-500'
                                  : 'bg-slate-700'
                              }`}
                              style={{ width: `${option.percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-400">
            No votes or questions have been submitted yet. Share the poll link to collect votes!
          </div>
        )}
      </div>
    </div>
  );
};

