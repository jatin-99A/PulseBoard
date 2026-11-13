import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react';

interface NavbarProps {
  onNavigateAuth: (mode?: 'signin' | 'signup') => void;
  onNavigateDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigateAuth,
  onNavigateDashboard,
}) => {
  const { isAuthenticated, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Live Demo', href: '#demo' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Reviews', href: '#testimonials' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/75 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <BrandLogo size="sm" />
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors duration-150"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <Button
              variant="primary"
              size="sm"
              onClick={onNavigateDashboard}
              leftIcon={<LayoutDashboard className="w-3.5 h-3.5" />}
            >
              <span>Dashboard ({user?.firstName})</span>
            </Button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onNavigateAuth('signin')}
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-900 transition-colors"
              >
                Sign In
              </button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => onNavigateAuth('signup')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Get Started
              </Button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-950/95 px-4 pt-3 pb-5 space-y-3 backdrop-blur-xl animate-slide-up">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 rounded-lg"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigateDashboard();
                }}
              >
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateAuth('signin');
                  }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onNavigateAuth('signup');
                  }}
                  leftIcon={<Sparkles className="w-3.5 h-3.5" />}
                >
                  Create Free Account
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

