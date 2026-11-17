import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../common/Button';
import type { Poll } from '../../types/polls';

interface DeletePollDialogProps {
  poll: Poll | null;
  isOpen: boolean;
  isLoading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeletePollDialog: React.FC<DeletePollDialogProps> = ({
  poll,
  isOpen,
  isLoading,
  onClose,
  onConfirm,
}) => {
  if (!isOpen || !poll) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Delete this poll?</h3>
            <p className="text-xs text-slate-400">This action cannot be undone.</p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
          <p className="font-semibold text-slate-200 line-clamp-1">{poll.title}</p>
          <p className="text-slate-400 font-mono text-[11px] mt-0.5">/{poll.publicLink}</p>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          All existing audience votes, responses, and questions associated with this poll will be permanently erased.
        </p>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Permanently
          </Button>
        </div>
      </div>
    </div>
  );
};

