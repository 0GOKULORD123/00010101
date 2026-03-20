import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, User, Clock } from 'lucide-react';

interface Activity {
  id: string;
  username: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  tier?: string;
  comment: string;
  timestamp: string;
  sentiment: 'positive' | 'negative' | 'neutral';
}

const tiers = ['Rookie', 'Pro', 'Elite', 'Ultra', 'Legend'];

const positiveComments = [
  "Automated trading is the future. Awesome!",
  "Best decision I've made this year!",
  "The AI is incredible, profits coming in daily!",
  "Finally, a platform that actually works!",
  "Early access was worth every penny!",
  "My portfolio doubled in 3 weeks!",
  "Grok AI never sleeps, neither do my profits!",
  "This is revolutionary technology!",
  "Can't believe the returns I'm seeing!",
  "Support team is amazing, highly recommend!",
];

const negativeComments = [
  "Deposited $50k and only profited $69k while others earn 30x more. Not satisfied.",
  "Expected better returns for this tier.",
  "Withdrawing to try a different strategy.",
  "Good platform but results vary a lot.",
  "Not as profitable as I hoped.",
  "Still waiting for the big gains everyone talks about.",
  "Decent but not life-changing yet.",
  "Taking profits out, need to reassess.",
];

const neutralComments = [
  "I'm really looking forward to the early access!",
  "Just getting started, excited to see results!",
  "Adding more funds to my account.",
  "Testing the waters with this deposit.",
  "First time user, let's see how this goes!",
  "Upgrading my tier, fingers crossed!",
  "Heard great things, time to join in!",
  "Diversifying my crypto portfolio here.",
];

const usernames = [
  "crypto_king", "hodl_master", "btc_believer", "eth_whale", "defi_degen",
  "moon_walker", "diamond_hands", "satoshi_fan", "blockchain_pro", "alt_season",
  "trading_ace", "profit_hunter", "bull_runner", "crypto_sage", "web3_wizard",
  "token_titan", "nft_collector", "dao_member", "stake_master", "yield_farmer",
  "metaverse_pioneer", "crypto_ninja", "btc_maximalist", "eth_enthusiast", "chain_surfer",
  "defi_explorer", "smart_trader", "coin_collector", "market_maker", "alpha_seeker",
  "giga_chad", "whale_watcher", "early_adopter", "moon_chaser", "gem_hunter",
  "portfolio_pro", "risk_taker", "degen_king", "leverage_lord", "options_trader",
  "futures_master", "spot_trader", "arbitrage_ace", "liquidity_pro", "staking_guru",
  "validator_node", "node_runner", "protocol_dev", "smart_contract", "blockchain_buff",
];

function generateRandomActivity(): Activity {
  const type = Math.random() > 0.5 ? 'deposit' : 'withdrawal';
  const tier = tiers[Math.floor(Math.random() * tiers.length)];
  
  let amount: number;
  let sentiment: 'positive' | 'negative' | 'neutral';
  let comment: string;
  
  if (type === 'deposit') {
    // Deposit amounts based on tier
    const tierAmounts = {
      'Rookie': [50000, 75000],
      'Pro': [100000, 150000],
      'Elite': [500000, 750000],
      'Ultra': [800000, 950000],
      'Legend': [1000000, 2000000],
    };
    const range = tierAmounts[tier as keyof typeof tierAmounts];
    amount = Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    
    // Mixed sentiment for deposits
    const rand = Math.random();
    if (rand < 0.5) {
      sentiment = 'positive';
      comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    } else if (rand < 0.8) {
      sentiment = 'neutral';
      comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
    } else {
      sentiment = 'negative';
      comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
    }
  } else {
    // Withdrawal amounts - random between $3k to $18M
    amount = Math.floor(Math.random() * (18000000 - 3000) + 3000);
    
    // Mixed sentiment for withdrawals
    const rand = Math.random();
    if (rand < 0.6) {
      sentiment = 'positive';
      comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
    } else {
      sentiment = 'negative';
      comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
    }
  }
  
  const username = usernames[Math.floor(Math.random() * usernames.length)] + Math.floor(Math.random() * 9999);
  
  // Random timestamp within last 24 hours
  const now = new Date();
  const randomMinutesAgo = Math.floor(Math.random() * 1440); // 24 hours in minutes
  const timestamp = new Date(now.getTime() - randomMinutesAgo * 60000);
  
  return {
    id: Math.random().toString(36).substr(2, 9) + Date.now(),
    username,
    type,
    amount,
    tier: type === 'deposit' ? tier : undefined,
    comment,
    timestamp: formatTimestamp(timestamp),
    sentiment,
  };
}

function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatAmount(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount.toLocaleString()}`;
}

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [visibleActivities, setVisibleActivities] = useState<Activity[]>([]);
  
  // Generate initial activities
  useEffect(() => {
    const initial = Array.from({ length: 50 }, () => generateRandomActivity());
    setActivities(initial);
    setVisibleActivities([initial[0]]);
  }, []);
  
  // Cycle through activities with smooth animations
  useEffect(() => {
    if (activities.length === 0) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % activities.length;
      
      // If we've cycled through all, generate new activities
      if (currentIndex === 0) {
        const newActivities = Array.from({ length: 50 }, () => generateRandomActivity());
        setActivities(newActivities);
      }
      
      setVisibleActivities([activities[currentIndex]]);
    }, 12000); // Change activity every 12 seconds
    
    return () => clearInterval(interval);
  }, [activities]);
  
  return (
    <section className="relative py-8 sm:py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
            Live Platform Activity
          </h2>
          <p className="text-sm sm:text-base text-white/50 max-w-xl mx-auto">
            Real-time deposits and withdrawals
          </p>
        </motion.div>
        
        {/* Live Activity Feed */}
        <div className="relative min-h-[180px] sm:min-h-[200px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            {visibleActivities.map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                <div className="w-full max-w-2xl">
                  {/* Activity Card - Compact & Clean */}
                  <div className="relative p-4 sm:p-6 rounded-xl backdrop-blur-md bg-white/5 border border-white/10 transition-all duration-300">
                    {/* Subtle Glow */}
                    <div className={`absolute inset-0 rounded-xl blur-2xl opacity-10 ${
                      activity.type === 'deposit' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    
                    <div className="relative">
                      {/* Top Row: User Info & Amount */}
                      <div className="flex items-center justify-between gap-4 mb-3">
                        {/* User Info */}
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="text-white font-medium text-xs sm:text-sm truncate">
                              @{activity.username}
                            </h4>
                            <div className="flex items-center gap-1 text-white/40 text-[10px] sm:text-xs">
                              <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                        
                        {/* Amount Badge - PROMINENT */}
                        <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg flex-shrink-0 ${
                          activity.type === 'deposit'
                            ? 'bg-green-500/20 border border-green-500/40'
                            : 'bg-blue-500/20 border border-blue-500/40'
                        }`}>
                          {activity.type === 'deposit' ? (
                            <ArrowDownRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                          )}
                          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                            {formatAmount(activity.amount)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Middle Row: Action Type */}
                      <div className="mb-3 flex items-center justify-center gap-2">
                        <span className={`text-xs sm:text-sm font-semibold ${
                          activity.type === 'deposit' ? 'text-green-500' : 'text-blue-500'
                        }`}>
                          {activity.type === 'deposit' ? '💰 DEPOSITED' : '💸 WITHDRAWN'}
                        </span>
                        {activity.tier && (
                          <>
                            <span className="text-white/20">•</span>
                            <span className="text-xs sm:text-sm text-white/40">
                              {activity.tier}
                            </span>
                          </>
                        )}
                      </div>
                      
                      {/* Bottom Row: Comment */}
                      <div className={`p-3 rounded-lg border ${
                        activity.sentiment === 'positive'
                          ? 'bg-green-500/5 border-green-500/20'
                          : activity.sentiment === 'negative'
                          ? 'bg-red-500/5 border-red-500/20'
                          : 'bg-white/5 border-white/10'
                      }`}>
                        <p className={`text-xs sm:text-sm leading-relaxed text-center italic ${
                          activity.sentiment === 'positive'
                            ? 'text-white/90'
                            : activity.sentiment === 'negative'
                            ? 'text-white/80'
                            : 'text-white/70'
                        }`}>
                          "{activity.comment}"
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Live Indicator - Minimal */}
                  <div className="flex items-center justify-center gap-1.5 mt-3">
                    <div className="relative">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      <div className="absolute inset-0 w-1.5 h-1.5 bg-green-500 rounded-full animate-ping" />
                    </div>
                    <span className="text-[10px] sm:text-xs text-white/40 font-medium uppercase tracking-wider">
                      Live
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {/* Stats Bar - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-6 sm:mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto"
        >
          <div className="p-3 sm:p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-500">$847M+</div>
            <div className="text-[10px] sm:text-xs text-white/50 mt-0.5">Volume</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-500">12.8K+</div>
            <div className="text-[10px] sm:text-xs text-white/50 mt-0.5">Traders</div>
          </div>
          <div className="p-3 sm:p-4 rounded-lg backdrop-blur-md bg-white/5 border border-white/10 text-center">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-500">24/7</div>
            <div className="text-[10px] sm:text-xs text-white/50 mt-0.5">Active</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}