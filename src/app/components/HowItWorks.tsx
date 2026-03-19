import { motion } from 'motion/react';
import { Target, Wallet, CheckCircle, BarChart3, TrendingUp, Coins } from 'lucide-react';

const steps = [
  {
    icon: Target,
    title: 'Pick a Plan',
    description: 'Choose your investment tier based on your capital and goals',
  },
  {
    icon: Wallet,
    title: 'Wallet Generated',
    description: 'Receive your unique deposit wallet address instantly',
  },
  {
    icon: Coins,
    title: 'Deposit Funds',
    description: 'Transfer your investment amount to the provided wallet',
  },
  {
    icon: CheckCircle,
    title: 'Account Approval',
    description: 'Your trading account is created and verified automatically',
  },
  {
    icon: BarChart3,
    title: 'Automated Trading Starts',
    description: 'GROK AI begins trading 24/7 across multiple crypto markets',
  },
  {
    icon: TrendingUp,
    title: 'Cash out anytime after trading period',
    description: 'Withdraw your profits seamlessly to your personal wallet',
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            How GROK AI Works
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
            You don't do anything. GROK AI trades, monitors, and profits for you.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative h-full p-5 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-green-500/50 transition-all duration-300 hover:scale-[1.02]">
                  {/* Step number */}
                  <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-xs sm:text-sm">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className="mb-3 sm:mb-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-white/60">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs sm:text-sm text-white/80">Fully automated. Zero manual intervention required.</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}