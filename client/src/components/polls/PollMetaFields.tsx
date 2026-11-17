import React from 'react';

interface PollMetaFieldsProps {
  title: string;
  setTitle: (val: string) => void;
  description: string;
  setDescription: (val: string) => void;
  expiryDays: number;
  setExpiryDays: (val: number) => void;
  isAnonymousAllowed: boolean;
  setIsAnonymousAllowed: (val: boolean) => void;
}

export const PollMetaFields: React.FC<PollMetaFieldsProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  expiryDays,
  setExpiryDays,
  isAnonymousAllowed,
  setIsAnonymousAllowed,
}) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300">Poll Title</label>
        <input
          type="text"
          placeholder="e.g. Next Tech Stack Preference"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500"
        />
      </div>

      <div className="space-y-1">
        <label className="text-xs font-semibold text-slate-300">Description (Optional)</label>
        <textarea
          rows={2}
          placeholder="Brief context about this poll..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-300">Expires In</label>
          <select
            value={expiryDays}
            onChange={(e) => setExpiryDays(Number(e.target.value))}
            className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 outline-none focus:border-indigo-500"
          >
            <option value={1}>1 Day</option>
            <option value={3}>3 Days</option>
            <option value={7}>7 Days (Default)</option>
            <option value={14}>14 Days</option>
            <option value={30}>30 Days</option>
          </select>
        </div>

        <div className="flex items-center sm:pt-6">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isAnonymousAllowed}
              onChange={(e) => setIsAnonymousAllowed(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
            />
            <span className="text-xs text-slate-300">Allow Anonymous Voting</span>
          </label>
        </div>
      </div>
    </div>
  );
};

