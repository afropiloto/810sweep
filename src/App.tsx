import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Settings, ShieldCheck, TrendingUp, Activity, Award, Search, X, Bookmark } from 'lucide-react';
import { BottomNav } from './components/BottomNav';
import { Feed } from './components/Feed';
import { Post } from './components/Post';
import { TradeTab } from './components/TradeTab';
import { Portfolio } from './components/Portfolio';
import { ClaimModal } from './components/ClaimModal';
import { CultureClub } from './components/CultureClub';
import { LeaderboardTab } from './components/LeaderboardTab';
import { CreateMarket } from './components/CreateMarket';
import { PrivyDemoModal } from './components/PrivyDemoModal';
import { PwaSettingsModal } from './components/PwaSettingsModal';
import { MarketContentModal } from './components/MarketContentModal';
import { mockMarkets, currentUser, mockPositions, mockSettledHistory } from './data/mock';
import { Market, Position, User, SettledHistoryItem } from './types';
import { cn } from './lib/utils';
import { CURRENCY, API_BASE_URL } from './config';
import { mapApiMarketsPayload } from './lib/mapApiMarket';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('feed');
  const [activePostIndex, setActivePostIndex] = useState(0);
  const [selectedMarketForDetails, setSelectedMarketForDetails] = useState<Market | null>(null);
  const [selectedClaimMarket, setSelectedClaimMarket] = useState<Market | null>(null);
  
  const [markets, setMarkets] = useState<Market[]>([]);
  const [positions, setPositions] = useState<Position[]>(mockPositions);
  const [settledHistory, setSettledHistory] = useState<SettledHistoryItem[]>(mockSettledHistory);
  const [user, setUser] = useState(currentUser);
  const [viewingCreator, setViewingCreator] = useState<User | null>(null);
  
  // State for prefilling the trade screen when redirecting from the feed
  const [prefilledTrade, setPrefilledTrade] = useState<{ marketId: string; position: 'YES' | 'NO' } | null>(null);
  
  // Explore search & category states
  const [exploreCategory, setExploreCategory] = useState('All');
  const [exploreQuery, setExploreQuery] = useState('');

  // Bookmarks state with localStorage persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('810_bookmarked_markets');
      return saved ? JSON.parse(saved) : ['0x810f1001', '0x810c2001'];
    } catch {
      return ['0x810f1001', '0x810c2001'];
    }
  });

  const handleToggleBookmark = (marketId: string) => {
    setBookmarkedIds(prev => {
      const isAlready = prev.includes(marketId);
      const next = isAlready ? prev.filter(id => id !== marketId) : [...prev, marketId];
      try {
        localStorage.setItem('810_bookmarked_markets', JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      showToast(isAlready ? 'Removed from Bookmarks' : 'Market Saved to Bookmarks!');
      return next;
    });
  };

  const [toast, setToast] = useState<{ message: string, type: 'default' | 'red' } | null>(null);
  
  // Modal toggle states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPrivyModalOpen, setIsPrivyModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isCultureClubOpen, setIsCultureClubOpen] = useState(false);

  // PWA & System States
  const [isOffline, setIsOffline] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pwaPushAlert, setPwaPushAlert] = useState<{ title: string; message: string } | null>(null);

  // Fetch Markets — prefer live Cloud Run / proxy; map API schema → UI Market
  useEffect(() => {
    const urls = [
      '/api/markets',
      `${API_BASE_URL}/markets`
    ];

    const tryFetch = async (index: number) => {
      if (index >= urls.length) {
        setMarkets(mockMarkets);
        return;
      }
      try {
        const res = await fetch(urls[index]);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        // Proxy may already return UI Market[]; Cloud Run returns { markets: [...] }
        const alreadyMapped =
          Array.isArray(data) &&
          data.length > 0 &&
          data[0]?.creator?.username != null;
        const mapped = alreadyMapped ? (data as Market[]) : mapApiMarketsPayload(data);
        if (mapped.length === 0) throw new Error('Empty or invalid data');
        setMarkets(mapped);
      } catch {
        tryFetch(index + 1);
      }
    };

    tryFetch(0);
  }, []);

  // Simulating splash screen loading time
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Simulated PWA Push Notification self-dismiss timer
  useEffect(() => {
    if (pwaPushAlert) {
      const timer = setTimeout(() => {
        setPwaPushAlert(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [pwaPushAlert]);

  const handleDeposit = () => {
    if (!isAuthenticated) {
      setIsPrivyModalOpen(true);
    } else {
      setUser(prev => ({ ...prev, balance: prev.balance + 1000 }));
      showToast('USDC Wallet funded with +1,000.00 USDC!');
    }
  };

  const handleLoginSuccess = (provider: string = 'Social') => {
    setIsAuthenticated(true);
    setUser(prev => ({
      ...prev,
      username: `${provider.toLowerCase()}_trader`,
      balance: prev.balance === 0 ? 5000 : prev.balance
    }));
    showToast(`Logged in via ${provider}! Privy embedded wallet active.`);
  };

  const handleTriggerTestPush = (title: string, message: string) => {
    setPwaPushAlert({ title, message });
  };

  const handleProfileUpdate = (updatedUser: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
    showToast('Aesthetic bio updated!');
  };

  const showToast = (msg: string, type: 'default' | 'red' = 'default') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Perform buying positions
  const handleTrade = (marketId: string, position: 'YES' | 'NO', amount: number) => {
    const market = markets.find(m => m.id === marketId);
    if (!market) return;

    if (isOffline) {
      showToast('Offline Mode Active: Transaction cached local-first', 'red');
      return;
    }

    if (amount > user.balance) {
      showToast('Insufficient funding available', 'red');
      return;
    }

    const fee = amount * 0.02;
    const netAmount = amount - fee;
    const price = position === 'YES' ? market.yesPrice : market.noPrice;
    const shares = netAmount / price;

    setPositions(prev => {
      const existingIdx = prev.findIndex(p => p.marketId === marketId && p.position === position);
      if (existingIdx >= 0) {
        const existing = prev[existingIdx];
        const updatedShares = existing.shares + shares;
        const totalPaid = (existing.shares * existing.avgPrice) + (shares * price);
        const newAvg = totalPaid / updatedShares;

        const updated = [...prev];
        updated[existingIdx] = {
          ...existing,
          shares: updatedShares,
          avgPrice: newAvg
        };
        return updated;
      }
      return [
        ...prev,
        { marketId, position, shares, avgPrice: price }
      ];
    });

    setUser(prev => ({
      ...prev,
      balance: prev.balance - amount
    }));

    showToast(`Purchased ${shares.toFixed(1)} ${position} Shares (Fee: ${fee.toFixed(2)} ${CURRENCY})`);
  };

  // Full Market Resolution simulation engine: settling winners, recording losses, crediting payouts
  const handleResolveMarket = (marketId: string, outcome: 'YES' | 'NO') => {
    const market = markets.find(m => m.id === marketId);
    if (!market) return;

    const resolvedMarket: Market = {
      ...market,
      status: 'resolved',
      resolutionOutcome: outcome,
      resolvedAt: 'Just now',
      yesPrice: outcome === 'YES' ? 1.00 : 0.00,
      noPrice: outcome === 'NO' ? 1.00 : 0.00,
      resolutionSource: '810 Settlement Oracle Verification Protocol'
    };

    // 1. Update markets state
    setMarkets(prev => prev.map(m => m.id === marketId ? resolvedMarket : m));

    // 2. If details sheet is currently viewing this market, update it immediately to display certificate
    if (selectedMarketForDetails && selectedMarketForDetails.id === marketId) {
      setSelectedMarketForDetails(resolvedMarket);
    }

    // 3. Process positions held by the user in this contract
    const userPositionsInMarket = positions.filter(p => p.marketId === marketId);

    if (userPositionsInMarket.length > 0) {
      let totalPayout = 0;
      const newHistoryEntries: SettledHistoryItem[] = [];

      userPositionsInMarket.forEach(pos => {
        const isWinner = pos.position === outcome;
        const cost = pos.shares * pos.avgPrice;
        const payout = isWinner ? pos.shares * 1.00 : 0;
        const profit = payout - cost;

        if (isWinner) {
          totalPayout += payout;
        }

        newHistoryEntries.push({
          id: `settled_${Date.now()}_${pos.marketId}_${pos.position}`,
          marketId: market.id,
          title: market.question,
          category: market.category,
          position: pos.position,
          outcome: outcome,
          shares: Math.round(pos.shares),
          cost: Math.round(cost),
          payout: Math.round(payout),
          profit: Math.round(profit),
          date: 'Just now',
          isWin: isWinner
        });
      });

      // Credit winning payout to user balance & update user profit stats
      setUser(prev => ({
        ...prev,
        balance: prev.balance + totalPayout,
        stats: {
          ...prev.stats,
          totalProfit: (prev.stats?.totalProfit || 0) + newHistoryEntries.reduce((acc, h) => acc + h.profit, 0),
          winRate: 72.5
        }
      }));

      // Append to settled history
      setSettledHistory(prev => [...newHistoryEntries, ...prev]);

      // Remove settled positions from active positions list
      setPositions(prev => prev.filter(p => p.marketId !== marketId));

      const hasWin = newHistoryEntries.some(h => h.isWin);
      const hasLoss = newHistoryEntries.some(h => !h.isWin);

      if (hasWin && !hasLoss) {
        showToast(`🏆 Market Resolved ${outcome}! Claimed +${totalPayout.toFixed(2)} ${CURRENCY} winning payout!`);
      } else if (hasLoss && !hasWin) {
        showToast(`💀 Market Resolved ${outcome}. Position lost and liquidated at 0.00 ${CURRENCY}.`, 'red');
      } else {
        showToast(`Market settled as ${outcome}! Net payout: +${totalPayout.toFixed(2)} ${CURRENCY}`);
      }
    } else {
      showToast(`Market verified and resolved as ${outcome}!`);
    }
  };

  // Sell / exit active position at current market odds
  const handleSellPosition = (marketId: string) => {
    const currentPos = positions.find(p => p.marketId === marketId);
    const market = markets.find(m => m.id === marketId);
    if (!currentPos || !market) return;

    const currentPrice = currentPos.position === 'YES' ? market.yesPrice : market.noPrice;
    const refund = currentPos.shares * currentPrice;

    setUser(prev => ({ ...prev, balance: prev.balance + refund }));
    setPositions(prev => prev.filter(p => p.marketId !== marketId));
    showToast(`Sold position for +${refund.toFixed(2)} ${CURRENCY}`);
  };

  // Withdraw funds to connected wallet
  const handleWithdrawFunds = (amount: number) => {
    setUser(prev => ({ ...prev, balance: Math.max(0, prev.balance - amount) }));
    showToast(`Withdrawn ${amount.toFixed(2)} ${CURRENCY} to 0x71C...976F`);
  };

  // Deposit funds from faucet
  const handleDepositFunds = (amount: number) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
    showToast(`Deposited +${amount.toFixed(2)} ${CURRENCY} to balance!`);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(currentUser); // Reset to initial mocks
    setPositions(mockPositions);
    showToast('Privy wallet disjointed');
  };

  const handleCreatorClick = (creator: User) => {
    setViewingCreator(creator);
  };

  // Filter explore markets based on query & category tags
  const filteredExploreMarkets = markets.filter(market => {
    if (exploreCategory === 'Saved') {
      const isSaved = bookmarkedIds.includes(market.id);
      const matchesQuery = market.question.toLowerCase().includes(exploreQuery.toLowerCase()) || 
                           market.creator.username.toLowerCase().includes(exploreQuery.toLowerCase());
      return isSaved && matchesQuery;
    }
    const matchesCategory = exploreCategory === 'All' || market.category.toLowerCase() === exploreCategory.toLowerCase();
    const matchesQuery = market.question.toLowerCase().includes(exploreQuery.toLowerCase()) || 
                         market.creator.username.toLowerCase().includes(exploreQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen w-screen bg-[#08080a] flex items-center justify-center font-sans overflow-x-hidden p-0 md:p-6 selection:bg-[#C8FF00]/30 select-none">
      
      {/* 
        Sleek Device Frame Center wrapper for Desktop / Wide previews 
        Centering the mobile container (390px x 844px) against a clean black background instead of stretching
      */}
      <div className="w-full h-screen md:h-[844px] md:w-[390px] md:rounded-[48px] md:border-[12px] md:border-zinc-900 md:shadow-[0_24px_80px_rgba(0,0,0,0.8)] relative bg-black md:overflow-hidden flex flex-col md:border-t-[14px]">

        
        {/* Notch simulation decoration on desktop */}
        <div className="hidden md:block absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-900 rounded-full z-150 border border-zinc-800" />

        {/* Splash Loading Animation Page */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 z-[200] bg-black flex flex-col items-center justify-center"
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-radial-gradient from-[#C8FF00]/10 to-transparent blur-3xl opacity-60" />
              </div>
              
              <motion.div
                initial={{ scale: 0.82, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative z-10 flex flex-col items-center"
              >
                <div className="w-20 h-20 bg-[#C8FF00] rounded-2xl border-4 border-black shadow-[0_0_40px_rgba(200,255,0,0.4)] flex items-center justify-center mb-6">
                  <span className="text-black font-black italic text-5xl leading-none mt-1">8</span>
                </div>
                <h1 className="text-3xl font-black tracking-wider text-white mb-1.5 font-mono">810.ONE</h1>
                <p className="text-[#C8FF00] font-black tracking-widest text-[9px] uppercase">Prediction Mechanics</p>
              </motion.div>
              
              <div className="absolute bottom-12 w-40 h-1 bg-zinc-900 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#C2F500] to-[#E3FF5E]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Action Toast Alerts */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: -40, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -45, scale: 0.9 }}
              className={cn(
                "absolute top-6 left-1/2 -translate-x-1/2 z-[150] px-4 py-2.5 rounded-full font-black text-xs space-x-2 shadow-2xl flex items-center justify-center border",
                toast.type === 'red' 
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30" 
                  : "bg-black/90 text-[#C8FF00] border-[#C8FF00]/25"
              )}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-ping mr-1" />
              <span>{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Offline Warning banner if offline mode active */}
        {isOffline && (
          <div className="absolute top-18 left-4 right-4 z-[110] bg-rose-500/90 backdrop-blur-md border border-rose-600/50 px-3 py-2 rounded-xl flex items-center justify-between shadow-[0_4px_25px_rgba(244,63,94,0.35)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span className="text-[10px] text-white font-black uppercase tracking-wider font-mono">Offline Emulator Sandbox Mode</span>
            </div>
            <button 
              onClick={() => setIsOffline(false)} 
              className="text-[9px] text-white/90 hover:text-white font-black underline uppercase"
            >
              Reconnect
            </button>
          </div>
        )}

        {/* Simulated PWA Push Notification System Banner Alert */}
        <AnimatePresence>
          {pwaPushAlert && (
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 24, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 220 }}
              className="absolute top-safe top-2 left-3 right-3 z-[210] max-w-[364px] mx-auto bg-zinc-900/95 backdrop-blur-xl border border-zinc-800/90 rounded-2xl p-4 flex items-start gap-3 shadow-[0_12px_40px_rgba(0,0,0,0.8)] cursor-pointer"
              onClick={() => setPwaPushAlert(null)}
            >
              <div className="w-10 h-10 bg-[#C8FF00] rounded-xl border-2 border-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(200,255,0,0.4)]">
                <span className="text-black font-black italic text-lg leading-none">8</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h4 className="text-white font-black text-xs truncate uppercase tracking-wide">{pwaPushAlert.title}</h4>
                  <span className="text-[8px] text-zinc-500 font-bold uppercase font-mono">Just Now</span>
                </div>
                <p className="text-zinc-300 text-[11px] font-medium leading-normal pr-1">{pwaPushAlert.message}</p>
                <div className="mt-1.5 flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-[#C8FF00] rounded-full animate-pulse" />
                  <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider font-mono font-bold">Tap to dismiss</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Wallet Header display (Fixed on Home & Explore tabs for aesthetic telemetry) */}
        {(activeTab === 'feed' || activeTab === 'explore') && (
          <div className="absolute top-0 left-0 right-0 p-4 z-40 flex justify-between items-center pointer-events-none pt-safe">
            <div className="flex items-center gap-2 pointer-events-auto">
              <div className="w-8 h-8 bg-[#C8FF00] rounded-lg border-2 border-black flex items-center justify-center shadow-[0_2px_10px_rgba(200,255,0,0.2)]">
                <span className="text-black font-black italic text-base leading-none">8</span>
              </div>
              <span className="text-white font-black text-lg tracking-wider font-mono">810.ONE</span>
            </div>
            
            <button 
              onClick={handleDeposit}
              className="bg-black/80 backdrop-blur-md border border-zinc-800/80 px-3 py-1.5 rounded-full flex items-center gap-2 pointer-events-auto hover:border-[#C8FF00]/40 transition-colors cursor-pointer outline-none"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8FF00] animate-pulse" />
              <span className="text-[10px] uppercase font-black text-zinc-500 font-mono">BALANCE:</span>
              <span className="text-[#C8FF00] font-black text-xs font-mono">{user.balance.toFixed(0)} USDC</span>
            </button>
          </div>
        )}

        {/* Scrollable View Content Portals */}
        <div className="flex-1 w-full bg-black relative overflow-hidden">
          
          {/* HOME TIKTOK SWIPE FEED */}
          {activeTab === 'feed' && (
            <div 
              onScroll={(e) => {
                const scrollTop = e.currentTarget.scrollTop;
                const height = e.currentTarget.clientHeight;
                if (height > 0) {
                  const idx = Math.round(scrollTop / height);
                  if (idx !== activePostIndex) {
                    setActivePostIndex(idx);
                  }
                }
              }}
              className="h-full w-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
            >
              {markets.map((market, idx) => (
                <Post
                  key={market.id}
                  market={market}
                  isActive={idx === activePostIndex}
                  isBookmarked={bookmarkedIds.includes(market.id)}
                  onToggleBookmark={handleToggleBookmark}
                  userPosition={positions.find(p => p.marketId === market.id)?.position}
                  onTradeClick={(position) => {
                    if (!isAuthenticated) {
                      setIsPrivyModalOpen(true);
                    } else {
                      setPrefilledTrade({ marketId: market.id, position });
                      setSelectedMarketForDetails(market);
                    }
                  }}
                  onAmplify={(action) => {
                    showToast(`Amplified market: ${action}!`);
                  }}
                  onSwap={() => {
                    const currentPos = positions.find(p => p.marketId === market.id);
                    if (currentPos) {
                      const opposite = currentPos.position === 'YES' ? 'NO' : 'YES';
                      setPositions(prev => prev.filter(p => p.marketId !== market.id));
                      handleTrade(market.id, opposite, 100);
                      showToast(`Position swapped to ${opposite}`);
                    }
                  }}
                  onSell={() => {
                    const currentPos = positions.find(p => p.marketId === market.id);
                    if (currentPos) {
                      const refund = currentPos.shares * (currentPos.position === 'YES' ? market.yesPrice : market.noPrice);
                      setUser(prev => ({ ...prev, balance: prev.balance + refund }));
                      setPositions(prev => prev.filter(p => p.marketId !== market.id));
                      showToast(`Sold position for +${refund.toFixed(1)} USDC`);
                    }
                  }}
                  onCreatorClick={handleCreatorClick}
                  onClaimClick={(m) => setSelectedClaimMarket(m)}
                  onMarketDetailsClick={(m) => setSelectedMarketForDetails(m)}
                />
              ))}
            </div>
          )}

          {/* EXPLORE / CATEGORIES SEARCH TAB */}
          {activeTab === 'explore' && (
            <div className="h-full w-full bg-black text-white pt-18 pb-24 px-4 overflow-y-auto no-scrollbar">
              <div className="mb-4">
                <p className="text-[10px] text-[#C8FF00] font-bold tracking-widest uppercase mb-1">Contract Center</p>
                <h1 className="text-2xl font-black tracking-tight">Explore Markets</h1>
              </div>

              {/* Dynamic Styled Search Filter */}
              <div className="relative mb-5 flex items-center bg-zinc-950 border border-zinc-900 rounded-2xl px-3.5 py-3 text-zinc-300">
                <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search tech brands, consumer hype, streams, or tickers ($AAPL, $OPENAI)..."
                  value={exploreQuery}
                  onChange={(e) => setExploreQuery(e.target.value)}
                  className="bg-transparent text-xs w-full focus:outline-none placeholder-zinc-650 text-white font-medium"
                />
                {exploreQuery && (
                  <button onClick={() => setExploreQuery('')} className="p-1 rounded-full bg-zinc-900">
                    <X className="w-3 h-3 text-zinc-400" />
                  </button>
                )}
              </div>

              {/* Client Investor Spotlight Banner */}
              <div className="mb-5 rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-950/30 via-zinc-950 to-purple-950/30 p-3.5 relative overflow-hidden">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    Portfolio Client Spotlight
                  </span>
                  <span className="text-[9px] font-mono text-zinc-500 font-bold">Driving Enterprise Volume</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div 
                    onClick={() => {
                      setExploreCategory('Events');
                      setExploreQuery('flovely');
                    }}
                    className="cursor-pointer rounded-xl bg-black/60 border border-amber-400/20 p-2.5 hover:border-amber-400/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-amber-300 group-hover:text-white">Flovely</span>
                      <span className="text-[8px] font-mono font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20 px-1 rounded">Tomorrowland</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">Luxury festival travel experiences & Electify.vote fan governance</p>
                  </div>

                  <div 
                    onClick={() => {
                      setExploreCategory('Artists & AI');
                      setExploreQuery('lol');
                    }}
                    className="cursor-pointer rounded-xl bg-black/60 border border-fuchsia-400/20 p-2.5 hover:border-fuchsia-400/50 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-black text-fuchsia-300 group-hover:text-white">LOL Int'l</span>
                      <span className="text-[8px] font-mono font-bold bg-fuchsia-400/10 text-fuchsia-400 border border-fuchsia-400/20 px-1 rounded">TEAM WANG</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2 leading-tight">Bangkok agency, UTC immersive & mega-concert organizer</p>
                  </div>
                </div>
              </div>

              {/* Filter tags horizontal belt */}
              <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
                {['All', 'Saved', 'Tech & Brands', 'Events', 'Artists & AI', 'Sports', 'Music', 'Entertainment', 'Gaming'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => setExploreCategory(tag)}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border outline-none whitespace-nowrap cursor-pointer flex items-center gap-1.5",
                      exploreCategory === tag 
                        ? "bg-[#C8FF00] text-black border-[#C8FF00] font-bold shadow-md" 
                        : "bg-zinc-950 text-zinc-500 border-zinc-900 hover:text-white"
                    )}
                  >
                    {tag === 'Saved' && <Bookmark className={cn("w-3 h-3", exploreCategory === tag ? "fill-black text-black" : "text-zinc-500")} />}
                    {tag === 'Saved' ? `Saved (${bookmarkedIds.length})` : tag}
                  </button>
                ))}
              </div>

              {/* Grid of sleek high-end cards */}
              <div className="space-y-3.5">
                {filteredExploreMarkets.map(market => {
                  const yesPercent = Math.round(market.yesPrice * 100);
                  const isSaved = bookmarkedIds.includes(market.id);
                  return (
                    <div 
                      key={market.id} 
                      className="relative overflow-hidden rounded-2xl border border-zinc-900/80 bg-zinc-950 p-4 cursor-pointer hover:border-zinc-800 transition-all active:scale-[0.99] group flex gap-3.5 items-center justify-between" 
                      onClick={() => setSelectedMarketForDetails(market)}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <img src={market.creator.avatar} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-13 h-13 rounded-full object-cover border border-zinc-900 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[9px] uppercase tracking-wider font-black font-mono text-[#C8FF00] bg-[#C8FF00]/10 border border-[#C8FF00]/20 px-1.5 py-0.2 rounded">
                              ${market.creator.username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8)}
                            </span>
                            <span className="text-[9px] uppercase tracking-wider font-bold font-mono text-zinc-400">@{market.creator.username}</span>
                            <span className="text-[8px] text-zinc-500 font-mono">• {market.category}</span>
                          </div>
                          <p className="text-xs font-bold leading-tight text-white line-clamp-2 mt-0.5 pr-2 group-hover:text-[#C8FF00] transition-colors">{market.question}</p>
                          
                          <div className="flex items-center gap-2 mt-2 font-mono text-[9px] font-bold flex-wrap">
                            <span className="bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 px-1.5 py-0.5 rounded uppercase">YES {yesPercent}%</span>
                            <span className="text-zinc-400 font-semibold">{market.currentValue >= 1000 ? `${(market.currentValue / 1000).toFixed(1)}k` : market.currentValue} {market.metricLabel}</span>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500">Vol: ${(market.volume / 1000).toFixed(0)}k</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleBookmark(market.id);
                        }}
                        className={cn(
                          "p-2.5 rounded-xl border transition-all shrink-0 cursor-pointer outline-none ml-2",
                          isSaved 
                            ? "bg-[#C8FF00] border-[#C8FF00] text-black shadow-[0_0_12px_rgba(200,255,0,0.3)]" 
                            : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                        )}
                        title={isSaved ? "Remove Bookmark" : "Save Bookmark"}
                      >
                        <Bookmark className={cn("w-3.5 h-3.5", isSaved && "fill-black")} />
                      </button>
                    </div>
                  );
                })}
                {filteredExploreMarkets.length === 0 && (
                  <div className="text-center py-16 text-zinc-500 text-xs font-semibold px-4">
                    {exploreCategory === 'Saved' 
                      ? 'No bookmarked contracts found. Tap the bookmark icon on any market in the Feed or Explore to save it here.' 
                      : 'No active contracts match search telemetry'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* CREATE TAB */}
          {activeTab === 'create' && (
            <div className="absolute inset-0 bg-black z-40 overflow-y-auto pt-safe pb-24">
              <CreateMarket 
                onClose={() => setActiveTab('feed')} 
                onCreateMarket={(market) => {
                  const seedLiquidity = market.liquidity || 100;
                  if (seedLiquidity > user.balance) {
                    showToast(`Insufficient balance to seed ${seedLiquidity} ${CURRENCY} liquidity. Faucet available in Portfolio.`, 'red');
                    return;
                  }

                  const newMarket: Market = {
                    id: `0x810_${Date.now()}`,
                    creator: user,
                    marketCreator: user,
                    contentUrl: market.contentUrl || `https://tiktok.com/@${user.username}/video/test`,
                    imageUrl: market.imageUrl || 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80',
                    contentType: 'image',
                    question: market.question || `Will target be achieved within timeframe?`,
                    metricLabel: market.metricLabel || 'Views',
                    currentValue: 0,
                    targetValue: market.targetValue || 1000000,
                    endTime: new Date(Date.now() + 86400000).toISOString(),
                    yesPrice: 0.5,
                    noPrice: 0.5,
                    volume: seedLiquidity,
                    liquidity: seedLiquidity,
                    category: market.category || 'Culture',
                    whales: [
                      { username: `@${user.username}`, position: 'YES', amount: seedLiquidity }
                    ],
                    status: 'active'
                  };

                  setUser(prev => ({
                    ...prev,
                    balance: prev.balance - seedLiquidity,
                    stats: {
                      ...prev.stats,
                      marketsCreated: (prev.stats?.marketsCreated || 0) + 1,
                      trades: (prev.stats?.trades || 0) + 1
                    }
                  }));

                  setMarkets(prev => [newMarket, ...prev]);
                  setActiveTab('feed');
                  setActivePostIndex(0);
                  showToast(`🚀 Launched new market: "${newMarket.question}" (-${seedLiquidity} ${CURRENCY} seed)`);
                }} 
              />
            </div>
          )}

          {/* HYPE LEADERBOARD TAB */}
          {activeTab === 'leaderboard' && (
            <div className="h-full w-full bg-black overflow-y-auto no-scrollbar pt-12 pb-24">
              <LeaderboardTab />
            </div>
          )}

          {/* ACTIVE TRADING PORTFOLIO TAB */}
          {activeTab === 'portfolio' && (
            <Portfolio 
              user={user} 
              positions={positions} 
              markets={markets} 
              isAuthenticated={isAuthenticated}
              onLoginRequest={() => setIsPrivyModalOpen(true)}
              onBuyUSDT={handleDeposit} 
              onTradeClick={(m) => setSelectedMarketForDetails(m)}
              showSuccessToast={(msg) => showToast(msg)}
              onEditProfile={() => setIsEditProfileModalOpen(true)}
              onLogout={handleLogout}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={handleToggleBookmark}
              onExploreClick={() => setActiveTab('explore')}
              settledHistory={settledHistory}
              onSellPosition={handleSellPosition}
              onResolveMarket={handleResolveMarket}
              onWithdraw={handleWithdrawFunds}
              onDeposit={handleDepositFunds}
            />
          )}

        </div>

        {/* Native Bottom Tab Bar (5 tabs) */}
        <BottomNav activeTab={activeTab} onChange={setActiveTab} />

      </div>

      {/* Slide-Up Culture Club Analytics Center Overlay */}
      <AnimatePresence>
        {isCultureClubOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 md:inset-auto md:bottom-6 md:h-[800px] md:w-[390px] z-[90] bg-black text-white overflow-hidden flex flex-col md:rounded-[40px] md:border-[10px] md:border-zinc-900"
          >
            {/* Custom culture drawer header */}
            <div className="bg-zinc-950 border-b border-zinc-900 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ChevronLeft 
                  onClick={() => setIsCultureClubOpen(false)}
                  className="w-5 h-5 text-[#C8FF00] cursor-pointer hover:scale-105 transition-transform" 
                />
                <span className="text-xs font-black uppercase tracking-widest text-zinc-300">Culture Club Intelligence</span>
              </div>
              <button 
                onClick={() => setIsCultureClubOpen(false)}
                className="text-zinc-500 hover:text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
              <CultureClub />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Creator Profile Overlay overlay */}
      <AnimatePresence>
        {viewingCreator && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 md:inset-auto md:bottom-6 md:h-[800px] md:w-[390px] z-[100] bg-black text-white overflow-y-auto pb-24"
          >
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md p-4 flex items-center gap-4 border-b border-zinc-900">
              <button onClick={() => setViewingCreator(null)} className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-850 hover:text-[#C8FF00] transition-all outline-none">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="text-sm font-black uppercase tracking-wider">Social Core</h2>
            </div>
            
            <div className="flex flex-col items-center mt-8 mb-6 px-4 text-center">
              <img src={viewingCreator.avatar} alt="" referrerPolicy="no-referrer" className="w-20 h-20 rounded-full border-4 border-zinc-900 mb-3 object-cover shadow-xl" />
              <div className="flex items-center gap-1.5 mb-1">
                <h1 className="text-xl font-black">@{viewingCreator.username}</h1>
                {(viewingCreator.username.includes('flovely') || viewingCreator.username.includes('lol')) && (
                  <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">Investor Partner</span>
                )}
              </div>

              {viewingCreator.bio && (
                <p className="text-xs text-zinc-400 max-w-xs mb-3 font-medium leading-relaxed">{viewingCreator.bio}</p>
              )}

              {/* Badges */}
              {viewingCreator.badges && viewingCreator.badges.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {viewingCreator.badges.map(badge => (
                    <span key={badge} className="text-[9px] font-mono font-bold bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              {/* Official Verified Links */}
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {viewingCreator.username.includes('flovely') && (
                  <>
                    <a 
                      href="https://flovely.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-amber-400 hover:bg-amber-300 text-black px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                    >
                      Flovely.com
                    </a>
                    <a 
                      href="https://www.electify.vote/Flovely"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-850 hover:bg-zinc-800 text-white border border-amber-400/40 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Electify.vote
                    </a>
                  </>
                )}

                {viewingCreator.username.includes('lol') && (
                  <>
                    <a 
                      href="https://www.lolinternational.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-fuchsia-500 hover:bg-fuchsia-400 text-white px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(217,70,239,0.2)]"
                    >
                      LOL Agency
                    </a>
                    <a 
                      href="https://www.lolinternational.com/portfolio"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-zinc-850 hover:bg-zinc-800 text-white border border-fuchsia-400/40 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all"
                    >
                      Agency Portfolio
                    </a>
                  </>
                )}

                {!viewingCreator.username.includes('flovely') && !viewingCreator.username.includes('lol') && (
                  <a 
                    href={`https://tiktok.com/@${viewingCreator.username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#C8FF00] hover:bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(200,255,0,0.2)]"
                  >
                    View Social Profile
                  </a>
                )}
              </div>

              <p className="text-zinc-500 font-mono text-[10px] uppercase font-bold mt-1">Verified 810 Culture Partner</p>
            </div>

            <div className="px-4">
              <h3 className="font-black text-xs uppercase text-zinc-400 tracking-wider mb-3">Authored Challenges</h3>
              <div className="space-y-3">
                {markets.filter(m => m.creator.id === viewingCreator.id).slice(0, 3).map(m => (
                  <div 
                    key={m.id} 
                    onClick={() => {
                      setSelectedMarketForDetails(m);
                      setViewingCreator(null);
                    }}
                    className="relative overflow-hidden rounded-2xl border border-zinc-900/80 bg-zinc-950 p-4 cursor-pointer hover:border-zinc-800 transition-all flex gap-3.5 items-center"
                  >
                    <img src={m.imageUrl} alt="" referrerPolicy="no-referrer" className="w-12 h-12 rounded-xl object-cover shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold leading-tight text-white line-clamp-2">{m.question}</p>
                      <span className="text-[10px] text-[#C8FF00] font-bold font-mono mt-1.5 block">YES {(m.yesPrice * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Market Content Modal bottom sheet */}
      {selectedMarketForDetails && (
        <MarketContentModal
          isOpen={true}
          onClose={() => {
            setSelectedMarketForDetails(null);
            setPrefilledTrade(null);
          }}
          market={selectedMarketForDetails}
          isBookmarked={bookmarkedIds.includes(selectedMarketForDetails.id)}
          onToggleBookmark={handleToggleBookmark}
          onCreatorClick={(creator) => {
            setSelectedMarketForDetails(null);
            handleCreatorClick(creator);
          }}
          onTrade={handleTrade}
          balance={user.balance}
          isAuthenticated={isAuthenticated}
          onLoginRequest={() => setIsPrivyModalOpen(true)}
          initialPosition={prefilledTrade && prefilledTrade.marketId === selectedMarketForDetails.id ? prefilledTrade.position : undefined}
          userPosition={positions.find(p => p.marketId === selectedMarketForDetails.id)}
          onSellPosition={handleSellPosition}
          onResolveMarket={handleResolveMarket}
        />
      )}

      {/* Claim Modal bottom details */}
      {selectedClaimMarket && (
        <ClaimModal
          market={selectedClaimMarket}
          onClose={() => setSelectedClaimMarket(null)}
          onClaimEarnings={(amount) => {
            setUser(prev => ({ ...prev, balance: prev.balance + amount }));
            showToast(`Claimed +${amount.toLocaleString()} ${CURRENCY} creator pool royalties!`);
          }}
        />
      )}

      {/* Privy Demo Modal popup */}
      <PrivyDemoModal 
        isOpen={isPrivyModalOpen}
        onClose={() => setIsPrivyModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Integrated PWA & Profile Configurations Modal */}
      <PwaSettingsModal
        isOpen={isEditProfileModalOpen}
        user={user}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSaveProfile={handleProfileUpdate}
        isOffline={isOffline}
        setIsOffline={setIsOffline}
        isInstalled={isInstalled}
        setIsInstalled={setIsInstalled}
        pushEnabled={pushEnabled}
        setPushEnabled={setPushEnabled}
        onTriggerTestPush={handleTriggerTestPush}
      />

    </div>
  );
}
