import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { useAuth } from '../../context/AuthContext';
import type { SignupInput } from '../../types/auth';

interface SignupFormProps {
  onSwitchToSignin: () => void;
  onSuccess?: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({
  onSwitchToSignin,
  onSuccess,
}) => {
  const { signup, signin, error: authError, clearError } = useAuth();
  const [formData, setFormData] = useState<SignupInput & { confirmPassword: '' }>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {};
    const { firstName, lastName, email, password, confirmPassword } = formData;

    if (!firstName.trim()) nextErrors.firstName = 'First name is required';
    else if (firstName.trim().length < 2) nextErrors.firstName = 'Min 2 characters required';

    if (!lastName.trim()) nextErrors.lastName = 'Last name is required';
    else if (lastName.trim().length < 2) nextErrors.lastName = 'Min 2 characters required';

    if (!email.trim()) nextErrors.email = 'Email address is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = 'Enter a valid email';

    if (!password) nextErrors.password = 'Password is required';
    else if (password.length < 6) nextErrors.password = 'At least 6 characters required';

    if (password !== confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    if (!agreeTerms) nextErrors.agreeTerms = 'Please accept the Terms to continue';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (authError) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSignupSuccess(true);
      try {
        await signin({ email: formData.email.trim(), password: formData.password });
        onSuccess?.();
      } catch {
        setTimeout(onSwitchToSignin, 1500);
      }
    } catch {
      // AuthContext handles error display
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="text-center py-6 space-y-4 animate-fade-in">
        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Account Created!</h3>
          <p className="text-sm text-slate-400">Welcome, {formData.firstName}. Redirecting to your board...</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 animate-fade-in" noValidate>
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
        <p className="text-xs text-slate-400">Start running live real-time polls in minutes</p>
      </div>

      {authError && <Alert type="error" message={authError} onClose={clearError} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Input
          label="First Name"
          name="firstName"
          placeholder="Rahul"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
          leftIcon={<UserIcon className="w-4 h-4" />}
          disabled={isLoading}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="Sharma"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
          leftIcon={<UserIcon className="w-4 h-4" />}
          disabled={isLoading}
        />
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="rahul@example.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        leftIcon={<Mail className="w-4 h-4" />}
        disabled={isLoading}
      />

      <div className="space-y-1">
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="Min 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          disabled={isLoading}
        />
        <PasswordStrengthMeter password={formData.password} />
      </div>

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
        leftIcon={<Lock className="w-4 h-4" />}
        disabled={isLoading}
      />

      <div>
        <label className="flex items-start gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-1"
          />
          <span className="text-xs text-slate-400">
            I agree to the <span className="text-indigo-400 underline">Terms</span> and{' '}
            <span className="text-indigo-400 underline">Privacy</span>
          </span>
        </label>
        {errors.agreeTerms && <p className="text-xs text-rose-400 mt-1">{errors.agreeTerms}</p>}
      </div>

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full font-semibold shadow-indigo-600/30"
        isLoading={isLoading}
        rightIcon={<ArrowRight className="w-4 h-4" />}
      >
        Create Account
      </Button>

      <p className="text-center text-xs text-slate-400 pt-1">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignin}
          className="font-semibold text-indigo-400 hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
};
