import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '../socket';
import { LivePollHeader } from '../components/live-poll/LivePollHeader';
import { LiveQuestionCard } from '../components/live-poll/LiveQuestionCard';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { pollsApi } from '../api/polls-api';
import { Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import type { Poll, PollAnalysis } from '../types/polls';

export const LivePollPage: React.FC = () => {
  const { publicLink: paramLink } = useParams<{ publicLink: string }>();
  const publicLink = paramLink || window.location.pathname.split('/').pop() || '';

  const [poll, setPoll] = useState<Poll | null>(null);
  const [liveStats, setLiveStats] = useState<PollAnalysis | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [hasVoted, setHasVoted] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Socket Setup: Send "client:live:poll" with publicLink
  useEffect(() => {
    if (!publicLink) return;
    socket.connect();
    socket.emit('client:live:poll', publicLink);
    const onResultsUpdate = (stats: PollAnalysis) => setLiveStats(stats);
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    socket.on('poll_results_updated', onResultsUpdate);
    socket.on('server:live:poll', onResultsUpdate);
    return () => {
      socket.off('poll_results_updated', onResultsUpdate);
      socket.off('server:live:poll', onResultsUpdate);
    };
  }, [publicLink]);

  const fetchPollData = useCallback(async () => {
    if (!publicLink) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await pollsApi.getLivePoll(publicLink);
      if (res.data) {
        setPoll(res.data);
        if (res.data.hasVoted) {
          setHasVoted(true);
          const analysisRes = await pollsApi.getPollAnalysis(res.data.id);
          if (analysisRes.data) setLiveStats(analysisRes.data);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load live poll');
    } finally {
      setIsLoading(false);
    }
  }, [publicLink]);

  useEffect(() => {
    fetchPollData();
  }, [fetchPollData]);

  const handleSubmitVote = async () => {
    if (!poll?.questions) return;
    for (const q of poll.questions) {
      const qId = q.id || q.questionText;
      if (q.isMandatory && !selectedAnswers[qId]) {
        setError(`Please answer question "${q.questionText}"`);
        return;
      }
    }
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({ questionId, selectedOptionId }));
      await pollsApi.submitPollResponse(publicLink, payload);
      setHasVoted(true);
      const res = await pollsApi.getPollAnalysis(poll.id);
      if (res.data) setLiveStats(res.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to record vote');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500">
      <LivePollHeader
        isConnected={isConnected}
        isExpired={poll ? !poll.isActive || new Date(poll.expiresAt).getTime() <= Date.now() : false}
        isAnonymousAllowed={poll?.isAnonymousAllowed}
      />
      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 space-y-6">
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
        {isLoading ? (
          <div className="space-y-4 py-12 animate-pulse">
            <div className="h-8 bg-slate-800 rounded-xl w-3/4 mx-auto" />
            <div className="h-40 bg-slate-900 rounded-3xl" />
          </div>
        ) : poll ? (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Live Audience Poll</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{poll.title}</h1>
              {poll.description && <p className="text-xs sm:text-sm text-slate-400">{poll.description}</p>}
            </div>

            {hasVoted && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center gap-2.5 text-xs font-semibold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Your vote was recorded! Watching real-time results below.</span>
              </div>
            )}

            <div className="space-y-5">
              {poll.questions?.map((q, idx) => (
                <LiveQuestionCard
                  key={q.id || idx}
                  question={q}
                  questionIndex={idx}
                  selectedOptionId={selectedAnswers[q.id || q.questionText]}
                  onSelectOption={(optId) => setSelectedAnswers((prev) => ({ ...prev, [q.id || q.questionText]: optId }))}
                  hasVoted={hasVoted}
                  liveStats={liveStats?.questions?.find((sq) => sq.id === q.id || sq.questionText === q.questionText)}
                />
              ))}
            </div>

            {!hasVoted && (
              <Button variant="primary" size="lg" className="w-full font-bold shadow-indigo-600/30" onClick={handleSubmitVote} isLoading={isSubmitting} rightIcon={<ArrowRight className="w-4 h-4" />}>
                Submit Vote
              </Button>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
};
export default LivePollPage;
