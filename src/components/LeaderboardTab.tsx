import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Zap, TrendingUp, Users, ArrowUpRight, BarChart3, Target, Sparkles, Trophy, Flame, Heart, CheckCircle, Search, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

interface Creator {
  rank: number;
  user: string;
  score: number;
  delta: string;
  badge: string;
  border: string;
  isHyped?: boolean;
  avatarColor: string;
}

export function LeaderboardTab() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreatorForChart, setSelectedCreatorForChart] = useState<string>('alixearle');
  
  // Real-time states
  const [userScore, setUserScore] = useState(1280);
  const [userRank, setUserRank] = useState(148);
  const [filter, setFilter] = useState<'hype' | 'weekly' | 'alltime'>('hype');

  // Dynamic Leaderboard list
  const [creators, setCreators] = useState<Creator[]>([
    { rank: 1, user: 'alixearle', score: 9842, delta: '+412', badge: '💅 GOAT', border: 'border-[#C8FF00]/30 bg-[#C8FF00]/5 text-white', avatarColor: 'bg-emerald-500' },
    { rank: 2, user: 'mrbeast', score: 9291, delta: '+892', badge: '🧠 GIGACHAD', border: 'border-zinc-800 bg-zinc-900/30', avatarColor: 'bg-blue-500' },
    { rank: 3, user: 'ishowspeed', score: 8830, delta: '+1.4k', badge: '💀 WILD', border: 'border-zinc-800 bg-zinc-900/30', avatarColor: 'bg-amber-500' },
    { rank: 4, user: 'kai_cenat', score: 8510, delta: '+510', badge: '📢 HYPE', border: 'border-zinc-800 bg-zinc-900/30', avatarColor: 'bg-purple-500' },
    { rank: 5, user: 'dualipaofficial', score: 8120, delta: '+120', badge: '💖 SLAY', border: 'border-zinc-800 bg-zinc-900/30', avatarColor: 'bg-pink-500' },
  ]);

  useEffect(() => {
    // Generate mock analytics based on selected creator
    const baseVal = selectedCreatorForChart === 'alixearle' ? 900 : selectedCreatorForChart === 'mrbeast' ? 850 : 600;
    const mockData = Array.from({ length: 7 }, (_, i) => ({
      day: `Day ${i + 1}`,
      attention: baseVal + Math.floor(Math.random() * 500)
    }));
    setData(mockData);
    setLoading(false);
  }, [selectedCreatorForChart]);

  const handleHype = (username: string) => {
    setCreators(prev => prev.map(c => {
      if (c.user === username) {
        const isHyping = !c.isHyped;
        return {
          ...c,
          score: isHyping ? c.score + 150 : c.score - 150,
          isHyped: isHyping,
          delta: isHyping ? '+150 🔥' : '+0 ⚡'
        };
      }
      return c;
    }));

    setUserScore(prev => prev + 50);
  };

  const filteredCreators = creators.filter(c => 
    c.user.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-black p-4 text-white overflow-y-auto no-scrollbar pb-28">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black tracking-tighter italic mb-0.5">CREATOR REPS</h1>
          <p className="text-[#C8FF00] text-[10px] font-bold uppercase tracking-widest">Hype rankings & Live Attention Metrics</p>
        </div>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full shadow-[0_0_15px_rgba(200,255,0,0.05)]">
          <Trophy className="w-3.5 h-3.5 text-[#C8FF00]" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500 block leading-none">Your Rep</span>
            <span className="font-mono text-xs font-black text-white">{userScore.toLocaleString()} PTS</span>
          </div>
        </div>
      </motion.div>

      {/* 3 Stats Boxes: Perfectly matches requested design with horizontal layout & span in between icon and word */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        {[
          { icon: Zap, label: 'Attention', value: '1,100', delta: '+290', color: 'text-[#C8FF00]', bg: 'bg-[#C8FF00]/10' },
          { icon: TrendingUp, label: 'Growth', value: '+35.8%', delta: 'Active', color: 'text-white', bg: 'bg-white/5' },
          { icon: Users, label: 'Members', value: '4,281', delta: 'Trending', color: 'text-zinc-400', bg: 'bg-white/5' }
        ].map((stat) => (
          <motion.div 
            key={stat.label}
            whileHover={{ y: -1, scale: 1.02 }}
            className="bg-zinc-900/90 p-3 rounded-2xl border border-zinc-850 shadow-md relative flex flex-col justify-between"
          >
            {/* Horizontal styling with span carefully placed between icon and word */}
            <div className="flex items-center gap-1 mb-2.5">
              <div className={`${stat.bg} ${stat.color} p-1 rounded-md shrink-0`}>
                <stat.icon className="w-3 h-3" />
              </div>
              
              <span className="text-[8px] font-mono font-bold tracking-tight text-zinc-400 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-850 leading-none">
                {stat.delta}
              </span>

              <p className="text-zinc-500 text-[8px] font-black uppercase tracking-wider ml-auto truncate max-w-[40%]">{stat.label}</p>
            </div>
            
            <div className="flex items-baseline">
              <span className="text-lg font-black tracking-tight italic text-white">{stat.value}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Top 3 Creators Showcase Podium layout */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {/* 2nd place */}
        <div onClick={() => setSelectedCreatorForChart('mrbeast')} className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-2xl text-center flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition-colors">
          <div className="flex justify-center -mt-1 mb-1.5">
            <span className="text-sm">🥈</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center font-black mx-auto text-xs text-white">M</div>
          <p className="text-[11px] font-black tracking-tight text-zinc-200 mt-1.5 truncate">@mrbeast</p>
          <p className="text-[9px] text-[#C8FF00] font-mono font-bold">9.2k PTS</p>
        </div>

        {/* 1st place */}
        <div onClick={() => setSelectedCreatorForChart('alixearle')} className="bg-[#C8FF00]/5 border-2 border-[#C8FF00]/40 p-3 rounded-2xl text-center flex flex-col justify-between relative scale-105 shadow-[0_0_15px_rgba(200,255,0,0.08)] cursor-pointer">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-sm">👑</div>
          <div className="w-10 h-10 rounded-full bg-[#C8FF00]/20 border-2 border-[#C8FF00] flex items-center justify-center font-black mx-auto text-xs text-white">A</div>
          <p className="text-[11px] font-black tracking-tight text-white mt-1.5 truncate">@alixearle</p>
          <p className="text-[10px] text-[#C8FF00] font-mono font-black">9.8k PTS</p>
        </div>

        {/* 3rd place */}
        <div onClick={() => setSelectedCreatorForChart('ishowspeed')} className="bg-zinc-900/40 border border-zinc-850 p-3 rounded-2xl text-center flex flex-col justify-between cursor-pointer hover:border-zinc-700 transition-colors">
          <div className="flex justify-center -mt-1 mb-1.5">
            <span className="text-sm">🥉</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-500/30 flex items-center justify-center font-black mx-auto text-xs text-white">I</div>
          <p className="text-[11px] font-black tracking-tight text-zinc-200 mt-1.5 truncate">@ishowspeed</p>
          <p className="text-[9px] text-amber-400 font-mono font-bold">8.8k PTS</p>
        </div>
      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-4.5 mb-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 max-w-[180px] relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Filter creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-zinc-800 rounded-xl py-1.5 pl-8 pr-3 text-xs text-white placeholder-zinc-500 font-semibold focus:border-zinc-700 outline-none"
            />
          </div>

          <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-850/30">
            {[
              { id: 'hype', label: '🔥 Hype' },
              { id: 'weekly', label: '👑 Rep' },
              { id: 'alltime', label: '💀 Slayers' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all whitespace-nowrap ${
                  filter === tab.id ? 'bg-[#C8FF00] text-black' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* creators rows */}
        <div className="space-y-2">
          {filteredCreators.map((leader) => (
            <motion.div 
              key={leader.user} 
              layout
              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                selectedCreatorForChart === leader.user 
                  ? 'border-[#C8FF00] bg-[#C8FF00]/5' 
                  : 'border-zinc-850 bg-zinc-950/40 hover:bg-zinc-950/70'
              }`}
            >
              <div className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0" onClick={() => setSelectedCreatorForChart(leader.user)}>
                <span className="font-mono text-xs font-black text-zinc-400 w-8">{leader.rank === 1 ? '👑 1' : leader.rank === 2 ? '🔥 2' : leader.rank === 3 ? '⚡ 3' : `• ${leader.rank}`}</span>
                <div className={`w-7 h-7 rounded-full ${leader.avatarColor} flex items-center justify-center font-bold text-xs border border-zinc-700 capitalize text-white shrink-0`}>
                  {leader.user[0]}
                </div>
                <div className="truncate">
                  <p className="text-xs font-black text-white truncate">@{leader.user}</p>
                  <p className="text-[9px] text-zinc-500 font-mono font-bold leading-none">{leader.delta}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[8px] font-black px-1.5 py-0.5 rounded bg-black text-[#C8FF00] tracking-wider border border-zinc-900 truncate max-w-[70px] uppercase font-mono">{leader.badge}</span>
                
                <div className="text-right min-w-[55px] pr-2">
                  <span className="font-mono font-black text-xs text-white block">{leader.score.toLocaleString()}</span>
                  <span className="block text-[8px] uppercase text-zinc-500 font-black tracking-widest font-mono leading-none">PTS</span>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleHype(leader.user);
                  }}
                  className={`w-10 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-all flex flex-col items-center justify-center ${
                    leader.isHyped 
                      ? 'bg-[#C8FF00] text-black font-black' 
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-750'
                  }`}
                >
                  <Flame className={`w-3.5 h-3.5 ${leader.isHyped ? 'fill-current animate-bounce' : ''}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Selected Creator Attention Velocity Graph */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-zinc-900 border border-zinc-850 p-4 rounded-2xl mb-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-[#C8FF00]">@{selectedCreatorForChart} Analytics</h3>
            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none mt-1">Cycle velocity of attention metrics</p>
          </div>
          <div className="bg-[#C8FF05]/10 border border-[#C8FF05]/20 text-[#C8FF00] font-black text-[9px] tracking-widest px-2 py-0.5 rounded-full animate-pulse uppercase">LIVE INDEX</div>
        </div>
        
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="selectedCreatorAttention" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C8FF00" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#C8FF00" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis 
                dataKey="day" 
                stroke="#555" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                dy={3}
              />
              <YAxis 
                stroke="#555" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false} 
                dx={-3}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333', borderRadius: '12px', fontSize: '10px' }}
                itemStyle={{ color: '#C8FF00', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="attention" 
                stroke="#C8FF00" 
                strokeWidth={2.5} 
                fillOpacity={1} 
                fill="url(#selectedCreatorAttention)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
