import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, SigninInput, SignupInput, SignupResponseData } from '../types/auth';
import { authApi } from '../api/auth-api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  signin: (input: SigninInput) => Promise<void>;
  signup: (input: SignupInput) => Promise<SignupResponseData>;
  signout: () => Promise<void>;
  clearError: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const STORAGE_KEY = 'pulseboard_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  // Check current session from backend on initial mount
  useEffect(() => {
    let isMounted = true;

    const checkSession = async () => {
      try {
        const response = await authApi.getMe();
        if (isMounted && response?.data) {
          setUser(response.data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        }
      } catch {
        // If /me fails (e.g. cookie expired or unauthorized), clear local stale cache
        if (isMounted) {
          setUser(null);
          localStorage.removeItem(STORAGE_KEY);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const signin = async (input: SigninInput): Promise<void> => {
    setError(null);
    try {
      const response = await authApi.signin(input);
      if (response.data?.user) {
        setUser(response.data.user);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data.user));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check credentials.';
      setError(message);
      throw err;
    }
  };

  const signup = async (input: SignupInput): Promise<SignupResponseData> => {
    setError(null);
    try {
      const response = await authApi.signup(input);
      if (!response.data) {
        throw new Error(response.message || 'Signup failed');
      }
      return response.data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Signup failed. Please try again.';
      setError(message);
      throw err;
    }
  };

  const signout = async (): Promise<void> => {
    try {
      await authApi.signout();
    } catch {
      // Ignore network errors on signout
    } finally {
      setUser(null);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    signin,
    signup,
    signout,
    clearError,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

