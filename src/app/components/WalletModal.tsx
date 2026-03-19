import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Copy, Check, Wallet, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

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

export function WalletModal({ tier, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    // Load wallets from localStorage
    const storedWallets = localStorage.getItem('admin_wallets');
    
    if (storedWallets) {
      const wallets: WalletAddress[] = JSON.parse(storedWallets);
      
      if (wallets.length > 0) {
        // Select a random wallet from the list
        const randomWallet = wallets[Math.floor(Math.random() * wallets.length)];
        setWalletAddress(randomWallet.address);
      } else {
        setWalletAddress('No wallet addresses configured. Please contact admin.');
      }
    } else {
      setWalletAddress('No wallet addresses configured. Please contact admin.');
    }
  }, []);

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
        className="relative w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-black border border-white/20 backdrop-blur-xl"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>

        {/* Content */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Wallet className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
            <h2 className="text-xl sm:text-2xl font-bold text-white">Deposit Wallet</h2>
          </div>
          <p className="text-sm sm:text-base text-white/60">
            Send <span className="text-white font-bold">{tier.amount}</span> to the wallet address below
          </p>
        </div>

        {/* Wallet address */}
        <div className="mb-6">
          <label className="block text-xs sm:text-sm text-white/60 mb-2">Wallet Address</label>
          <div className="relative">
            <div className="p-3 sm:p-4 pr-12 rounded-lg bg-white/5 border border-white/10 break-all">
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
        </div>

        {/* Warning if no wallets */}
        {walletAddress.includes('No wallet') && (
          <div className="mb-6 p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-500 font-medium text-xs sm:text-sm mb-1">Configuration Required</p>
                <p className="text-white/70 text-xs">
                  The administrator needs to add wallet addresses in the admin panel before deposits can be accepted.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        {!walletAddress.includes('No wallet') && (
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                1
              </div>
              <div>
                <p className="text-white font-medium text-xs sm:text-sm mb-1">Copy the wallet address</p>
                <p className="text-white/70 text-xs">Click the copy button to save the address</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                2
              </div>
              <div>
                <p className="text-white font-medium text-xs sm:text-sm mb-1">Send your deposit</p>
                <p className="text-white/70 text-xs">Transfer exactly {tier.amount} to this address</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="w-6 h-6 rounded-full bg-green-500 text-black flex items-center justify-center font-bold text-xs flex-shrink-0">
                3
              </div>
              <div>
                <p className="text-white font-medium text-xs sm:text-sm mb-1">Wait for confirmation</p>
                <p className="text-white/70 text-xs">Your account will be activated within 24 hours</p>
              </div>
            </div>
          </div>
        )}

        {/* Warning */}
        {!walletAddress.includes('No wallet') && (
          <div className="p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-start gap-2 sm:gap-3">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-500 font-medium text-xs sm:text-sm mb-1">Important</p>
                <p className="text-white/70 text-xs">
                  Only send cryptocurrency to this address. Sending the wrong amount or wrong currency may result in loss of funds.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={handleCopy}
            disabled={walletAddress.includes('No wallet')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-sm sm:text-base ${
              walletAddress.includes('No wallet')
                ? 'bg-white/5 text-white/40 cursor-not-allowed'
                : 'bg-green-500 text-black hover:bg-green-400'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                Copy Address
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg font-medium transition-all text-sm sm:text-base"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
}