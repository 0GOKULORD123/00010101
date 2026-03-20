import { AIBackground } from '../components/AIBackground';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { LiveTradingSimulation } from '../components/LiveTradingSimulation';
import { PricingTiers } from '../components/PricingTiers';
import { LiveActivityFeed } from '../components/LiveActivityFeed';
import { LegalSection } from '../components/LegalSection';
import { Footer } from '../components/Footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <AIBackground />
      <Header />
      <main className="relative">
        <Hero />
        <HowItWorks />
        <LiveTradingSimulation />
        <PricingTiers />
        <LiveActivityFeed />
        <LegalSection />
      </main>
      <Footer />
    </div>
  );
}