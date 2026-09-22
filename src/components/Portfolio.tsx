import { useState } from 'react';
import { User, Position, Market, SettledHistoryItem } from '../types';
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, Loader2, CheckCircle2, History, BarChart3, Check, Settings, LogOut, Edit3, Bookmark, Scale, Trophy, Skull, PlusCircle, AlertOctagon, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { CURRENCY } from '../config';

interface PortfolioProps {
  user: User;
  positions: Position[];
  markets: Market[];
  isAuthenticated: boolean;
  onLoginRequest: () => void;
  onBuyUSDT?: () => void;
  onTradeClick?: (market: Market, position: 'YES' | 'NO') => void;
  showSuccessToast: (msg: string) => void;
  onEditProfile: () => void;
  onLogout: () => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (marketId: string) => void;
  onExploreClick?: () => void;
  settledHistory?: SettledHistoryItem[];
  onSellPosition?: (marketId: string) => void;
  onResolveMarket?: (marketId: string, outcome: 'YES' | 'NO') => void;
  onWithdraw?: (amount: number) => void;
  onDeposit?: (amount: number) => void;
}

export function Portfolio({ 
  user, 
  positions, 
  markets, 
  isAuthenticated, 
  onLoginRequest, 
  onBuyUSDT, 
  onTradeClick,
  showSuccessToast,
  onEditProfile,
  onLogout,
  bookmarkedIds = [],
  onToggleBookmark,
  onExploreClick,
  settledHistory = [],
  onSellPosition,
  onResolveMarket,
  onWithdraw,
  onDeposit
}: PortfolioProps) {
  const [withdrawState, setWithdrawState] = useState<'idle' | 'connecting' | 'success'>('idle');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [customWithdrawAmount, setCustomWithdrawAmount] = useState('250');
  const [customDepositAmount, setCustomDepositAmount] = useState('500');
  const [activeTab, setActiveTab] = useState<'positions' | 'bookmarks' | 'history' | 'stats'>('positions');

  const bookmarkedMarkets = markets.filter(m => bookmarkedIds.includes(m.id));

  const availableToWithdraw = user.balance * 0.8;

  const handleWithdrawExecute = (amount: number) => {
    if (amount <= 0 || amount > availableToWithdraw) {
      showSuccessToast('Withdrawal amount exceeds available balance buffer.');
      return;
    }
    setWithdrawState('connecting');
    setShowWithdrawModal(false);
    
    setTimeout(() => {
      setWithdrawState('success');
      if (onWithdraw) {
        onWithdraw(amount);
      }
      showSuccessToast(`Withdrawal of ${amount.toFixed(2)} ${CURRENCY} sent to 0x71C...976F!`);
      setTimeout(() => {
        setWithdrawState('idle');
      }, 2500);
    }, 1500);
  };

  const handleDepositExecute = (amount: number) => {
    if (onDeposit) {
      onDeposit(amount);
    } else if (onBuyUSDT) {
      onBuyUSDT();
    }
    setShowDepositModal(false);
    showSuccessToast(`Deposited +${amount.toFixed(2)} ${CURRENCY} to wallet!`);
  };

  const totalValue = positions.reduce((acc, pos) => {
    const market = markets.find(m => m.id === pos.marketId);
    if (!market) return acc;
    const currentPrice = pos.position === 'YES' ? market.yesPrice : market.noPrice;
    return acc + (pos.shares * currentPrice);
  }, 0);

  const totalCost = positions.reduce((acc, pos) => acc + (pos.shares * pos.avgPrice), 0);
  const totalPnL = totalValue - totalCost;
  const pnlPercent = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div className="h-full w-full bg-black text-white px-4 pt-12 pb-24 overflow-y-auto no-scrollbar relative">
      {/* Absolute Ambient Glow */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#C8FF00]/5 to-transparent pointer-events-none" />

      <div className="relative z-10">
        {/* Title */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Active Portfolio</h1>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Trading Registry &amp; Payout Claims</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onEditProfile}
              className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-850 hover:text-[#C8FF00] transition-colors outline-none"
              title="Edit Profile"
            >
              <Settings className="w-4 h-4" />
            </button>
            {isAuthenticated && (
              <button 
                onClick={onLogout}
                className="p-2 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-rose-500/25 hover:text-rose-400 text-zinc-400 transition-colors group outline-none"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* User Profile Header / Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-5 mb-5 relative overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8FF00]/5 rounded-bl-full pointer-events-none" />
          
          <div className="flex items-start gap-4">
            <div className="relative cursor-pointer group shrink-0" onClick={onEditProfile}>
              <img 
                src={user.avatar} 
                alt={user.username} 
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border border-zinc-800 group-hover:border-[#C8FF00] transition-all" 
              />
              <div className="absolute -bottom-1 -right-1 bg-[#C8FF00] text-black p-1.5 rounded-full border-2 border-black group-hover:scale-110 transition-transform">
                <Edit3 className="w-3 h-3" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-black text-white truncate">@{user.username}</h2>
              
              <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                <span className="text-[10px] font-mono font-bold bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400">
                  {isAuthenticated ? '0x71C...976F' : 'Not Connected'}
                </span>
                <span className="text-[10px] font-bold bg-[#C8FF00]/10 border border-[#C8FF00]/20 text-[#C8FF00] px-2 py-0.5 rounded uppercase tracking-wider">
                  Social Node
                </span>
              </div>

              {!isAuthenticated ? (
                <button 
                  onClick={onLoginRequest}
                  className="mt-3 bg-white hover:bg-zinc-200 text-black px-4 py-1.5 rounded-xl font-black text-xs transition-transform active:scale-95 outline-none flex items-center gap-1.5"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  Connect Wallet
                </button>
              ) : (
                <p className="text-xs text-zinc-400 mt-3 italic line-clamp-2 leading-relaxed">
                  {user.bio || 'Predictions are the ultimate truth. Setting up my prediction channels.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Available Withdrawal Card & Faucet */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-5 mb-5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          <div className="flex justify-between items-start mb-5">
            <div>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Available to Withdraw</p>
              <h2 className="text-3xl font-black text-white">
                {availableToWithdraw.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} 
                <span className="text-xs text-zinc-500 font-bold ml-1.5 uppercase font-mono">{CURRENCY}</span>
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDepositModal(true)}
                className="px-3.5 py-2.5 rounded-xl font-bold text-xs bg-[#C8FF00]/15 hover:bg-[#C8FF00]/25 text-[#C8FF00] border border-[#C8FF00]/30 transition-all active:scale-95 cursor-pointer outline-none flex items-center gap-1.5"
                title="Deposit / Top Up"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Deposit
              </button>

              <button 
                className={cn(
                  "px-4 py-2.5 rounded-xl font-bold text-xs transition-transform duration-200 select-none outline-none flex items-center gap-1.5 border active:scale-95 text-center cursor-pointer",
                  withdrawState === 'idle' ? "bg-white text-black border-white hover:bg-zinc-200" :
                  withdrawState === 'connecting' ? "bg-zinc-900 text-zinc-400 border-zinc-800 cursor-not-allowed" :
                  "bg-[#C8FF00] text-black border-[#C8FF00]"
                )}
                onClick={() => {
                  if (!isAuthenticated) {
                    onLoginRequest();
                  } else {
                    setShowWithdrawModal(true);
                  }
                }}
                disabled={withdrawState !== 'idle'}
              >
                {withdrawState === 'idle' && (
                  <>
                    <Wallet className="w-3.5 h-3.5" />
                    {isAuthenticated ? 'Withdraw' : 'Connect'}
                  </>
                )}
                {withdrawState === 'connecting' && (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Sending...
                  </>
                )}
                {withdrawState === 'success' && (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                    Sent
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="space-y-2.5 pt-3.5 border-t border-zinc-900 font-mono text-[11px] text-zinc-400">
            <div className="flex justify-between items-center">
              <span>Pending Buffer (20% Reserve):</span>
              <span className="font-bold text-amber-400">{(user.balance * 0.2).toFixed(2)} {CURRENCY}</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500">
              <span>Total Wallet Balance:</span>
              <span className="font-bold text-zinc-300">{user.balance.toFixed(2)} {CURRENCY}</span>
            </div>
          </div>
        </div>

        {/* Zero-Balance / Liquidated Alert Banner */}
        {user.balance <= 1 && (
          <div className="mb-5 bg-rose-950/40 border border-rose-500/40 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertOctagon className="w-6 h-6 text-rose-500 shrink-0" />
              <div>
                <h4 className="text-xs font-black uppercase text-white">Account Balance Critical (0.00 {CURRENCY})</h4>
                <p className="text-[10px] text-rose-300">Lost everything or low on cash? Claim test faucet to keep trading.</p>
              </div>
            </div>
            <button
              onClick={() => handleDepositExecute(1000)}
              className="px-3 py-2 bg-[#C8FF00] hover:bg-[#b0e000] text-black font-black text-xs rounded-xl shadow-[0_0_15px_rgba(200,255,0,0.3)] shrink-0 cursor-pointer outline-none active:scale-95"
            >
              +1,000 Faucet
            </button>
          </div>
        )}

        {/* Portfolio Overview Value card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-[28px] p-5 mb-5 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Account Valuation</p>
              <h2 className="text-2xl font-black">
                {(totalValue + user.balance).toLocaleString(undefined, { minimumFractionDigits: 2 })} 
                <span className="text-xs text-zinc-500 font-bold ml-1 uppercase font-mono">{CURRENCY}</span>
              </h2>
            </div>
            <button 
              className="bg-[#C8FF00] text-black hover:bg-[#b0e000] px-4 py-2 rounded-xl font-bold text-xs transition-transform active:scale-95 shadow-[0_0_10px_rgba(200,255,0,0.2)] flex items-center gap-1.5 outline-none"
              onClick={onBuyUSDT}
            >
              <Wallet className="w-3.5 h-3.5" />
              Deposit
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={cn(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold font-mono",
              totalPnL >= 0 ? "bg-[#C8FF00]/10 text-[#C8FF00]" : "bg-rose-500/10 text-rose-400"
            )}>
              {totalPnL >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2 })} {CURRENCY} ({Math.abs(pnlPercent).toFixed(2)}%)
            </div>
            <span className="text-zinc-500 text-[10px] font-bold uppercase font-mono">Cumulative PnL</span>
          </div>
        </div>

        {/* Navigation Tabs (Positions, Bookmarks, History, Stats) */}
        <div className="flex items-center gap-1.5 mb-5 bg-zinc-950 p-1 rounded-2xl border border-zinc-900/80">
          <button 
            onClick={() => setActiveTab('positions')}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1 outline-none cursor-pointer",
              activeTab === 'positions' ? "bg-zinc-900 text-white shadow-md border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Active
          </button>

          <button 
            onClick={() => setActiveTab('bookmarks')}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1 outline-none cursor-pointer relative",
              activeTab === 'bookmarks' ? "bg-zinc-900 text-white shadow-md border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <Bookmark className={cn("w-3.5 h-3.5", activeTab === 'bookmarks' && "fill-current text-[#C8FF00]")} />
            Saved
            {bookmarkedMarkets.length > 0 && (
              <span className="text-[9px] font-mono px-1 rounded-full bg-[#C8FF00]/20 text-[#C8FF00] border border-[#C8FF00]/30 ml-0.5">
                {bookmarkedMarkets.length}
              </span>
            )}
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1 outline-none cursor-pointer",
              activeTab === 'history' ? "bg-zinc-900 text-white shadow-md border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>
          
          <button 
            onClick={() => setActiveTab('stats')}
            className={cn(
              "flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1 outline-none cursor-pointer",
              activeTab === 'stats' ? "bg-zinc-900 text-white shadow-md border border-zinc-800" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Stats
          </button>
        </div>

        {/* Tab Positions Content */}
        {activeTab === 'positions' && (
          <div className="space-y-3.5">
            {positions.length === 0 ? (
              <div className="text-center py-12 bg-zinc-950 rounded-[28px] border border-zinc-900">
                <TrendingUp className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">No Active Positions</h3>
                <p className="text-zinc-500 text-xs">Buy YES or NO shares in any social contracts.</p>
              </div>
            ) : (
              positions.map((pos, i) => {
                const market = markets.find(m => m.id === pos.marketId);
                if (!market) return null;

                const currentPrice = pos.position === 'YES' ? market.yesPrice : market.noPrice;
                const currentValue = pos.shares * currentPrice;
                const cost = pos.shares * pos.avgPrice;
                const pnl = currentValue - cost;
                const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;

                return (
                  <div 
                    key={i} 
                    className="relative overflow-hidden border border-zinc-900 rounded-[24px] p-4 cursor-pointer hover:border-zinc-800 transition-colors"
                    onClick={() => onTradeClick && onTradeClick(market, pos.position)}
                  >
                    <div className="absolute inset-0">
                      <img src={market.imageUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-10 focus:opacity-20 transition-opacity" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/98" />
                    </div>
                    
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-3.5">
                        <img src={market.creator.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-zinc-900" />
                        <div>
                          <p className="text-xs font-black line-clamp-2 leading-snug text-white">{market.question}</p>
                          <p className="text-[9px] text-zinc-500 tracking-wider font-mono font-bold uppercase mt-0.5">Expires soon</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-zinc-900/60 font-mono">
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            {pos.position === 'YES' ? (
                              <span className="bg-[#C8FF00]/10 text-[#C8FF00] text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-[#C8FF00]/15">Yes</span>
                            ) : (
                              <span className="bg-rose-500/15 text-rose-400 text-[9px] font-black px-1.5 py-0.5 rounded uppercase border border-rose-500/15">No</span>
                            )}
                            <span className="text-zinc-400 text-[11px] font-bold">{pos.shares.toFixed(0)} SHARES</span>
                          </div>
                          <div className="text-[10px] text-zinc-500">
                            <span>Cost: {pos.avgPrice.toFixed(2)} → Value: {currentPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-sm text-white">{currentValue.toFixed(2)} {CURRENCY}</p>
                          <p className={cn(
                            "text-[10px] font-bold mt-0.5",
                            pnl >= 0 ? "text-[#C8FF00]" : "text-rose-400"
                          )}>
                            {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPct.toFixed(1)}%)
                          </p>
                        </div>
                      </div>

                      {/* Position Actions Strip: Sell or Settle (Win / Loss simulation) */}
                      <div className="mt-3 pt-2.5 border-t border-zinc-900 flex flex-wrap items-center justify-between gap-2">
                        {onSellPosition && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSellPosition(pos.marketId);
                            }}
                            className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 cursor-pointer outline-none transition-colors"
                          >
                            Sell Position (+{currentValue.toFixed(2)} {CURRENCY})
                          </button>
                        )}

                        {onResolveMarket && (
                          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] text-zinc-500 font-mono">Sim Settle:</span>
                            <button
                              type="button"
                              onClick={() => onResolveMarket(pos.marketId, 'YES')}
                              className="text-[9px] font-black px-2 py-0.5 rounded bg-[#C8FF00]/15 hover:bg-[#C8FF00]/30 text-[#C8FF00] border border-[#C8FF00]/20 cursor-pointer outline-none transition-all active:scale-95"
                              title="Simulate Market Resolved YES"
                            >
                              YES Wins
                            </button>
                            <button
                              type="button"
                              onClick={() => onResolveMarket(pos.marketId, 'NO')}
                              className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-500/15 hover:bg-rose-500/30 text-rose-400 border border-rose-500/20 cursor-pointer outline-none transition-all active:scale-95"
                              title="Simulate Market Resolved NO"
                            >
                              NO Wins
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab Bookmarks Content */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-3.5">
            {bookmarkedMarkets.length === 0 ? (
              <div className="text-center py-12 bg-zinc-950 rounded-[28px] border border-zinc-900 px-6">
                <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">No Bookmarked Markets</h3>
                <p className="text-zinc-500 text-xs max-w-xs mx-auto mb-4 leading-relaxed">
                  Tap the bookmark icon on any contract in the Feed or Explore tab to save it here for fast monitoring.
                </p>
                {onExploreClick && (
                  <button
                    onClick={onExploreClick}
                    className="bg-[#C8FF00] hover:bg-[#b0e000] text-black font-black text-xs px-4 py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(200,255,0,0.2)] cursor-pointer outline-none"
                  >
                    Explore Markets
                  </button>
                )}
              </div>
            ) : (
              bookmarkedMarkets.map((market) => {
                const yesPercent = Math.round(market.yesPrice * 100);
                const noPercent = 100 - yesPercent;

                return (
                  <div 
                    key={market.id}
                    className="relative overflow-hidden border border-zinc-900 rounded-[24px] p-4 bg-zinc-950 hover:border-zinc-800 transition-all cursor-pointer group shadow-sm"
                    onClick={() => onTradeClick && onTradeClick(market, 'YES')}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img 
                          src={market.creator.avatar} 
                          alt={market.creator.username} 
                          referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-full object-cover border border-zinc-800 shrink-0" 
                        />
                        <div className="min-w-0">
                          <span className="text-[11px] font-mono font-bold text-zinc-300 block truncate">@{market.creator.username}</span>
                          <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">{market.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleBookmark?.(market.id);
                          }}
                          className="p-2 rounded-xl bg-[#C8FF00]/10 border border-[#C8FF00]/30 text-[#C8FF00] hover:bg-rose-500/20 hover:border-rose-500/30 hover:text-rose-400 transition-all cursor-pointer"
                          title="Remove bookmark"
                          id={`portfolio-unbookmark-${market.id}`}
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2 mb-3 group-hover:text-[#C8FF00] transition-colors">
                      {market.question}
                    </h4>

                    <div className="flex items-center justify-between pt-2 border-t border-zinc-900 text-[10px] font-mono font-bold">
                      <div className="flex items-center gap-2">
                        <span className="text-[#C8FF00] bg-[#C8FF00]/10 border border-[#C8FF00]/20 px-2 py-0.5 rounded">
                          YES {yesPercent}%
                        </span>
                        <span className="text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded">
                          NO {noPercent}%
                        </span>
                      </div>
                      <span className="text-zinc-500 font-normal">
                        Vol: ${(market.volume / 1000).toFixed(0)}k
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Tab History Content (Resolved markets section showing historic settled payouts) */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            {settledHistory.length === 0 ? (
              <div className="text-center py-12 bg-zinc-950 rounded-[28px] border border-zinc-900">
                <History className="w-10 h-10 text-zinc-700 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-white mb-1">No Settlement Records Yet</h3>
                <p className="text-zinc-500 text-xs">When contracts reach their end date or resolve, payout history shows here.</p>
              </div>
            ) : (
              settledHistory.map((hist) => (
                <div 
                  key={hist.id} 
                  className="bg-zinc-950 border border-zinc-900 rounded-[24px] p-4.5 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-2.5">
                    <h4 className="text-xs font-black text-zinc-300 leading-snug max-w-[80%]">{hist.title}</h4>
                    <span className="text-[10px] text-zinc-500 font-mono font-bold shrink-0">{hist.date}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-900/50 text-[10px] font-mono text-zinc-500">
                    <div>
                      <span>Position Staked</span>
                      <p className="text-white font-bold mt-0.5">{hist.shares} {hist.position}</p>
                    </div>
                    <div>
                      <span>Final Outcome</span>
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[9px] uppercase font-bold mt-0.5 block w-max border",
                        hist.outcome === 'YES' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      )}>
                        Outcome {hist.outcome}
                      </span>
                    </div>
                    <div className="text-right">
                      <span>Payout Result</span>
                      <p className={cn("font-black mt-0.5", hist.profit >= 0 ? "text-[#C8FF00]" : "text-rose-400")}>
                        {(hist.payout ?? (hist as any).win ?? 0).toFixed(0)} {CURRENCY} ({hist.profit >= 0 ? '+' : ''}{hist.profit} {CURRENCY})
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab Stats Content */}
        {activeTab === 'stats' && (
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
              <p className="text-zinc-500 text-[10px] font-bold uppercase font-mono">Prediction Success</p>
              <p className="text-xl font-black text-white mt-1">68.4%</p>
            </div>
            
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
              <p className="text-zinc-500 text-[10px] font-bold uppercase font-mono">Disputes Settle</p>
              <p className="text-xl font-black text-white mt-1">42 Resolved</p>
            </div>

            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 col-span-2">
              <p className="text-zinc-500 text-[10px] font-bold uppercase font-mono mb-1">Cumulative Execution Vol</p>
              <p className="text-2xl font-black text-white">12,450.00 <span className="text-xs text-zinc-500">{CURRENCY}</span></p>
            </div>
          </div>
        )}

      </div>

      {/* Withdraw Modal Dialog */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setShowWithdrawModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="w-5 h-5 text-[#C8FF00]" />
              <h3 className="text-base font-black text-white">Withdraw USDC</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Withdraw funds from your 810 betting balance directly to your connected wallet (0x71C...976F).
            </p>
            <div className="bg-zinc-900/60 rounded-xl p-3 mb-4 text-xs font-mono">
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Available to Withdraw:</span>
                <span className="text-white font-bold">{availableToWithdraw.toFixed(2)} {CURRENCY}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[10px]">
                <span>20% Reserve Buffer:</span>
                <span>{(user.balance * 0.2).toFixed(2)} {CURRENCY}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[100, 250, 500].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomWithdrawAmount(amt.toString())}
                  className={cn(
                    "py-2 rounded-xl text-xs font-mono font-bold border transition-colors",
                    customWithdrawAmount === amt.toString() ? "bg-[#C8FF00]/20 border-[#C8FF00] text-[#C8FF00]" : "bg-zinc-900 border-zinc-800 text-zinc-300"
                  )}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Custom Amount ({CURRENCY})</label>
              <input
                type="number"
                value={customWithdrawAmount}
                onChange={(e) => setCustomWithdrawAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono text-sm focus:outline-none focus:border-[#C8FF00]"
                min="1"
                max={availableToWithdraw}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleWithdrawExecute(parseFloat(customWithdrawAmount) || 0)}
                disabled={parseFloat(customWithdrawAmount) <= 0 || parseFloat(customWithdrawAmount) > availableToWithdraw}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-[#C8FF00] text-black hover:bg-[#b0e000] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(200,255,0,0.2)]"
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit / Faucet Modal Dialog */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 w-full max-w-sm relative shadow-2xl">
            <button 
              onClick={() => setShowDepositModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-zinc-900 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 mb-4">
              <PlusCircle className="w-5 h-5 text-[#C8FF00]" />
              <h3 className="text-base font-black text-white">Deposit &amp; Test Faucet</h3>
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Add mock USDC balance to test placing positions, seeding liquidity, or reloading after total loss.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {[250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setCustomDepositAmount(amt.toString())}
                  className={cn(
                    "py-2 rounded-xl text-xs font-mono font-bold border transition-colors",
                    customDepositAmount === amt.toString() ? "bg-[#C8FF00]/20 border-[#C8FF00] text-[#C8FF00]" : "bg-zinc-900 border-zinc-800 text-zinc-300"
                  )}
                >
                  +${amt}
                </button>
              ))}
            </div>

            <div className="mb-5">
              <label className="text-[10px] text-zinc-400 font-bold uppercase block mb-1">Custom Amount ({CURRENCY})</label>
              <input
                type="number"
                value={customDepositAmount}
                onChange={(e) => setCustomDepositAmount(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono text-sm focus:outline-none focus:border-[#C8FF00]"
                min="1"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDepositExecute(parseFloat(customDepositAmount) || 500)}
                className="flex-1 py-2.5 rounded-xl text-xs font-black bg-[#C8FF00] text-black hover:bg-[#b0e000] transition-all shadow-[0_0_15px_rgba(200,255,0,0.2)] cursor-pointer"
              >
                Add Funds
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
