import React from 'react';
import { BrandLogo } from '../common/BrandLogo';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-900 bg-[#05070c] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-10">
          {/* Logo & Info column */}
          <div className="col-span-2 space-y-4">
            <BrandLogo size="sm" />
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              The high-performance real-time audience engagement platform. Host zero-latency polls, live quizzes, and interactive votes with instant WebSocket sync.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Systems Operational &bull; Redis Edge Live</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Product
            </h4>
            <ul className="space-y-2">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="#demo" className="hover:text-white transition-colors">Live Simulator</a></li>
              <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-white transition-colors">Social Proof</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Developers
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">REST API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">WebSocket Gateway</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Redis Cluster</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Model</a></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
              Compliance
            </h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">GDPR Transparency</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Settings</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>&copy; {currentYear} PulseBoard Inc. Built with React & TypeScript.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white transition-colors">Status</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

