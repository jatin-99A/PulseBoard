import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardHeader } from '../components/polls/DashboardHeader';
import { PollStatsOverview } from '../components/polls/PollStatsOverview';
import { PollList } from '../components/polls/PollList';
import { CreatePollModal } from '../components/polls/CreatePollModal';
import { PollDetailsModal } from '../components/polls/PollDetailsModal';
import { PollAnalysisModal } from '../components/polls/PollAnalysisModal';
import { DeletePollDialog } from '../components/polls/DeletePollDialog';
import { Toast } from '../components/common/Toast';
import { Button } from '../components/common/Button';
import { Plus, Sparkles } from 'lucide-react';
import { pollsApi } from '../api/polls-api';
import type { Poll } from '../types/polls';

interface DashboardPageProps {
  onNavigateHome?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigateHome }) => {
  const { user, signout } = useAuth();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [detailsPoll, setDetailsPoll] = useState<Poll | null>(null);
  const [analysisPoll, setAnalysisPoll] = useState<Poll | null>(null);
  const [deletePoll, setDeletePoll] = useState<Poll | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPolls = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await pollsApi.getAllPolls();
      if (response.data) setPolls(response.data);
    } catch {
      // Handled silently or empty state
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolls();
  }, [fetchPolls]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleViewDetails = async (poll: Poll) => {
    setDetailsPoll(poll);
    try {
      const res = await pollsApi.getSinglePoll(poll.id);
      if (res.data) setDetailsPoll(res.data);
    } catch {
      // Fallback to already present data
    }
  };

  const handleCreateSuccess = (newPoll: Poll) => {
    setIsCreateOpen(false);
    setPolls((prev) => [newPoll, ...prev]);
    setToastMessage(`Poll "${newPoll.title}" launched successfully!`);
  };

  const handleDeleteConfirm = async () => {
    if (!deletePoll) return;
    setIsDeleting(true);
    try {
      await pollsApi.deletePoll(deletePoll.id);
      setPolls((prev) => prev.filter((p) => p.id !== deletePoll.id));
      setDeletePoll(null);
      setToastMessage('Poll deleted successfully.');
    } catch {
      setToastMessage('Failed to delete poll. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <DashboardHeader
        user={user}
        onNavigateHome={onNavigateHome}
        onLogout={handleLogout}
        isLoggingOut={isLoggingOut}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-purple-950/40 border border-indigo-900/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Realtime Polls Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Create, manage, and analyze your real-time audience polls and live voting sessions.
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsCreateOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="shrink-0 font-semibold shadow-indigo-600/30"
          >
            Create New Poll
          </Button>
        </div>

        <PollStatsOverview polls={polls} />

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white tracking-tight">Your Polls</h2>
            <span className="text-xs font-semibold text-slate-400">
              {polls.length} {polls.length === 1 ? 'poll' : 'polls'} total
            </span>
          </div>

          <PollList
            polls={polls}
            isLoading={isLoading}
            onCreatePoll={() => setIsCreateOpen(true)}
            onViewDetails={handleViewDetails}
            onViewAnalysis={(poll) => setAnalysisPoll(poll)}
            onDelete={(poll) => setDeletePoll(poll)}
            onCopyLink={() => setToastMessage('Public poll link copied to clipboard!')}
          />
        </div>
      </main>

      <CreatePollModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleCreateSuccess}
      />

      <PollDetailsModal
        poll={detailsPoll}
        isOpen={!!detailsPoll}
        onClose={() => setDetailsPoll(null)}
        onOpenAnalysis={(poll) => setAnalysisPoll(poll)}
        onCopyLink={() => setToastMessage('Public poll link copied to clipboard!')}
      />

      <PollAnalysisModal
        poll={analysisPoll}
        isOpen={!!analysisPoll}
        onClose={() => setAnalysisPoll(null)}
      />

      <DeletePollDialog
        poll={deletePoll}
        isOpen={!!deletePoll}
        isLoading={isDeleting}
        onClose={() => setDeletePoll(null)}
        onConfirm={handleDeleteConfirm}
      />

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};
