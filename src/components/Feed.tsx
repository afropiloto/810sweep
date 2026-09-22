import { useState } from 'react';
import { Market, Position } from '../types';
import { RefreshCw, Play, Volume2, Clock, DollarSign, ArrowUpRight, Award, MessageSquare, Share2, Bookmark } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { CURRENCY } from '../config';

interface FeedProps {
  markets: Market[];
  positions: Position[];
  onMarketDetailsClick: (market: Market) => void;
  onTradeClick: (market: Market, position: 'YES' | 'NO') => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (marketId: string) => void;
}

export function Feed({ 
  markets, 
  positions, 
  onMarketDetailsClick, 
  onTradeClick,
  bookmarkedIds = [],
  onToggleBookmark 
}: FeedProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1200);
  };

  // Sort by volume descending as requested: "GET /markets (sorted by volume)"
  const sortedMarkets = [...markets].sort((a, b) => b.volume - a.volume);

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

  return (
    <div className="h-full w-full bg-black text-white flex flex-col pb-24">
      {/* Feed Sub-Header with Refresh */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-900/80 bg-black/80 backdrop-blur-md sticky top-0 z-20">
        <span className="text-xs font-black tracking-widest text-[#C8FF00] uppercase">Trending Markets</span>
        <button 
          onClick={handleRefresh}
          className={cn(
            "p-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-400 hover:text-[#C8FF00] transition-all",
            isRefreshing && "animate-spin text-[#C8FF00]"
          )}
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Market Cards Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 no-scrollbar">
        {isRefreshing && (
          <div className="flex justify-center items-center py-2">
            <span className="text-xs font-bold text-zinc-500 animate-pulse">Checking chain telemetry...</span>
          </div>
        )}

        {sortedMarkets.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <p className="text-zinc-500 text-sm font-semibold">No social markets found.</p>
            <button onClick={handleRefresh} className="text-xs border border-zinc-800 px-3 py-1.5 rounded-full text-[#C8FF00]">
              Retry Connection
            </button>
          </div>
        ) : (
          sortedMarkets.map((market, idx) => {
            const platform = getPlatformBadge(market.creator.username, market.category);
            const yesPercent = Math.round(market.yesPrice * 100);
            const noPercent = 100 - yesPercent;
            const progressVal = (market.currentValue / market.targetValue) * 100;
            const positionInfo = positions.find(p => p.marketId === market.id);

            return (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.4) }}
                key={market.id}
                onClick={() => onMarketDetailsClick(market)}
                className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 hover:border-zinc-800 transition-all active:scale-[0.99] cursor-pointer group shadow-[0_4px_24px_rgba(0,0,0,0.6)] relative overflow-hidden"
              >
                {/* Background Brand Tint */}
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#C8FF00] via-zinc-850 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Card Top: Creator Avatar + platform badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img 
                        src={market.creator.avatar} 
                        alt={market.creator.username} 
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-zinc-800 object-cover" 
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border border-black bg-[#C8FF00]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors">@{market.creator.username}</h4>
                        <span className="text-[9px] font-black font-mono text-[#C8FF00] bg-[#C8FF00]/10 border border-[#C8FF00]/25 px-1 py-0.2 rounded">
                          ${market.creator.username.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7)}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium">Fee: 2.0%</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <div className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center gap-1.5", platform.color)}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", platform.dotColor)} />
                      {platform.label}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark?.(market.id);
                      }}
                      className={cn(
                        "p-1.5 rounded-lg border transition-all cursor-pointer outline-none",
                        bookmarkedIds.includes(market.id)
                          ? "bg-[#C8FF00] border-[#C8FF00] text-black shadow-[0_0_12px_rgba(200,255,0,0.3)]"
                          : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      )}
                      title={bookmarkedIds.includes(market.id) ? "Remove Bookmark" : "Save Bookmark"}
                      id={`feed-bookmark-${market.id}`}
                    >
                      <Bookmark className={cn("w-3.5 h-3.5", bookmarkedIds.includes(market.id) && "fill-black")} />
                    </button>
                  </div>
                </div>

                {/* Card Body: Market Question */}
                <h3 className="text-base font-black text-white leading-snug mb-3 tracking-tight line-clamp-2 pr-2">
                  {market.question}
                </h3>

                {/* Visual Media Preview if available */}
                {market.imageUrl && (
                  <div className="relative mb-3.5 h-36 w-full overflow-hidden rounded-xl border border-zinc-900 bg-zinc-900">
                    <img 
                      src={market.imageUrl} 
                      alt="" 
                      referrerPolicy="no-referrer" 
                      loading="lazy"
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-zinc-300 border border-zinc-850">
                        {market.metricLabel}: <span className="text-[#C8FF00] font-bold">{market.currentValue.toLocaleString()}</span>
                      </span>
                      <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded text-zinc-400 border border-zinc-850 uppercase font-bold text-[9px]">
                        {market.category}
                      </span>
                    </div>
                  </div>
                )}

                {/* Probability Slider/Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="h-2.5 bg-rose-950 rounded-full overflow-hidden flex border border-rose-900/30">
                    <div 
                      className="h-full bg-gradient-to-r from-[#C2F500] to-[#E3FF5E] rounded-r-md shadow-[0_0_8px_rgba(200,255,0,0.3)] transition-all duration-500"
                      style={{ width: `${yesPercent}%` }}
                    />
                  </div>
                  
                  {/* Probability labels */}
                  <div className="flex justify-between items-center text-xs font-mono font-bold tracking-tight">
                    <span className="text-[#C8FF00] flex items-center gap-0.5">
                      YES <span className="bg-[#C8FF00]/10 px-1.5 py-0.5 rounded text-xs ml-1">{yesPercent}%</span>
                    </span>
                    <span className="text-rose-400 flex items-center gap-0.5">
                      NO <span className="bg-rose-500/10 px-1.5 py-0.5 rounded text-xs ml-1">{noPercent}%</span>
                    </span>
                  </div>
                </div>

                {/* Card Feet Indicators */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-zinc-900/60 text-[11px] font-mono text-zinc-500 gap-2">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-zinc-900 px-2 py-1 rounded-md text-zinc-400 border border-zinc-800">
                      <DollarSign className="w-3 h-3 text-[#C8FF00]" />
                      <span>{(market.volume / 1000).toFixed(1)}k Vol</span>
                    </div>
                    <div className="flex items-center gap-1 text-zinc-400">
                      <Clock className="w-3 h-3 text-zinc-500 animate-pulse" />
                      <span>{formatDistanceToNow(new Date(market.endTime), { addSuffix: false })} left</span>
                    </div>
                  </div>

                  {positionInfo ? (
                    <div className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider flex items-center gap-1",
                      positionInfo.position === 'YES' 
                        ? "bg-[#C8FF00]/10 text-[#C8FF00] border-[#C8FF00]/25" 
                        : "bg-rose-500/10 text-rose-400 border-rose-500/25"
                    )}>
                      Holding {positionInfo.position}
                    </div>
                  ) : (
                    <div className="text-[10px] font-bold text-zinc-400 bg-zinc-900 hover:bg-[#C8FF00] hover:text-black hover:border-[#C8FF00] px-2.5 py-1 rounded-md transition-colors border border-zinc-800">
                      Trade Now
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
