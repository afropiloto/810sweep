import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, CheckCircle2, TrendingUp, Heart, Wallet } from 'lucide-react';
import { Market } from '../types';
import { CURRENCY } from '../config';

interface ClaimModalProps {
  market: Market | null;
  onClose: () => void;
  onClaimEarnings?: (amount: number) => void;
}

export function ClaimModal({ market, onClose, onClaimEarnings }: ClaimModalProps) {
  const [claimStatus, setClaimStatus] = useState<'idle' | 'claiming' | 'success'>('idle');

  if (!market) return null;

  // Creator pool value (e.g., 5% of volume)
  const poolAmount = Math.round(market.volume * 0.05);
  const creatorPool = poolAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const handleAction = (action: 'claim' | 'donate') => {
    setClaimStatus('claiming');
    setTimeout(() => {
      setClaimStatus('success');
      if (action === 'claim' && onClaimEarnings) {
        onClaimEarnings(poolAmount);
      }
      setTimeout(() => {
        setClaimStatus('idle');
        onClose();
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-md p-4"
        onClick={claimStatus === 'idle' ? onClose : undefined}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 400, mass: 0.8 }}
          className="w-full max-w-sm relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-zinc-900/90 backdrop-blur-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative z-10 p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-black text-white mb-0.5">Culture Club Claim Pool</h3>
                <p className="text-xs text-zinc-400">Are you @{market.creator.username}?</p>
              </div>
              <button 
                onClick={onClose} 
                disabled={claimStatus !== 'idle'}
                className="p-1.5 bg-white/5 rounded-full hover:bg-white/10 text-white transition-colors disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <AnimatePresence mode="wait">
              {claimStatus === 'success' ? (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-12 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-[#C8FF00]/20 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#C8FF00]" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-2">Request Submitted</h3>
                  <p className="text-sm text-zinc-400 px-4">Our AI agent is verifying your social identity. You'll be notified shortly.</p>
                </motion.div>
              ) : claimStatus === 'claiming' ? (
                <motion.div 
                  key="claiming"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="py-16 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-12 h-12 border-4 border-[#C8FF00]/20 border-t-[#C8FF00] rounded-full animate-spin mb-4" />
                  <p className="text-sm font-bold text-white tracking-widest uppercase">Processing Request...</p>
                </motion.div>
              ) : (
                <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="bg-neon/10 border border-neon/20 rounded-2xl p-4 mb-5 text-center">
                    <p className="text-zinc-400 text-xs mb-1">Unlock your Creator Pool</p>
                    <p className="text-3xl font-black text-neon">{creatorPool} {CURRENCY}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold mb-0.5">1. Verify Identity</h4>
                        <p className="text-xs text-zinc-400 leading-snug">Connect your social account to prove you are @{market.creator.username}.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <Share2 className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold mb-0.5">2. Join the Pool</h4>
                        <p className="text-xs text-zinc-400 leading-snug">Get exclusive access to the Culture Club Claim Pool.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <TrendingUp className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-bold mb-0.5">3. Claim & Earn</h4>
                        <p className="text-xs text-zinc-400 leading-snug">Take control of this market, feature it on your profile, and earn fees.</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      onClick={() => handleAction('donate')}
                      className="py-3 rounded-xl font-bold text-sm bg-zinc-800 hover:bg-zinc-700 text-white transition-all transform active:scale-[0.98] flex flex-col items-center justify-center gap-1.5 border border-white/5"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      Donate Pool
                    </button>
                    <button
                      onClick={() => handleAction('claim')}
                      className="py-3 rounded-xl font-bold text-sm bg-neon hover:bg-[#b3e600] text-black transition-all transform active:scale-[0.98] flex flex-col items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(204,255,0,0.2)]"
                    >
                      <Wallet className="w-4 h-4" />
                      Claim to Wallet
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
