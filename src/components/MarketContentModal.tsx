import { useState } from 'react';
import { Market, Position } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, Users, Activity, ExternalLink, Calendar, Milestone, Share2, MessageSquare, Copy, ShieldAlert, Check, Bookmark, CheckCircle2, AlertTriangle, Scale, Trophy, Skull } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { CURRENCY } from '../config';
import { CommentsModal } from './CommentsModal';
import { cn } from '../lib/utils';

interface MarketContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: Market;
  onCreatorClick: (creator: any) => void;
  onTrade: (marketId: string, position: 'YES' | 'NO', amount: number) => void;
  balance: number;
  isAuthenticated: boolean;
  onLoginRequest: () => void;
  initialPosition?: 'YES' | 'NO';
  isBookmarked?: boolean;
  onToggleBookmark?: (marketId: string) => void;
  userPosition?: Position;
  onSellPosition?: (marketId: string) => void;
  onResolveMarket?: (marketId: string, outcome: 'YES' | 'NO') => void;
}

export function MarketContentModal({ 
  isOpen, 
  onClose, 
  market, 
  onCreatorClick, 
  onTrade, 
  balance, 
  isAuthenticated, 
  onLoginRequest,
  initialPosition,
  isBookmarked = false,
  onToggleBookmark,
  userPosition,
  onSellPosition,
  onResolveMarket
}: MarketContentModalProps) {
  const [chartMode, setChartMode] = useState<'price' | 'metric'>('price');
  const [tradePosition, setTradePosition] = useState<'YES' | 'NO'>(initialPosition || 'YES');
  const [tradeAmount, setTradeAmount] = useState<string>('50');
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Sync initialPosition when modal opens
  useState(() => {
    if (initialPosition) {
      setTradePosition(initialPosition);
    }
  });

  if (!isOpen) return null;

  const percentage = Math.min((market.currentValue / market.targetValue) * 100, 100);
  const remaining = Math.max(0, market.targetValue - market.currentValue);

  // Price calculations
  const amountNum = parseFloat(tradeAmount || '0');
  const price = tradePosition === 'YES' ? market.yesPrice : market.noPrice;
  const fee = 0;
  const netAmount = amountNum;
  const estTokens = price > 0 ? netAmount / price : 0;
  const potentialReturn = estTokens * 1.0; // payout is $1 per winning share
  const roi = amountNum > 0 ? ((potentialReturn - amountNum) / amountNum) * 100 : 0;
  const isInsufficient = amountNum > balance;

  // Est Price Impact based on amount size
  const priceImpact = Math.min((amountNum / (market.liquidity || 50000)) * 100, 15).toFixed(2);

  // Generate responsive mock chart data based on market details
  const generateChartData = () => {
    const data = [];
    const pointsCount = 7;
    const basePrice = market.yesPrice;
    const baseMetric = market.currentValue / 2;

    for (let i = 0; i < pointsCount; i++) {
      const day = `Day ${i + 1}`;
      
      // Price model: randomized walk ending near yesPrice
      let priceVal = basePrice;
      if (i < pointsCount - 1) {
        const factor = (pointsCount - 1 - i) * 0.05;
        priceVal = Math.max(0.05, Math.min(0.95, basePrice + (Math.random() - 0.5) * factor));
      }

      // Metric model: gradual accumulation ending at currentValue
      const ratio = (i + 1) / pointsCount;
      const metricVal = Math.round(baseMetric + (market.currentValue - baseMetric) * ratio * (0.9 + Math.random() * 0.2));

      data.push({
        name: day,
        price: Number(priceVal.toFixed(2)),
        metric: Math.min(metricVal, market.targetValue),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  const isMarketLive = true;

  const handleApplyTrade = () => {
    if (!isAuthenticated) {
      onLoginRequest();
      return;
    }
    if (isNaN(amountNum) || amountNum <= 0 || isInsufficient) return;
    onTrade(market.id, tradePosition, amountNum);
    onClose();
  };

  const handleShare = () => {
    setCopiedLink(true);
    navigator.clipboard.writeText(`https://810.one/market/${market.id}`);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const getPlatformBadge = (username: string, category: string) => {
    const u = username.toLowerCase();
    const c = category.toLowerCase();
    
    if (c === 'tech & brands' || u.includes('apple') || u.includes('openai') || u.includes('tesla') || u.includes('liquiddeath') || u.includes('nike') || u.includes('anthropic') || u.includes('meta') || u.includes('nvidia') || u.includes('duolingo') || u.includes('netflix')) {
      return { label: 'Brand & Tech', color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30', dotColor: 'bg-emerald-400' };
    }
    if (u.includes('flovely') || u.includes('electify')) {
      return { label: 'Flovely VIP', color: 'bg-amber-400/10 text-amber-400 border-amber-400/30', dotColor: 'bg-amber-400' };
    }
    if (u.includes('lol') || u.includes('supersound') || u.includes('wang')) {
      return { label: 'LOL Agency', color: 'bg-fuchsia-400/10 text-fuchsia-400 border-fuchsia-400/30', dotColor: 'bg-fuchsia-400' };
    }
    if (c === 'artists & ai' || u.includes('refik') || u.includes('grimes') || u.includes('sora')) {
      return { label: 'AI Generative', color: 'bg-cyan-400/10 text-cyan-400 border-cyan-400/30', dotColor: 'bg-cyan-400' };
    }
    if (c === 'sports' || u.includes('clark') || u.includes('edwards') || u.includes('ohtani') || u.includes('mahomes') || u.includes('reese') || u.includes('wemby') || u.includes('gauff')) {
      return { label: 'US Pro Sports', color: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30', dotColor: 'bg-emerald-400' };
    }
    if (c === 'events' || u.includes('tomorrowland') || u.includes('coachella')) {
      return { label: 'Festival & Event', color: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30', dotColor: 'bg-indigo-400' };
    }
    if (c === 'music' || u.includes('swift') || u.includes('drake') || u.includes('weeknd')) {
      return { label: 'Spotify Music', color: 'bg-[#1DB954]/10 text-[#1DB954] border-[#1DB954]/25', dotColor: 'bg-[#1DB954]' };
    }
    if (c === 'gaming' || u.includes('rockstar') || u.includes('gta')) {
      return { label: 'Gaming Titan', color: 'bg-[#9146FF]/10 text-[#9146FF] border-[#9146FF]/25', dotColor: 'bg-[#9146FF]' };
    }
    if (u.includes('kai') || u.includes('speed') || u.includes('xqc')) {
      return { label: 'Live Stream', color: 'bg-[#FF0000]/10 text-[#FF0000] border-[#FF0000]/25', dotColor: 'bg-[#FF0000]' };
    }
    return { label: 'Culture Core', color: 'bg-zinc-800 text-zinc-300 border-zinc-700', dotColor: 'bg-[#C8FF00]' };
  };

  const platformBadge = getPlatformBadge(market.creator.username, market.category);

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-full h-[90vh] bg-zinc-950 rounded-t-[32px] border-t border-zinc-900 pb-safe overflow-y-auto no-scrollbar relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Indicator Accent Line */}
            <div className="w-12 h-1 bg-zinc-800 rounded-full mx-auto my-3" />

            <div className="px-5 pb-10">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,255,0,0.05)]", platformBadge.color)}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", platformBadge.dotColor)} />
                    {platformBadge.label} Telemetry
                  </span>
                  <span className="text-[10px] font-mono font-black text-[#C8FF00] bg-[#C8FF00]/10 border border-[#C8FF00]/25 px-2 py-0.5 rounded-full uppercase">
                    ${market.creator.username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onToggleBookmark?.(market.id)}
                    className={cn(
                      "p-2 rounded-full border transition-all outline-none cursor-pointer",
                      isBookmarked 
                        ? "bg-[#C8FF00] border-[#C8FF00] text-black shadow-[0_0_15px_rgba(200,255,0,0.4)]" 
                        : "bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white"
                    )}
                    title={isBookmarked ? "Remove Bookmark" : "Save Bookmark"}
                    id="market-detail-bookmark"
                  >
                    <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-black")} />
                  </button>
                  <button 
                    onClick={onClose} 
                    className="p-2 bg-zinc-900 border border-zinc-850 rounded-full text-zinc-400 hover:text-white transition-colors outline-none cursor-pointer"
                    id="market-detail-close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Market Question */}
              <h1 className="text-xl font-black text-white leading-snug mb-5 tracking-tight pr-4">
                {market.question}
              </h1>

              {/* Creator Card */}
              <div 
                onClick={() => onCreatorClick(market.creator)}
                className="flex items-center justify-between bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-900/60 p-3 rounded-2xl cursor-pointer transition-all mb-6 group"
                id="market-detail-creator"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={market.creator.avatar} 
                    alt={market.creator.username} 
                    referrerPolicy="no-referrer" 
                    className="w-10 h-10 rounded-full object-cover border border-zinc-800 group-hover:border-[#C8FF00]/40 transition-all" 
                  />
                  <div>
                    <h4 className="text-sm font-black text-white">@{market.creator.username}</h4>
                    <p className="text-[10px] text-zinc-500">2.0% Fee Split Beneficiary</p>
                  </div>
                </div>
                <div className="text-[10px] text-[#C8FF00] font-bold flex items-center gap-1 bg-[#C8FF00]/10 px-2.5 py-1 rounded-lg border border-[#C8FF00]/15 group-hover:bg-[#C8FF00] group-hover:text-black transition-colors">
                  Social Core
                  <ExternalLink className="w-2.5 h-2.5" />
                </div>
              </div>

              {/* 24h odds chart */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-4.5 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500">24h ODDS HISTORY</span>
                  {/* Toggle Mode */}
                  <div className="flex items-center gap-1.5 bg-black p-0.5 rounded-lg border border-zinc-900">
                    <button 
                      onClick={() => setChartMode('price')} 
                      className={cn("text-[9px] font-bold px-2 py-1 rounded transition-colors", chartMode === 'price' ? "bg-zinc-800 text-white" : "text-zinc-500")}
                    >
                      Price
                    </button>
                    <button 
                      onClick={() => setChartMode('metric')} 
                      className={cn("text-[9px] font-bold px-2 py-1 rounded transition-colors", chartMode === 'metric' ? "bg-zinc-800 text-white" : "text-zinc-500")}
                    >
                      Hold
                    </button>
                  </div>
                </div>

                <div className="h-44 w-full rounded-2xl overflow-hidden pr-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 0 }}>
                      <defs>
                        <linearGradient id="detailGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#C8FF00" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#4b5563" fontSize={9} tickLine={false} axisLine={false} domain={chartMode === 'price' ? [0, 1] : ['auto', 'auto']} />
                      <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #1f2937', borderRadius: '12px' }} />
                      <Area type="monotone" dataKey={chartMode === 'price' ? 'price' : 'metric'} stroke="#C8FF00" strokeWidth={2.5} fillOpacity={1} fill="url(#detailGlow)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Progress Milestones (current vs target value progress bar) */}
              <div className="bg-zinc-900/30 border border-zinc-900 rounded-3xl p-4.5 mb-6">
                <div className="flex justify-between items-baseline mb-2">
                  <div className="flex items-center gap-1.5">
                    <Milestone className="w-3.5 h-3.5 text-[#C8FF00]" />
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Milestone ({percentage.toFixed(0)}%)</span>
                  </div>
                  <span className="text-[#C8FF00] font-mono text-xs font-bold">{market.currentValue.toLocaleString()} / {market.targetValue.toLocaleString()}</span>
                </div>
                
                <div className="w-full h-2 bg-black rounded-full overflow-hidden border border-zinc-900 p-px">
                  <div className="h-full bg-gradient-to-r from-[#C2F500] to-[#E3FF5E] rounded-full" style={{ width: `${percentage}%` }} />
                </div>
                <div className="flex justify-between text-[9px] text-zinc-500 font-medium mt-1 uppercase font-mono">
                  <span>Current: {market.metricLabel}</span>
                  <span>Remain: {remaining.toLocaleString()}</span>
                </div>
              </div>

              {/* If Market is Resolved: Show Settlement Certificate & Payouts */}
              {market.status === 'resolved' ? (
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-[28px] p-5 mb-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Scale className="w-5 h-5 text-[#C8FF00]" />
                      <span className="text-xs font-black uppercase tracking-wider text-white">Market Settled &amp; Resolved</span>
                    </div>
                    <span className={cn(
                      "px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider",
                      market.resolutionOutcome === 'YES'
                        ? "bg-[#C8FF00] text-black shadow-[0_0_15px_rgba(200,255,0,0.3)]"
                        : "bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]"
                    )}>
                      Outcome: {market.resolutionOutcome}
                    </span>
                  </div>

                  <div className="bg-black/60 rounded-2xl p-3.5 space-y-2 border border-zinc-850 font-mono text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Resolution Source:</span>
                      <span className="text-white font-medium">{market.resolutionSource || 'Decentralized Oracle API'}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Resolved Date:</span>
                      <span className="text-zinc-300">{market.resolvedAt || 'Completed'}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Winning Payout:</span>
                      <span className="text-[#C8FF00] font-bold">1.00 {CURRENCY} / share</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Losing Value:</span>
                      <span className="text-rose-400 font-bold">0.00 {CURRENCY} / share</span>
                    </div>
                  </div>

                  {/* If user had a position */}
                  {userPosition && (
                    <div className={cn(
                      "p-3.5 rounded-2xl border flex items-center gap-3",
                      userPosition.position === market.resolutionOutcome
                        ? "bg-[#C8FF00]/10 border-[#C8FF00]/30 text-[#C8FF00]"
                        : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                    )}>
                      {userPosition.position === market.resolutionOutcome ? (
                        <>
                          <Trophy className="w-5 h-5 shrink-0 text-[#C8FF00]" />
                          <div>
                            <p className="text-xs font-black uppercase">Position Won!</p>
                            <p className="text-[11px] text-zinc-300 font-mono">
                              Held {userPosition.shares.toFixed(1)} {userPosition.position} shares. Payout of +{(userPosition.shares).toFixed(2)} {CURRENCY} was credited to your wallet!
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <Skull className="w-5 h-5 shrink-0 text-rose-500" />
                          <div>
                            <p className="text-xs font-black uppercase">Position Lost</p>
                            <p className="text-[11px] text-zinc-400 font-mono">
                              Held {userPosition.shares.toFixed(1)} {userPosition.position} shares. Settled at 0.00 {CURRENCY}.
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {/* If user already has an active position in this market, show quick status & Sell button */}
                  {userPosition && (
                    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-3.5 mb-4 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider",
                            userPosition.position === 'YES' ? "bg-[#C8FF00] text-black" : "bg-rose-500 text-white"
                          )}>
                            Holding {userPosition.position}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">{userPosition.shares.toFixed(1)} Shares</span>
                        </div>
                        <p className="text-[10px] text-zinc-500 font-mono">
                          Invested: {(userPosition.shares * userPosition.avgPrice).toFixed(2)} {CURRENCY} • Value: {(userPosition.shares * (userPosition.position === 'YES' ? market.yesPrice : market.noPrice)).toFixed(2)} {CURRENCY}
                        </p>
                      </div>

                      {onSellPosition && (
                        <button
                          onClick={() => onSellPosition(market.id)}
                          className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer outline-none active:scale-95"
                        >
                          Sell / Cash Out
                        </button>
                      )}
                    </div>
                  )}

                  {/* Trade Section inside the Sheet */}
                  <div className="bg-zinc-900/20 border-2 border-[#C8FF00]/15 rounded-[28px] p-4.5 mb-4 shadow-[0_0_30px_rgba(200,255,0,0.05)]">
                    <h3 className="text-xs font-black uppercase text-zinc-300 tracking-wider mb-3">Place Prediction Position</h3>
                    
                    {/* YES/NO Toggle Switch */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <button
                        onClick={() => setTradePosition('YES')}
                        className={cn(
                          "py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer",
                          tradePosition === 'YES' 
                            ? "bg-[#C8FF00] text-black shadow-md border border-[#C8FF00]" 
                            : "bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-white"
                        )}
                      >
                        <TrendingUp className="w-3.5 h-3.5" /> YES at {(market.yesPrice).toFixed(2)}
                      </button>

                      <button
                        onClick={() => setTradePosition('NO')}
                        className={cn(
                          "py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all outline-none cursor-pointer",
                          tradePosition === 'NO' 
                            ? "bg-rose-500 text-white shadow-md border border-rose-500" 
                            : "bg-zinc-950 text-zinc-500 border border-zinc-900 hover:text-white"
                        )}
                      >
                        <TrendingDown className="w-3.5 h-3.5" /> NO at {(market.noPrice).toFixed(2)}
                      </button>
                    </div>

                    {/* Amount input and slider */}
                    <div className="mb-4">
                      <div className="flex justify-between items-baseline mb-1">
                        <span className="text-[10px] text-zinc-500 font-mono">Amount ({CURRENCY})</span>
                        <span className="text-[10px] text-zinc-500 font-mono">My Wallet: {balance.toFixed(2)} {CURRENCY}</span>
                      </div>
                      <div className="relative bg-black rounded-xl border border-zinc-900 px-3 py-2 flex items-center">
                        <input 
                          type="number" 
                          value={tradeAmount}
                          onChange={(e) => setTradeAmount(e.target.value)}
                          className="bg-transparent font-black text-xl text-white outline-none w-full"
                        />
                        <span className="text-zinc-500 text-xs font-bold shrink-0 uppercase font-mono">{CURRENCY}</span>
                      </div>

                      {/* Quick Bet increments add up: +1, +10, +50, +100, Max */}
                      <div className="grid grid-cols-5 gap-1 mt-2">
                        {[
                          { label: '+1', value: '1' },
                          { label: '+10', value: '10' },
                          { label: '+50', value: '50' },
                          { label: '+100', value: '100' },
                          { label: 'Max', value: 'max' }
                        ].map((btn) => (
                          <button 
                            key={btn.label}
                            onClick={() => {
                              if (btn.value === 'max') {
                                setTradeAmount(balance.toFixed(0));
                              } else {
                                const current = parseFloat(tradeAmount || '0') || 0;
                                const inc = parseFloat(btn.value);
                                setTradeAmount((current + inc).toString());
                              }
                            }}
                            className="py-1.5 bg-zinc-900 hover:bg-zinc-800 text-[9px] font-bold rounded text-zinc-300 transition-colors border border-zinc-850 cursor-pointer"
                          >
                            {btn.label === 'Max' ? 'MAX' : btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Tokens + Price Impact */}
                    <div className="bg-black/50 rounded-xl p-3 space-y-2 font-mono text-[11px] text-zinc-500 mb-4 border border-zinc-900">
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Estimated Shares:</span>
                        <span className="text-white font-bold">{estTokens.toFixed(1)} Shares</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Win Multiplier:</span>
                        <span className="text-[#C8FF00] font-bold">{roi > 0 ? (potentialReturn / amountNum).toFixed(2) : '0.00'}x</span>
                      </div>
                      <div className="flex justify-between items-center text-zinc-400">
                        <span>Estimated Slippage:</span>
                        <span className="text-zinc-400">{priceImpact}%</span>
                      </div>
                    </div>

                    {/* Confirm Buy action */}
                    <button
                      onClick={handleApplyTrade}
                      disabled={!isMarketLive || amountNum <= 0 || isInsufficient}
                      className={cn(
                        "w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all transform active:scale-98 flex items-center justify-center gap-1.5 outline-none cursor-pointer",
                        (!isMarketLive || amountNum <= 0 || isInsufficient)
                          ? "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-850"
                          : tradePosition === 'YES' 
                            ? "bg-[#C8FF00] text-black hover:bg-[#b0e000] shadow-[0_0_15px_rgba(200,255,0,0.2)]" 
                            : "bg-rose-500 text-white hover:bg-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                      )}
                      id="sheet-confirm-buy-btn"
                    >
                      {!isAuthenticated ? 'Connect Wallet' : (!isMarketLive ? 'Market not live yet' : (isInsufficient ? 'Insufficient Funds' : 'Confirm Buy Position'))}
                    </button>
                  </div>

                  {/* Market Resolution Simulator Control */}
                  {onResolveMarket && (
                    <div className="bg-zinc-950 border border-zinc-850 rounded-2xl p-3.5 mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5">
                          <Scale className="w-3.5 h-3.5 text-[#C8FF00]" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">Market Settlement Simulator</span>
                        </div>
                        <span className="text-[9px] text-zinc-500 uppercase font-mono">Test Win / Loss</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mb-3">
                        Simulate ending this market and triggering payouts. If you hold winning shares, you win $1.00/share. If you hold losing shares, your position settles at $0.00.
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => {
                            setIsResolving(true);
                            setTimeout(() => {
                              setIsResolving(false);
                              onResolveMarket(market.id, 'YES');
                            }, 500);
                          }}
                          disabled={isResolving}
                          className="py-2 px-3 rounded-xl bg-[#C8FF00]/10 hover:bg-[#C8FF00]/20 border border-[#C8FF00]/40 text-[#C8FF00] text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Trophy className="w-3.5 h-3.5" /> Resolve as YES
                        </button>
                        <button
                          onClick={() => {
                            setIsResolving(true);
                            setTimeout(() => {
                              setIsResolving(false);
                              onResolveMarket(market.id, 'NO');
                            }, 500);
                          }}
                          disabled={isResolving}
                          className="py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/40 text-rose-400 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                        >
                          <Skull className="w-3.5 h-3.5" /> Resolve as NO
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Botton Row: Comments + Share */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-900/60">
                <button 
                  onClick={() => setShowCommentsModal(true)}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all outline-none text-zinc-200"
                >
                  <MessageSquare className="w-4 h-4 text-[#C8FF00]" />
                  <span className="text-xs font-bold">142 Comments</span>
                </button>

                <button 
                  onClick={handleShare}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 rounded-2xl py-3.5 flex items-center justify-center gap-2 transition-all outline-none text-zinc-200 relative overflow-hidden"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-[#C8FF00] shrink-0" />
                      <span className="text-xs font-bold text-[#C8FF00]">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 text-[#C8FF00]" shrink-0 />
                      <span className="text-xs font-bold">Amplify Link</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      <CommentsModal
        isOpen={showCommentsModal}
        onClose={() => setShowCommentsModal(false)}
        marketId={market.id}
      />
    </>
  );
}
