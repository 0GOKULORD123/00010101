import { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Trophy, Crown, Rocket, Star } from 'lucide-react';
import { SignupFlow } from './SignupFlow';

interface Tier {
  id: string;
  name: string;
  amount: string;
  icon: any;
  features: string[];
  highlight?: boolean;
  tesla?: boolean;
}

const tiers: Tier[] = [
  {
    id: 'rookie',
    name: 'Rookie',
    amount: '$50,000',
    icon: Star,
    features: [
      'Automated AI Trading',
      'Real-time Market Analysis',
      '24/7 Portfolio Monitoring',
      'Profit Withdrawal Anytime',
      'Risk Management System',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    amount: '$100,000',
    icon: Rocket,
    features: [
      'Everything in Rookie',
      'Priority Trading Execution',
      'Advanced AI Strategies',
      'Dedicated Support Channel',
      'Monthly Performance Reports',
    ],
    highlight: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    amount: '$500,000',
    icon: Trophy,
    features: [
      'Everything in Pro',
      'VIP Trading Algorithms',
      'Personal Account Manager',
      'Exclusive Market Insights',
      'Custom Trading Parameters',
    ],
  },
  {
    id: 'ultra',
    name: 'Ultra',
    amount: '$800,000',
    icon: Crown,
    features: [
      'Everything in Elite',
      'Ultra-High Frequency Trading',
      'Private Trading Signals',
      'Priority Profit Distribution',
      'White Glove Service',
    ],
  },
  {
    id: 'legend',
    name: 'Legend',
    amount: '$1,000,000',
    icon: Sparkles,
    features: [
      'Everything in Ultra',
      'Tesla Membership Included',
      'Institutional-Grade AI',
      'First Access to New Features',
      'Concierge Support 24/7',
    ],
    tesla: true,
  },
];

export function PricingTiers() {
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);

  return (
    <>
      <section id="pricing" className="relative py-12 sm:py-16 md:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
              Choose Your Investment Tier
            </h2>
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
              Select the plan that matches your investment goals. All tiers include full AI automation.
            </p>
          </motion.div>

          {/* Tiers Grid - Responsive */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
            {tiers.map((tier, index) => {
              const Icon = tier.icon;
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Highlight badge */}
                  {tier.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-2 sm:px-3 py-1 bg-green-500 text-black text-[10px] sm:text-xs font-bold rounded-full">
                        POPULAR
                      </div>
                    </div>
                  )}

                  {/* Tesla badge */}
                  {tier.tesla && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <div className="px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black text-[10px] sm:text-xs font-bold rounded-full whitespace-nowrap">
                        🚗 TESLA INCLUDED
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full p-5 sm:p-6 md:p-8 rounded-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                      tier.highlight
                        ? 'bg-white/10 border-green-500/50 shadow-lg shadow-green-500/20'
                        : tier.tesla
                        ? 'bg-white/10 border-yellow-500/50 shadow-lg shadow-yellow-500/20'
                        : 'bg-white/5 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {/* Icon */}
                    <div className="mb-3 sm:mb-4">
                      <Icon className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-500" />
                    </div>

                    {/* Tier name */}
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      {tier.name}
                    </h3>

                    {/* Amount */}
                    <div className="mb-4 sm:mb-6">
                      <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                        {tier.amount}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-white/70">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <button
                      onClick={() => setSelectedTier(tier)}
                      className={`w-full py-2.5 sm:py-3 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                        tier.highlight || tier.tesla
                          ? 'bg-green-500 text-black hover:bg-green-400'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      Select Tier
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Disclaimer */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-xs sm:text-sm text-white/40 mt-6 sm:mt-8 max-w-3xl mx-auto px-4"
          >
            All investments carry risk. Past performance does not guarantee future results. 
            Please review our Risk Disclosure before proceeding.
          </motion.p>
        </div>
      </section>

      {/* Wallet Modal */}
      {selectedTier && (
        <SignupFlow
          tier={selectedTier}
          onClose={() => setSelectedTier(null)}
        />
      )}
    </>
  );
}