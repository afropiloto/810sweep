import { useState, useEffect } from 'react';
import { Market, Position, User } from '../types';
import { Zap, Search, ChevronDown, Check, TrendingUp, TrendingDown, Info, ShieldAlert, History } from 'lucide-react';
import { cn } from '../lib/utils';
import { CURRENCY } from '../config';

interface TradeTabProps {
  markets: Market[];
  balance: number;
  isAuthenticated: boolean;
  onLoginRequest: () => void;
  onTrade: (marketId: string, position: 'YES' | 'NO', amount: number) => void;
  initialMarketId?: string;
  initialPosition?: 'YES' | 'NO';
  onClearInitial?: () => void;
}

export function TradeTab({ 
  markets, 
  balance, 
  isAuthenticated, 
  onLoginRequest, 
  onTrade,
  initialMarketId,
  initialPosition,
  onClearInitial
}: TradeTabProps) {
  const [selectedMarketId, setSelectedMarketId] = useState<string>('');
  const [position, setPosition] = useState<'YES' | 'NO'>('YES');
  const [amount, setAmount] = useState<string>('50');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [liveQuote, setLiveQuote] = useState<{ price: number; size: number } | null>(null);

  // Apply initial market and position if passed down
  useEffect(() => {
    if (initialMarketId) {
      setSelectedMarketId(initialMarketId);
    }
    if (initialPosition) {
      setPosition(initialPosition);
    }
    if (initialMarketId || initialPosition) {
      onClearInitial?.();
    }
  }, [initialMarketId, initialPosition, onClearInitial]);

  // Default to the first market with highest volume if none selected
  useEffect(() => {
    if (markets.length > 0 && !selectedMarketId) {
      const highestVol = [...markets].sort((a, b) => b.volume - a.volume)[0];
      setSelectedMarketId(highestVol.id);
    }
  }, [markets, selectedMarketId]);

  // Fetch live market trade preview / quote
  useEffect(() => {
    if (!selectedMarketId) return;
    let isActive = true;

    fetch(`/api/trade/${selectedMarketId}/quote`)
      .then(res => res.json())
      .then(data => {
        if (isActive && data && typeof data.price === 'number') {
          setLiveQuote(data);
        }
      })
      .catch(err => {
        console.warn('Could not fetch active quote:', err.message);
      });

    return () => {
      isActive = false;
    };
  }, [selectedMarketId, position]);

  const activeMarket = markets.find(m => m.id === selectedMarketId);

  const filteredMarkets = markets.filter(m => 
    m.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const amountNum = parseFloat(amount || '0');
  
  // Use active live quote price if available; otherwise fall back to market defaults
  const price = liveQuote && liveQuote.price > 0 ? liveQuote.price : (activeMarket ? (position === 'YES' ? activeMarket.yesPrice : activeMarket.noPrice) : 0.50);
  
  // Calculations
  const fee = 0;
  const netAmount = amountNum;
  const shares = price > 0 ? netAmount / price : 0;
  const potentialPayout = shares * 1.0; // pays 1 USDC on success
  const winMultiplier = amountNum > 0 ? (potentialPayout / amountNum).toFixed(2) : '0.00';
  const slippage = 0.01; // 1% constant dummy
  const isInsufficient = amountNum > balance;

  const isMarketLive = !!activeMarket;

  const handleConfirmTrade = () => {
    if (!isAuthenticated) {
      onLoginRequest();
      return;
    }
    if (!activeMarket || isNaN(amountNum) || amountNum <= 0 || isInsufficient) return;
    onTrade(activeMarket.id, position, amountNum);
    setAmount('50'); // reset
  };

  // Mock recent global trades for the ticker / list
  const recentTrades = [
    { id: 1, user: '0x71...5E', action: 'YES', shares: '420', marketName: activeMarket?.question || 'Current Market', value: `252.00 ${CURRENCY}`, time: 'Just now' },
    { id: 2, user: '0x3B...92', action: 'NO', shares: '180', marketName: activeMarket?.question || 'Current Market', value: `117.00 ${CURRENCY}`, time: '2m ago' },
    { id: 3, user: '0xFA...A1', action: 'YES', shares: '1,500', marketName: activeMarket?.question || 'Current Market', value: `900.00 ${CURRENCY}`, time: '5m ago' },
  ];

  return (
    <div className="h-full w-full bg-black text-white px-4 pt-12 pb-24 overflow-y-auto no-scrollbar">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-full bg-[#C8FF00]/10 flex items-center justify-center border border-[#C8FF00]/20">
          <Zap className="w-4 h-4 text-[#C8FF00]" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Quick Trade</h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Social Prediction Execution</p>
        </div>
      </div>

      {/* Select Market Card */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-4.5 mb-5 relative">
        <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500 mb-2">Target Social Asset</label>
        
        {/* Custom Dropdown Trigger */}
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className="w-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-2xl p-3 flex items-center justify-between transition-colors focus:border-[#C8FF00]/40 outline-none text-left"
          id="trade-market-selector-trigger"
        >
          {activeMarket ? (
            <div className="flex items-center gap-3">
              <img src={activeMarket.creator.avatar} alt="" referrerPolicy="no-referrer" className="w-8 h-8 rounded-full object-cover border border-zinc-800" />
              <div className="flex-1 pr-4">
                <p className="text-zinc-400 text-[9px] font-bold uppercase">@{activeMarket.creator.username}</p>
                <p className="text-white text-xs font-bold line-clamp-1 leading-tight">{activeMarket.question}</p>
              </div>
            </div>
          ) : (
            <span className="text-zinc-500 text-sm">Select social prediction contract...</span>
          )}
          <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
        </button>

        {/* Dropdown Options Drawer with search */}
        {searchOpen && (
          <div className="absolute left-4 right-4 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl z-30 shadow-2xl p-3.5 max-h-[300px] flex flex-col">
            <div className="relative mb-3 flex items-center bg-black border border-zinc-800 rounded-xl px-3 py-2 text-zinc-300">
              <Search className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search handles or question text..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm w-full focus:outline-none placeholder-zinc-600 text-white"
              />
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
              {filteredMarkets.slice(0, 15).map(m => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedMarketId(m.id);
                    setSearchOpen(false);
                    setSearchQuery('');
                  }}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl flex items-center justify-between transition-colors",
                    selectedMarketId === m.id ? "bg-[#C8FF00]/10 border border-[#C8FF00]/15" : "hover:bg-zinc-800 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <img src={m.creator.avatar} alt="" referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover" />
                    <div>
                      <span className="text-[9px] font-black tracking-wide text-[#C8FF00] block">@{m.creator.username}</span>
                      <span className="text-[11px] text-white font-bold leading-tight block truncate">{m.question}</span>
                    </div>
                  </div>
                  {selectedMarketId === m.id && <Check className="w-3.5 h-3.5 text-[#C8FF00]" />}
                </button>
              ))}
              {filteredMarkets.length === 0 && (
                <div className="text-center py-6 text-zinc-600 text-xs font-semibold">No contracts match query</div>
              )}
            </div>
          </div>
        )}
      </div>

      {activeMarket && (
        <>
          {/* YES / NO Toggle Pill Switch */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <button
               onClick={() => setPosition('YES')}
               className={cn(
                 "py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all border outline-none",
                 position === 'YES' 
                   ? "bg-[#C8FF00] text-black border-[#C8FF00] shadow-[0_0_15px_rgba(200,255,0,0.15)]" 
                   : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
               )}
               id="trade-toggle-yes"
            >
              <TrendingUp className="w-4 h-4" />
              YES ({price.toFixed(2)} {CURRENCY})
            </button>
            
            <button
               onClick={() => setPosition('NO')}
               className={cn(
                 "py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all border outline-none",
                 position === 'NO' 
                   ? "bg-rose-500 text-white border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)]" 
                   : "bg-zinc-950 text-zinc-400 border-zinc-900 hover:text-white"
               )}
               id="trade-toggle-no"
            >
              <TrendingDown className="w-4 h-4" />
              NO ({price.toFixed(2)} {CURRENCY})
            </button>
          </div>

          {/* Amount Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-5 mb-5">
            <div className="flex justify-between items-baseline mb-2">
              <label className="block text-[10px] uppercase font-black tracking-widest text-zinc-500">Execution Capital</label>
              <span className="text-[10px] font-mono text-zinc-500">Balance: {balance.toFixed(2)} {CURRENCY}</span>
            </div>

            <div className="relative flex items-center mb-4">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-white font-black text-4xl focus:outline-none"
              />
              <span className="text-zinc-650 font-bold text-lg pr-2 uppercase font-mono">{CURRENCY}</span>
            </div>

            {/* Presets: 1, 10, 50, 100, Max */}
            <div className="grid grid-cols-5 gap-1.5">
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
                      setAmount(balance.toFixed(0));
                    } else {
                      const current = parseFloat(amount || '0') || 0;
                      const inc = parseFloat(btn.value);
                      setAmount((current + inc).toString());
                    }
                  }}
                  className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 hover:border-zinc-750 py-2.5 rounded-xl text-xs font-bold text-zinc-300 transition-colors"
                >
                  {btn.label}
                </button>
              ))}
            </div>
            {isInsufficient && (
              <p className="text-rose-400 text-[10px] font-bold mt-2 text-center">Insufficient Wallet Liquidity</p>
            )}
          </div>

          {/* Estimator Box */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-4.5 mb-6 space-y-3 font-mono text-xs text-zinc-400">
            {liveQuote && (
              <div className="border-b border-zinc-900/80 pb-1.5 flex justify-between items-center text-[9px] text-[#C8FF00] uppercase font-bold">
                <span>Live Quote Feed</span>
                <span>Active ({liveQuote.size} max)</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span>Potential Return:</span>
              <span className="text-[#C8FF00] font-bold">{potentialPayout.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {CURRENCY}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Potential Multiplier:</span>
              <span className="text-zinc-200 font-bold">{winMultiplier}x</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Contract Slippage:</span>
              <span>{(slippage * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Probability Weighting:</span>
              <span className="text-zinc-200 font-bold">{Math.round(price * 100)}%</span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleConfirmTrade}
            disabled={!isMarketLive || amountNum <= 0 || isInsufficient}
            className={cn(
              "w-full py-4 rounded-2xl font-black text-base uppercase tracking-wider transition-all transform active:scale-95 outline-none flex items-center justify-center gap-2",
              (!isMarketLive || amountNum <= 0 || isInsufficient)
                ? "bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-850"
                : position === 'YES' 
                  ? "bg-[#C8FF00] text-black hover:bg-[#b5e600] shadow-[0_0_20px_rgba(200,255,0,0.3)]" 
                  : "bg-rose-500 text-white hover:bg-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)]"
            )}
            id="trade-tab-confirm-btn"
          >
            {!isAuthenticated ? 'Connect Privy to Bet' : (!isMarketLive ? 'Market not live yet' : (isInsufficient ? 'Insufficient Funds' : 'Confirm Bet'))}
          </button>

          {/* Recent trades feed */}
          <div className="mt-8 pt-6 border-t border-zinc-900/60">
            <h3 className="text-xs font-black uppercase text-zinc-500 tracking-widest mb-4 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-[#C8FF00]" />
              Trade Pipeline
            </h3>
            
            <div className="space-y-3">
              {recentTrades.map((t) => (
                <div key={t.id} className="bg-zinc-950 border border-zinc-900/60 p-3 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("w-1.5 h-1.5 rounded-full", t.action === 'YES' ? 'bg-[#C8FF00]' : 'bg-rose-400')} />
                    <div>
                      <span className="text-[10px] font-bold font-mono text-zinc-400">{t.user}</span>
                      <p className="text-[11px] font-semibold text-white truncate max-w-[190px] leading-tight mt-0.5">{t.marketName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={cn("text-xs font-bold font-mono", t.action === 'YES' ? 'text-[#C8FF00]' : 'text-rose-400')}>{t.action}</span>
                    <span className="text-[9px] text-zinc-500 block font-mono">{t.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
