import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Trade {
  id: number;
  type: 'buy' | 'sell';
  amount: string;
  profit?: string;
  crypto: string;
  timestamp: Date;
}

const cryptos = ['BTC', 'ETH', 'SOL', 'AVAX', 'MATIC', 'BNB', 'ADA', 'DOT'];

export function LiveTradingSimulation() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const generateTrade = () => {
      const type = Math.random() > 0.3 ? 'buy' : 'sell';
      const amount = (Math.random() * 100000 + 10000).toFixed(0);
      const profit = type === 'sell' ? (Math.random() * 50000 + 5000).toFixed(0) : undefined;
      const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];

      const newTrade: Trade = {
        id: Date.now(),
        type,
        amount,
        profit,
        crypto,
        timestamp: new Date(),
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 4)]);
    };

    // Generate initial trades
    for (let i = 0; i < 3; i++) {
      setTimeout(generateTrade, i * 1000);
    }

    // Generate new trade every 4-8 seconds
    const interval = setInterval(() => {
      generateTrade();
    }, Math.random() * 4000 + 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-12 sm:py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Live AI Trading Activity
          </h2>
          <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
            Watch GROK AI execute trades in real-time across multiple cryptocurrency markets
          </p>
        </motion.div>

        {/* Trading Feed */}
        <div className="max-w-3xl mx-auto">
          <div className="relative p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            {/* Live indicator */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs sm:text-sm text-white/60">Live Trading Feed</span>
            </div>

            {/* Trades list */}
            <div className="space-y-2 sm:space-y-3">
              <AnimatePresence mode="popLayout">
                {trades.map((trade) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.95 }}
                    className={`p-3 sm:p-4 rounded-xl backdrop-blur-sm border ${
                      trade.type === 'buy'
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        {trade.type === 'buy' ? (
                          <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
                        ) : (
                          <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-white font-bold uppercase text-xs sm:text-sm">
                              {trade.type === 'buy' ? 'BUY' : 'SELL'}
                            </span>
                            <span className="text-white/60 text-xs sm:text-sm">{trade.crypto}</span>
                          </div>
                          <div className="text-[10px] sm:text-xs text-white/40 truncate">
                            {trade.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-white font-bold text-xs sm:text-sm">
                          ${parseInt(trade.amount).toLocaleString()}
                        </div>
                        {trade.profit && (
                          <div className="text-green-500 text-[10px] sm:text-xs">
                            +${parseInt(trade.profit).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {trades.length === 0 && (
                <div className="text-center py-8 text-white/40 text-sm">
                  Waiting for trades...
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">24/7</div>
                <div className="text-[10px] sm:text-xs text-white/60">Active Trading</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-green-500">98.7%</div>
                <div className="text-[10px] sm:text-xs text-white/60">Win Rate</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white">$2.4M</div>
                <div className="text-[10px] sm:text-xs text-white/60">Daily Volume</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}