import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AnimatedProfitProps {
  baseValue: number;
  isEnabled: boolean;
}

export function AnimatedProfit({ baseValue, isEnabled }: AnimatedProfitProps) {
  const [currentValue, setCurrentValue] = useState(baseValue);
  const [previousValue, setPreviousValue] = useState(baseValue);
  const [trend, setTrend] = useState<'up' | 'down' | 'neutral'>('neutral');

  useEffect(() => {
    if (!isEnabled) {
      setCurrentValue(baseValue);
      setPreviousValue(baseValue);
      setTrend('neutral');
      return;
    }

    const interval = setInterval(() => {
      setPreviousValue(currentValue);
      
      // Random fluctuation between -5% and +8%
      const changePercent = (Math.random() * 0.13 - 0.05);
      const change = baseValue * changePercent;
      const newValue = Math.max(0, currentValue + change);
      
      setCurrentValue(newValue);
      
      if (newValue > currentValue) {
        setTrend('up');
      } else if (newValue < currentValue) {
        setTrend('down');
      } else {
        setTrend('neutral');
      }
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [isEnabled, currentValue, baseValue]);

  const difference = currentValue - previousValue;
  const isIncreasing = difference > 0;
  const isDecreasing = difference < 0;

  return (
    <div className="relative">
      <motion.div
        key={currentValue}
        initial={{ scale: 1 }}
        animate={{ 
          scale: isEnabled ? [1, 1.05, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`text-2xl sm:text-3xl font-bold transition-colors duration-500 ${
          !isEnabled 
            ? 'text-green-500'
            : isIncreasing 
            ? 'text-green-500' 
            : isDecreasing 
            ? 'text-red-500' 
            : 'text-green-500'
        }`}
      >
        +${Math.round(currentValue).toLocaleString()}
      </motion.div>

      <AnimatePresence>
        {isEnabled && difference !== 0 && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: -10 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className={`absolute -top-6 left-0 flex items-center gap-1 text-sm font-medium ${
              isIncreasing ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {isIncreasing ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>
              {isIncreasing ? '+' : ''}${Math.abs(Math.round(difference)).toLocaleString()}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
