import React from 'react';

interface PasswordStrengthMeterProps {
  password: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

  const strengthMeta = [
    { label: '', color: 'bg-slate-800', text: 'text-slate-500' },
    { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' },
    { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' },
    { label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' },
    { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' },
  ][score];

  return (
    <div className="space-y-1 pt-1 animate-fade-in">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-400">Password strength:</span>
        <span className={`font-semibold ${strengthMeta.text}`}>{strengthMeta.label}</span>
      </div>
      <div className="grid grid-cols-4 gap-1.5 h-1">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`rounded-full transition-colors duration-300 ${
              step <= score ? strengthMeta.color : 'bg-slate-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

