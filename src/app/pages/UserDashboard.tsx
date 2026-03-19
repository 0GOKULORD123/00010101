import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cpu,
  LogOut,
  Wallet,
  TrendingUp,
  Activity,
  Lock,
  AlertTriangle,
  ArrowDownCircle,
  Calendar,
  TrendingDown,
  DollarSign,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AnimatedProfit } from '../components/AnimatedProfit';

interface Trade {
  id: number;
  type: 'buy' | 'sell';
  amount: string;
  profit?: string;
  crypto: string;
  timestamp: Date;
  price: string;
}

const cryptos = [
  { symbol: 'BTC', name: 'Bitcoin', color: '#F7931A' },
  { symbol: 'ETH', name: 'Ethereum', color: '#627EEA' },
  { symbol: 'SOL', name: 'Solana', color: '#14F195' },
  { symbol: 'AVAX', name: 'Avalanche', color: '#E84142' },
  { symbol: 'MATIC', name: 'Polygon', color: '#8247E5' },
];

export function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime] = useState(new Date());
  const [chartData, setChartData] = useState<any[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);

  // Check if user is logged in and is a regular user
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  // Generate simulated trades
  useEffect(() => {
    if (!user || user.role === 'admin') return;

    const generateTrade = () => {
      const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = (Math.random() * 50000 + 10000).toFixed(0);
      const profit = type === 'sell' ? (Math.random() * 5000 + 1000).toFixed(0) : undefined;
      const price = (Math.random() * 100000 + 10000).toFixed(2);

      const newTrade: Trade = {
        id: Date.now() + Math.random(),
        type,
        amount,
        profit,
        crypto: crypto.symbol,
        timestamp: new Date(),
        price,
      };

      setTrades((prev) => [newTrade, ...prev.slice(0, 14)]); // Keep last 15 trades
    };

    // Generate initial trades
    const initialTrades = Array.from({ length: 8 }, (_, i) => {
      const crypto = cryptos[Math.floor(Math.random() * cryptos.length)];
      const type = Math.random() > 0.5 ? 'buy' : 'sell';
      const amount = (Math.random() * 50000 + 10000).toFixed(0);
      const profit = type === 'sell' ? (Math.random() * 5000 + 1000).toFixed(0) : undefined;
      const price = (Math.random() * 100000 + 10000).toFixed(2);

      return {
        id: Date.now() + i,
        type,
        amount,
        profit,
        crypto: crypto.symbol,
        timestamp: new Date(Date.now() - i * 30000),
        price,
      };
    });

    setTrades(initialTrades);

    // Generate new trade every 3-8 seconds
    const generateNewTrade = () => {
      const delay = Math.random() * 5000 + 3000;
      setTimeout(() => {
        generateTrade();
        generateNewTrade();
      }, delay);
    };

    generateNewTrade();
  }, [user]);

  // Generate chart data
  useEffect(() => {
    const generateChartData = () => {
      const data = [];
      const now = Date.now();
      const baseProfit = user?.currentEarnings || 25000;
      
      for (let i = 20; i >= 0; i--) {
        const time = new Date(now - i * 60000); // 1 minute intervals
        const variation = Math.random() * 2000 - 1000;
        const profit = Math.max(0, baseProfit - (i * 1000) + variation);
        
        data.push({
          time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          profit: Math.round(profit),
          BTC: Math.round(profit * 0.35),
          ETH: Math.round(profit * 0.25),
          SOL: Math.round(profit * 0.20),
          AVAX: Math.round(profit * 0.12),
          MATIC: Math.round(profit * 0.08),
        });
      }
      
      setChartData(data);
    };

    generateChartData();

    // Update chart every 30 seconds
    const interval = setInterval(generateChartData, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleWithdraw = () => {
    toast.error('Withdrawal is locked until trading period ends');
  };

  if (!user || user.role === 'admin') {
    return null;
  }

  const tradingPeriodEnd = new Date(user.tradingPeriodEnd);
  const daysRemaining = Math.ceil((tradingPeriodEnd.getTime() - currentTime.getTime()) / (1000 * 60 * 60 * 24));
  const isWithdrawalAvailable = daysRemaining <= 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Cpu className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white" />
                <div className="absolute -top-1 -right-1 bg-green-500 text-black text-[7px] sm:text-[8px] px-1 rounded font-bold">
                  BETA
                </div>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-tight">
                GROK AI
              </span>
            </div>

            {/* User info */}
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden sm:block text-right">
                <div className="text-xs sm:text-sm text-white/60">Welcome back,</div>
                <div className="text-sm sm:text-base text-white font-medium truncate max-w-[120px]">{user.username}</div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all text-sm"
              >
                <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Page title */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">Trading Dashboard</h1>
            <p className="text-sm sm:text-base text-white/60">Monitor your AI-powered crypto trading performance</p>
          </div>

          {/* Balance card with lock and withdraw button */}
          <div className="mb-6 sm:mb-8">
            <div className="relative p-5 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-500/5 backdrop-blur-xl border border-green-500/30">
              <div className="flex flex-col gap-4 sm:gap-6 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-white/60 text-xs sm:text-sm">Total Balance</span>
                  </div>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1">
                    ${user.balance.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-green-500">
                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span className="text-xs sm:text-sm">
                      +${user.currentEarnings.toLocaleString()} earnings
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                    <span className="text-yellow-500 text-xs sm:text-sm font-medium">Locked</span>
                  </div>

                  {/* Withdraw Button */}
                  <button
                    onClick={handleWithdraw}
                    disabled={!isWithdrawalAvailable}
                    className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all relative text-sm sm:text-base ${
                      isWithdrawalAvailable
                        ? 'bg-green-500 text-black hover:bg-green-400'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {!isWithdrawalAvailable && (
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <p className="text-yellow-500 font-medium mb-1">Active Trading Period</p>
                  <p className="text-white/70">
                    {isWithdrawalAvailable ? (
                      <span className="text-green-500 font-medium">
                        Withdrawal is now available! You can withdraw your funds.
                      </span>
                    ) : (
                      <>
                        Withdrawal available after trading period ends. <br />
                        <span className="text-white font-medium">{daysRemaining} days remaining</span> until {tradingPeriodEnd.toLocaleDateString()}
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
            {/* Initial Deposit */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <ArrowDownCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-[10px] sm:text-xs">Initial Deposit</span>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                ${user.depositAmount.toLocaleString()}
              </div>
            </div>

            {/* Current Earnings */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-[10px] sm:text-xs">Current Earnings</span>
              </div>
              <AnimatedProfit 
                baseValue={user.currentEarnings} 
                isEnabled={user.profitAnimationEnabled} 
              />
            </div>

            {/* Active Trades */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-[10px] sm:text-xs">Active Trades</span>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
                {user.activeTrades}
              </div>
            </div>

            {/* Trading Period */}
            <div className="p-4 sm:p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                <span className="text-white/60 text-[10px] sm:text-xs">Period Ends</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-white">
                {tradingPeriodEnd.toLocaleDateString()}
              </div>
              <div className="text-[10px] sm:text-sm text-white/60 mt-1">
                {isWithdrawalAvailable ? 'Completed' : `${daysRemaining} days left`}
              </div>
            </div>
          </div>

          {/* Profit Chart */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-6 md:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-1">Profit Performance</h2>
                <p className="text-xs sm:text-sm text-white/60">Real-time profit tracking by cryptocurrency</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs sm:text-sm text-white/60">Live</span>
              </div>
            </div>

            <div className="h-[250px] sm:h-[300px] md:h-[400px] -mx-2 sm:mx-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '10px' }}
                    tick={{ fontSize: 10 }}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '10px' }}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(0,0,0,0.9)', 
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px'
                    }}
                    formatter={(value: any) => `$${value.toLocaleString()}`}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {cryptos.map((crypto) => (
                    <Line
                      key={crypto.symbol}
                      type="monotone"
                      dataKey={crypto.symbol}
                      stroke={crypto.color}
                      strokeWidth={2}
                      dot={false}
                      name={crypto.name}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Two column layout for trades and deposits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Live Trading Feed */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Live Trading Feed</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-sm text-white/60">Live</span>
                </div>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                <AnimatePresence mode="popLayout">
                  {trades.map((trade) => (
                    <motion.div
                      key={trade.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 20, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-xl backdrop-blur-sm border ${
                        trade.type === 'buy'
                          ? 'bg-blue-500/10 border-blue-500/30'
                          : 'bg-green-500/10 border-green-500/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {trade.type === 'buy' ? (
                            <TrendingUp className="w-5 h-5 text-blue-400" />
                          ) : (
                            <TrendingDown className="w-5 h-5 text-green-500" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-bold uppercase text-sm">
                                {trade.type === 'buy' ? 'BUY' : 'SELL'}
                              </span>
                              <span className="text-white/80 font-medium">{trade.crypto}</span>
                            </div>
                            <div className="text-xs text-white/40">
                              {trade.timestamp.toLocaleTimeString()} • ${trade.price}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold text-sm">
                            ${parseInt(trade.amount).toLocaleString()}
                          </div>
                          {trade.profit && (
                            <div className="text-green-500 text-xs">
                              +${parseInt(trade.profit).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {trades.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    Waiting for trades...
                  </div>
                )}
              </div>
            </div>

            {/* Recent deposits */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6">Recent Deposits</h2>
              
              <div className="space-y-4">
                {user.recentDeposits.map((deposit) => (
                  <div
                    key={deposit.id}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10"
                  >
                    <div>
                      <div className="text-white font-medium mb-1">
                        ${deposit.amount.toLocaleString()}
                      </div>
                      <div className="text-sm text-white/60">
                        {new Date(deposit.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-lg">
                      <span className="text-green-500 text-sm font-medium">
                        {deposit.status}
                      </span>
                    </div>
                  </div>
                ))}

                {user.recentDeposits.length === 0 && (
                  <div className="text-center py-8 text-white/40">
                    No deposits yet
                  </div>
                )}
              </div>

              {/* Trading activity notice */}
              <div className="mt-6 p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="flex items-start gap-3">
                  <Activity className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-white font-bold text-sm mb-1">AI Trading Active</h3>
                    <p className="text-white/70 text-xs">
                      GROK AI is actively trading 24/7. All funds remain secure until withdrawal period.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}