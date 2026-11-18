import React from 'react';
import { Check, Trophy } from 'lucide-react';
import type { PollQuestion, PollAnalysisQuestion } from '../../types/polls';

interface LiveQuestionCardProps {
  question: PollQuestion;
  questionIndex: number;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  hasVoted: boolean;
  liveStats?: PollAnalysisQuestion;
}

export const LiveQuestionCard: React.FC<LiveQuestionCardProps> = ({
  question,
  questionIndex,
  selectedOptionId,
  onSelectOption,
  hasVoted,
  liveStats,
}) => {
  const statsMap = new Map<string, { votes: number; percentage: number }>();
  if (liveStats?.options) {
    liveStats.options.forEach((opt) => {
      statsMap.set(opt.id, { votes: opt.votes, percentage: opt.percentage });
    });
  }

  const maxVotes = liveStats?.options
    ? Math.max(...liveStats.options.map((o) => o.votes), 0)
    : 0;

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 sm:p-7 space-y-5 backdrop-blur-xl shadow-xl">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          <span className="text-indigo-400 mr-2">Q{questionIndex + 1}.</span>
          {question.questionText}
        </h3>
        {question.isMandatory && !hasVoted && (
          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            Required
          </span>
        )}
      </div>

      <div className="space-y-3">
        {question.options.map((option) => {
          const optId = option.id || option.optionText;
          const isSelected = selectedOptionId === optId;
          const stat = statsMap.get(optId) || { votes: option.votes || 0, percentage: option.percentage || 0 };
          const isLeading = hasVoted && maxVotes > 0 && stat.votes === maxVotes;

          return (
            <button
              key={optId}
              type="button"
              disabled={hasVoted}
              onClick={() => onSelectOption(optId)}
              className={`w-full relative overflow-hidden text-left p-4 rounded-2xl border transition-all duration-300 ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-600/10'
                  : 'border-slate-800/90 bg-slate-950/70 hover:border-slate-700 hover:bg-slate-900/60'
              } ${hasVoted ? 'cursor-default' : 'cursor-pointer active:scale-[0.99]'}`}
            >
              {/* Animated Progress Bar when results are shown */}
              {hasVoted && (
                <div
                  className={`absolute inset-y-0 left-0 transition-all duration-700 ease-out ${
                    isLeading
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/20 border-r border-indigo-500/40'
                      : 'bg-slate-800/40'
                  }`}
                  style={{ width: `${stat.percentage}%` }}
                />
              )}

              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <span className={`text-sm font-semibold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {option.optionText}
                  </span>

                  {isLeading && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                      <Trophy className="w-3 h-3" />
                      <span>Leading</span>
                    </span>
                  )}
                </div>

                {hasVoted && (
                  <div className="flex items-center gap-2 text-xs font-mono shrink-0">
                    <span className="text-slate-400">{stat.votes} votes</span>
                    <span className="font-bold text-white w-10 text-right">{stat.percentage}%</span>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
