import React, { useState } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { useAuth } from '../../context/AuthContext';
import type { SigninInput } from '../../types/auth';

interface SigninFormProps {
  onSwitchToSignup: () => void;
  onSuccess?: () => void;
}

export const SigninForm: React.FC<SigninFormProps> = ({
  onSwitchToSignup,
  onSuccess,
}) => {
  const { signin, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<SigninInput>({
    email: '',
    password: '',
  });

  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const validate = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (validationErrors[name as keyof typeof validationErrors]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (authError) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    try {
      await signin(formData);
      onSuccess?.();
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in" noValidate>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Welcome back</h2>
        <p className="text-sm text-slate-400">
          Enter your credentials to access your PulseBoard workspace
        </p>
      </div>

      {authError && (
        <Alert
          type="error"
          message={authError}
          onClose={clearError}
          className="mb-4"
        />
      )}

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="you@company.com"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        leftIcon={<Mail className="w-4 h-4" />}
        disabled={isLoading}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="••••••••"
        autoComplete="current-password"
        value={formData.password}
        onChange={handleChange}
        error={validationErrors.password}
        leftIcon={<Lock className="w-4 h-4" />}
        disabled={isLoading}
        rightAction={
          <a
            href="#forgot-password"
            onClick={(e) => {
              e.preventDefault();
              alert('Password reset link has been dispatched to your email.');
            }}
            className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Forgot password?
          </a>
        }
      />

      <div className="flex items-center justify-between pt-1">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0 focus:ring-1"
          />
          <span className="text-xs text-slate-400">Remember this device</span>
        </label>
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full font-semibold shadow-indigo-600/30"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Sign In
      </Button>

      <div className="text-center pt-2">
        <p className="text-xs text-slate-400">
          Don't have an account yet?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors focus:outline-none"
          >
            Create an account
          </button>
        </p>
      </div>
    </form>
  );
};

