import { Sparkles, Lock, Clock, Check, ChevronRight, Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export function CultureClub() {
  const [joined, setJoined] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [validationMsg, setValidationMsg] = useState('');
  const [countdown, setCountdown] = useState({ days: 14, hours: 8, minutes: 42, seconds: 19 });

  // Live ticking countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailAddress.includes('@')) {
      setValidationMsg('Please enter a valid node or email handle.');
      return;
    }
    setJoined(true);
    setValidationMsg('');
  };

  return (
    <div className="w-full h-full bg-black p-4 text-white overflow-y-auto no-scrollbar pb-28 flex flex-col justify-between">
      <div>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8FF00]/10 border border-[#C8FF00]/20 text-[#C8FF00] text-[9px] font-mono font-black tracking-widest uppercase mb-3">
            <Sparkles className="w-3 h-3 animate-spin" />
            PARTNER HUB COMING SOON
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2 leading-none uppercase">
            CULTURE CLUB
          </h1>
          <p className="text-zinc-500 text-xs font-semibold max-w-[280px] mx-auto leading-relaxed">
            The exclusive dashboard for Creators, Affiliates, and Clippers. Earn a percentage of volume from your referral bidders.
          </p>
        </motion.div>

        {/* Live Countdown Timer */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-5 mb-6 text-center shadow-[0_8px_32px_rgba(0,0,0,0.8)] relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C8FF00]/30 to-transparent" />
          <div className="flex items-center justify-center gap-1 text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-3">
            <Clock className="w-3.5 h-3.5 text-zinc-500" />
            LAUNCH COUNTDOWN
          </div>
          
          <div className="grid grid-cols-4 gap-2 max-w-[240px] mx-auto">
            {[
              { val: countdown.days, label: 'days' },
              { val: countdown.hours, label: 'hrs' },
              { val: countdown.minutes, label: 'mins' },
              { val: countdown.seconds, label: 'secs', highlight: true }
            ].map((unit, i) => (
              <div key={i} className="bg-zinc-900/60 border border-zinc-900 px-2 py-3 rounded-xl">
                <span className={`font-mono text-xl font-black tracking-tight block ${unit.highlight ? 'text-[#C8FF00]' : 'text-white'}`}>
                  {unit.val.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] font-black uppercase text-zinc-500 tracking-wider font-mono">
                  {unit.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feature Teasers */}
        <div className="space-y-3 mb-8">
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest px-1">FUTURE FUNCTIONS</p>
          
          {[
            { 
              title: 'REFERRAL BIDDER TRACKING', 
              desc: 'Monitor your referred users, clippers, and their trading volume in real-time to track your affiliate cut.',
              unlocked: false,
              badge: '🔓 PHASE 1'
            },
            { 
              title: 'CLIPPER LEADERBOARDS', 
              desc: 'Compete with other content creators and clippers for top affiliate earnings and bonus rewards.',
              unlocked: false,
              badge: '🔒 PHASE 2'
            },
            { 
              title: 'GUILD SYNDICATE PASS', 
              desc: 'Spawn decentralized sub-groups with custom revenue split agreements on winning predictions.',
              unlocked: false,
              badge: '🔒 PHASE 3'
            }
          ].map((feat, i) => (
            <div key={i} className="bg-zinc-900/40 border border-zinc-900 rounded-2xl p-4 flex items-start gap-3 relative overflow-hidden group">
              <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-650 shrink-0 mt-0.5">
                <Lock className="w-4 h-4 text-zinc-600 transition-colors group-hover:text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-black tracking-tight text-zinc-300">{feat.title}</h4>
                  <span className="text-[8px] font-black tracking-widest font-mono text-zinc-500">{feat.badge}</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-semibold leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Beta Spot Sign up form / queue */}
      <div className="mt-auto">
        <AnimatePresence mode="wait">
          {!joined ? (
            <motion.form 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleJoinWaitlist}
              className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.8)]"
            >
              <h3 className="text-sm font-black italic mb-1.5 text-zinc-200">CLAIM PRESTIGE REPUTATION SPOT</h3>
              <p className="text-[10px] text-zinc-500 uppercase font-black tracking-wider mb-4 leading-normal">
                Submit your X handle or email. Approved addresses bypass community lock.
              </p>

              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="@handle or email..."
                  className="flex-1 bg-zinc-900 border border-zinc-850 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-zinc-500 font-semibold outline-none focus:border-zinc-700 transition-colors"
                />
                <button 
                  type="submit"
                  className="bg-[#C8FF00] hover:bg-white text-black p-3 rounded-xl transition-all flex items-center justify-center outline-none shrink-0"
                  aria-label="Submit email to club waitlist"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              
              {validationMsg && (
                <p className="text-[10px] text-amber-500 font-mono font-bold mt-2.5 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {validationMsg}
                </p>
              )}
            </motion.form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#C8FF00] rounded-[28px] p-5 text-black text-center shadow-[0_0_30px_rgba(200,255,0,0.15)]"
            >
              <div className="w-12 h-12 bg-black text-[#C8FF00] rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-lg">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-lg font-black tracking-tighter italic leading-none mb-1">PRESTIGE REGISTERED</h3>
              <p className="text-[9px] text-black/75 uppercase font-black tracking-widest font-mono mb-2">Waitlist Slot: #4,291</p>
              <p className="text-[11px] text-black/70 font-semibold leading-relaxed my-3 px-2">
                We've whitelisted your handle. Keep notifications active for the keycode drop.
              </p>
              <div className="bg-black/90 text-white font-mono font-black text-xs py-2 rounded-xl border border-black/10 uppercase tracking-widest">
                +1,000 REP POINTS GRANTED
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
