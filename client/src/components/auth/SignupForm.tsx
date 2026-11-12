import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Alert } from '../common/Alert';
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

  const [validationErrors, setValidationErrors] = useState<{
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    agreeTerms?: string;
  }>({});

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const calculatePasswordStrength = (pass: string) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    return score; // 0 to 4
  };

  const strength = calculatePasswordStrength(formData.password);

  const getStrengthLabel = () => {
    switch (strength) {
      case 1:
        return { label: 'Weak', color: 'bg-rose-500', text: 'text-rose-400' };
      case 2:
        return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
      case 3:
        return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-400' };
      case 4:
        return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
      default:
        return { label: '', color: 'bg-slate-800', text: 'text-slate-500' };
    }
  };

  const validate = (): boolean => {
    const errors: typeof validationErrors = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.trim().length > 45) {
      errors.firstName = 'First name must be under 45 characters';
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.trim().length > 45) {
      errors.lastName = 'Last name must be under 45 characters';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    } else if (formData.password.length > 66) {
      errors.password = 'Password must be under 66 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      errors.agreeTerms = 'Please agree to the Terms & Privacy Policy to continue';
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
      await signup({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setSignupSuccess(true);

      // Auto sign in user after successful registration
      try {
        await signin({
          email: formData.email.trim(),
          password: formData.password,
        });
        onSuccess?.();
      } catch {
        // If auto sign-in fails, fallback to sign-in screen
        setTimeout(() => {
          onSwitchToSignin();
        }, 1500);
      }
    } catch {
      // Error handled by AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  if (signupSuccess) {
    return (
      <div className="text-center py-6 space-y-4 animate-fade-in">
        <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Account Created!</h3>
          <p className="text-sm text-slate-400">
            Welcome to PulseBoard, {formData.firstName}. Logging you in...
          </p>
        </div>
      </div>
    );
  }

  const strengthInfo = getStrengthLabel();

  return (
    <form onSubmit={handleSubmit} className="space-y-3.5 animate-fade-in" noValidate>
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-white tracking-tight">Create your account</h2>
        <p className="text-sm text-slate-400">
          Start collaborating and tracking real-time polls in minutes
        </p>
      </div>

      {authError && (
        <Alert
          type="error"
          message={authError}
          onClose={clearError}
          className="mb-3"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="First Name"
          name="firstName"
          placeholder="e.g. Rahul"
          value={formData.firstName}
          onChange={handleChange}
          error={validationErrors.firstName}
          leftIcon={<UserIcon className="w-4 h-4" />}
          disabled={isLoading}
        />
        <Input
          label="Last Name"
          name="lastName"
          placeholder="e.g. Sharma"
          value={formData.lastName}
          onChange={handleChange}
          error={validationErrors.lastName}
          leftIcon={<UserIcon className="w-4 h-4" />}
          disabled={isLoading}
        />
      </div>

      <Input
        label="Email Address"
        name="email"
        type="email"
        placeholder="rahul@example.com"
        autoComplete="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        leftIcon={<Mail className="w-4 h-4" />}
        disabled={isLoading}
      />

      <div className="space-y-1.5">
        <Input
          label="Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={validationErrors.password}
          leftIcon={<Lock className="w-4 h-4" />}
          disabled={isLoading}
        />

        {/* Password Strength Meter */}
        {formData.password && (
          <div className="space-y-1 pt-1 animate-fade-in">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Password strength:</span>
              <span className={`font-semibold ${strengthInfo.text}`}>{strengthInfo.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`rounded-full transition-colors duration-300 ${
                    step <= strength ? strengthInfo.color : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Input
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={validationErrors.confirmPassword}
        leftIcon={<Lock className="w-4 h-4" />}
        disabled={isLoading}
      />

      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => {
              setAgreeTerms(e.target.checked);
              if (validationErrors.agreeTerms) {
                setValidationErrors((prev) => ({ ...prev, agreeTerms: undefined }));
              }
            }}
            className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/20 focus:ring-offset-0 focus:ring-1"
          />
          <span className="text-xs text-slate-400 leading-snug">
            I agree to the{' '}
            <span className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer">
              Terms of Service
            </span>{' '}
            and{' '}
            <span className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer">
              Privacy Policy
            </span>
          </span>
        </label>
        {validationErrors.agreeTerms && (
          <p className="text-xs text-rose-400 mt-1">{validationErrors.agreeTerms}</p>
        )}
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

      <div className="text-center pt-1">
        <p className="text-xs text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignin}
            className="font-semibold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors focus:outline-none"
          >
            Sign in
          </button>
        </p>
      </div>
    </form>
  );
};

