import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  User, 
  Lock, 
  ArrowRight, 
  Check, 
  Zap, 
  Sparkles, 
  Wallet,
  Copy,
  AlertCircle,
  Loader2,
  Cpu,
} from 'lucide-react';
import { toast } from 'sonner';
import { createPendingUser } from '../contexts/AuthContext';

interface Tier {
  id: string;
  name: string;
  amount: string;
}

interface Props {
  tier: Tier;
  onClose: () => void;
}

interface WalletAddress {
  id: string;
  address: string;
  addedAt: string;
}

const grokVersions = [
  {
    id: 'grok-1.0',
    name: 'Grok 1.0',
    description: 'Stable and reliable trading algorithm',
    badge: null,
  },
  {
    id: 'grok-beta-2.0',
    name: 'Grok Beta 2.0',
    description: 'Enhanced performance with advanced features',
    badge: 'BETA',
  },
  {
    id: 'grok-trader-2.5',
    name: 'Grok Trader 2.5',
    description: 'Latest AI model with maximum profitability',
    badge: 'RECOMMENDED',
    recommended: true,
  },
];

export function SignupFlow({ tier, onClose }: Props) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('grok-trader-2.5');
  const [walletAddress, setWalletAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);

  // Load wallet when generation is complete
  useEffect(() => {
    if (step === 4 && !accountCreated) {
      const storedWallets = localStorage.getItem('admin_wallets');
      
      if (storedWallets) {
        const wallets: WalletAddress[] = JSON.parse(storedWallets);
        
        if (wallets.length > 0) {
          const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
          setWalletAddress(randomWallet.address);
          
          // Create pending user account
          try {
            const selectedVersionName = grokVersions.find(v => v.id === selectedVersion)?.name || 'Grok 1.0';
            
            createPendingUser({
              username: username,
              password: password,
              grokVersion: selectedVersionName,
              tier: tier.name,
              tierAmount: tier.amount,
              walletAddress: randomWallet.address,
            });
            
            setAccountCreated(true);
            toast.success('Account created! Pending admin activation');
          } catch (error: any) {
            toast.error(error.message || 'Failed to create account');
            setStep(1); // Go back to step 1 if username exists
          }
        } else {
          setWalletAddress('No wallet addresses configured. Please contact admin.');
        }
      } else {
        setWalletAddress('No wallet addresses configured. Please contact admin.');
      }
    }
  }, [step, accountCreated, username, password, selectedVersion, tier]);

  const handleStep1Next = () => {
    if (!username.trim()) {
      toast.error('Please enter a username');
      return;
    }
    if (!password) {
      toast.error('Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setStep(2);
  };

  const handleStep2Next = () => {
    if (!selectedVersion) {
      toast.error('Please select a Grok version');
      return;
    }
    setStep(3);
    setIsGenerating(true);
    
    // Simulate account generation with animation
    setTimeout(() => {
      setIsGenerating(false);
      setStep(4);
    }, 4000);
  };

  const handleCopy = () => {
    if (walletAddress.includes('No wallet')) {
      toast.error('No valid wallet address to copy');
      return;
    }
    
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    toast.success('Wallet address copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-black border border-white/20 backdrop-blur-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all z-10"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Progress indicator */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === 1 ? 'w-8' : 'w-8'
                } ${
                  step >= s ? 'bg-green-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-xs sm:text-sm text-white/60">
            Step {step} of 4
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* Step 1: Account Details */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Cpu className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Create Your Account</h2>
                </div>
                <p className="text-sm sm:text-base text-white/60">
                  Selected: <span className="text-white font-bold">{tier.name}</span> - {tier.amount}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Username */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm text-white/60 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:border-green-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={handleStep1Next}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-black hover:bg-green-400 rounded-lg font-medium transition-all text-sm sm:text-base"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          {/* Step 2: Select Grok Version */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Header */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">Select Grok Version</h2>
                </div>
                <p className="text-sm sm:text-base text-white/60">
                  Choose the AI trading algorithm for your account
                </p>
              </div>

              {/* Version cards */}
              <div className="space-y-3">
                {grokVersions.map((version) => (
                  <motion.button
                    key={version.id}
                    onClick={() => setSelectedVersion(version.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 sm:p-5 rounded-xl border-2 transition-all text-left relative ${
                      selectedVersion === version.id
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20'
                    }`}
                  >
                    {/* Badge */}
                    {version.badge && (
                      <div className={`absolute top-3 right-3 px-2 py-1 rounded text-[10px] font-bold ${
                        version.recommended
                          ? 'bg-green-500 text-black'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {version.badge}
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      {/* Radio */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedVersion === version.id
                          ? 'border-green-500 bg-green-500'
                          : 'border-white/30'
                      }`}>
                        {selectedVersion === version.id && (
                          <div className="w-2 h-2 rounded-full bg-black" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-12">
                        <h3 className="text-white font-bold text-base sm:text-lg mb-1">
                          {version.name}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm">
                          {version.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
                >
                  Back
                </button>
                <button
                  onClick={handleStep2Next}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-500 text-black hover:bg-green-400 rounded-lg font-medium transition-all text-sm sm:text-base"
                >
                  Generate Agent
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Generating Account */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="py-12 sm:py-16"
            >
              <div className="text-center">
                {/* Animated Icon */}
                <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32 mb-6">
                  {/* Outer spinning ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border-4 border-green-500/20 border-t-green-500"
                  />
                  
                  {/* Inner spinning ring */}
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-3 rounded-full border-4 border-green-500/20 border-b-green-500"
                  />
                  
                  {/* Center icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Cpu className="w-12 h-12 sm:w-16 sm:h-16 text-green-500" />
                  </motion.div>
                </div>

                {/* Text */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Generating Your GROK Agent
                </h2>
                <p className="text-sm sm:text-base text-white/60 mb-6">
                  Please wait while we create your trading account...
                </p>

                {/* Loading steps */}
                <div className="max-w-md mx-auto space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-white text-sm">Initializing AI algorithm...</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-white text-sm">Configuring trading parameters...</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2.5 }}
                    className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                  >
                    <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
                    <span className="text-white text-sm">Generating wallet address...</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Fund Wallet */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {/* Success header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                </motion.div>
                
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Agent Created Successfully!
                </h2>
                <p className="text-sm sm:text-base text-white/60">
                  Your {grokVersions.find(v => v.id === selectedVersion)?.name} trading agent is ready
                </p>
              </div>

              {/* Account details */}
              <div className="p-4 sm:p-5 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Username</span>
                  <span className="text-white font-medium">{username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Agent Version</span>
                  <span className="text-green-500 font-medium">
                    {grokVersions.find(v => v.id === selectedVersion)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Investment Tier</span>
                  <span className="text-white font-medium">{tier.name}</span>
                </div>
              </div>

              {/* Fund wallet section */}
              <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30">
                <div className="flex items-center gap-3 mb-4">
                  <Wallet className="w-6 h-6 text-green-500" />
                  <h3 className="text-lg sm:text-xl font-bold text-white">Fund Your Agent Wallet</h3>
                </div>

                <p className="text-sm sm:text-base text-white/60 mb-4">
                  Deposit <span className="text-white font-bold">{tier.amount}</span> to activate your trading account
                </p>

                {/* Wallet address */}
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm text-white/60 mb-2">Agent Wallet Address</label>
                  <div className="relative">
                    <div className="p-3 sm:p-4 pr-12 rounded-lg bg-black/40 border border-white/10 break-all">
                      <code className={`text-xs sm:text-sm font-mono ${
                        walletAddress.includes('No wallet') ? 'text-red-400' : 'text-white'
                      }`}>
                        {walletAddress}
                      </code>
                    </div>
                    <button
                      onClick={handleCopy}
                      disabled={walletAddress.includes('No wallet')}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
                        walletAddress.includes('No wallet')
                          ? 'bg-white/5 cursor-not-allowed'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {copied ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      )}
                    </button>
                  </div>
                  {/* ETH Network Notice */}
                  {!walletAddress.includes('No wallet') && (
                    <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
                      <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0" />
                      <p className="text-blue-400 text-xs sm:text-sm font-medium">
                        This is an ETH address. Use ETH network.
                      </p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                {!walletAddress.includes('No wallet') && (
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">Transfer exactly {tier.amount} to this address</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">Your account will be activated within 24 hours</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs sm:text-sm">
                      <Sparkles className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-white/70">Your account will be automatically activated. Login with your registered username and password after activation</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Warning */}
              {walletAddress.includes('No wallet') ? (
                <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-red-500 font-medium text-xs sm:text-sm mb-1">Configuration Required</p>
                      <p className="text-white/70 text-xs">
                        The administrator needs to add wallet addresses before deposits can be accepted.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-yellow-500 font-medium text-xs sm:text-sm mb-1">Important</p>
                      <p className="text-white/70 text-xs">
                        Only send cryptocurrency to this address. Sending the wrong amount or currency may result in loss of funds.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCopy}
                  disabled={walletAddress.includes('No wallet')}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    walletAddress.includes('No wallet')
                      ? 'bg-white/5 text-white/40 cursor-not-allowed'
                      : 'bg-green-500 text-black hover:bg-green-400'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-5 h-5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-5 h-5" />
                      Copy Address
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
                >
                  Done
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}