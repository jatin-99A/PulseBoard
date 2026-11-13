import React from 'react';
import { Navbar } from '../components/home/Navbar';
import { HeroSection } from '../components/home/HeroSection';
import { LiveStatsSection } from '../components/home/LiveStatsSection';
import { InteractiveDemoSection } from '../components/home/InteractiveDemoSection';
import { FeaturesSection } from '../components/home/FeaturesSection';
import { HowItWorksSection } from '../components/home/HowItWorksSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { CtaBannerSection } from '../components/home/CtaBannerSection';
import { Footer } from '../components/home/Footer';

interface HomePageProps {
  onNavigateAuth: (mode?: 'signin' | 'signup') => void;
  onNavigateDashboard: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateAuth,
  onNavigateDashboard,
}) => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Navbar
        onNavigateAuth={onNavigateAuth}
        onNavigateDashboard={onNavigateDashboard}
      />

      <main className="flex-1">
        <HeroSection onGetStarted={() => onNavigateAuth('signup')} />
        <LiveStatsSection />
        <InteractiveDemoSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaBannerSection onGetStarted={() => onNavigateAuth('signup')} />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;

