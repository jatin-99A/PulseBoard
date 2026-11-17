import React, { useState } from 'react';
import { Search, Plus, Radio, Inbox } from 'lucide-react';
import { Button } from '../common/Button';
import { PollCard } from './PollCard';
import type { Poll } from '../../types/polls';

interface PollListProps {
  polls: Poll[];
  isLoading: boolean;
  onCreatePoll: () => void;
  onViewDetails: (poll: Poll) => void;
  onViewAnalysis: (poll: Poll) => void;
  onDelete: (poll: Poll) => void;
  onCopyLink: (link: string) => void;
}

export const PollList: React.FC<PollListProps> = ({
  polls,
  isLoading,
  onCreatePoll,
  onViewDetails,
  onViewAnalysis,
  onDelete,
  onCopyLink,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');

  const filteredPolls = polls.filter((poll) => {
    const isExpired = !poll.isActive || new Date(poll.expiresAt).getTime() <= Date.now();
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && !isExpired) ||
      (statusFilter === 'expired' && isExpired);

    const matchesSearch =
      poll.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      poll.publicLink.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (poll.description && poll.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search polls by title or link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-900/80 border border-slate-800 p-1 rounded-xl text-xs font-semibold">
            {(['all', 'active', 'expired'] as const).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-colors ${
                  statusFilter === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={onCreatePoll}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="font-semibold shadow-indigo-600/25"
          >
            Create Poll
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-900/40 border border-slate-800/60 p-6 animate-pulse space-y-4"
            >
              <div className="h-5 bg-slate-800 rounded-md w-1/3" />
              <div className="h-6 bg-slate-800 rounded-md w-3/4" />
              <div className="h-10 bg-slate-800 rounded-md w-full" />
              <div className="h-8 bg-slate-800 rounded-md w-1/2 mt-auto" />
            </div>
          ))}
        </div>
      ) : filteredPolls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPolls.map((poll) => (
            <PollCard
              key={poll.id}
              poll={poll}
              onViewDetails={onViewDetails}
              onViewAnalysis={onViewAnalysis}
              onDelete={onDelete}
              onCopyLink={onCopyLink}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-slate-900/40 border border-slate-800/80 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400">
            {searchQuery ? <Inbox className="w-7 h-7" /> : <Radio className="w-7 h-7 text-indigo-400" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              {searchQuery ? 'No matching polls found' : 'No polls created yet'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              {searchQuery
                ? `No polls match "${searchQuery}". Try a different keyword.`
                : 'Create your first interactive poll and start collecting instant audience votes.'}
            </p>
          </div>
          {!searchQuery && (
            <Button
              variant="primary"
              size="md"
              onClick={onCreatePoll}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Your First Poll
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

