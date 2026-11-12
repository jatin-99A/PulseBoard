import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

interface AlertProps {
  type?: 'error' | 'success' | 'info';
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'error',
  message,
  onClose,
  className = '',
}) => {
  if (!message) return null;

  const styles = {
    error: {
      bg: 'bg-rose-950/40 border-rose-800/60 text-rose-200',
      icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    },
    success: {
      bg: 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    },
    info: {
      bg: 'bg-sky-950/40 border-sky-800/60 text-sky-200',
      icon: <AlertCircle className="w-5 h-5 text-sky-400 shrink-0" />,
    },
  };

  const current = styles[type];

  return (
    <div
      className={`relative flex items-start gap-3 p-3.5 rounded-xl border text-sm backdrop-blur-sm shadow-md animate-fade-in ${current.bg} ${className}`}
      role="alert"
    >
      <div className="pt-0.5">{current.icon}</div>
      <div className="flex-1 font-medium leading-relaxed pr-2 break-words">
        {message}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
          aria-label="Dismiss message"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

