import { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Calendar, Target, DollarSign, ShieldCheck, Video, CheckCircle2, ChevronLeft, Loader2, FileVideo, Sparkles, Tag, HelpCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { CURRENCY } from '../config';
import { Market } from '../types';

interface CreateMarketProps {
  onClose: () => void;
  onCreateMarket: (market: Partial<Market>) => void;
}

interface QuickTemplate {
  label: string;
  category: string;
  contentUrl: string;
  metricLabel: string;
  targetValue: string;
  timeWindow: string;
  liquidity: string;
  imageUrl: string;
  question: string;
}

const TEMPLATES: QuickTemplate[] = [
  {
    label: '⚡ MrBeast 100M Record',
    category: 'Entertainment',
    contentUrl: 'https://youtube.com/@MrBeast/live',
    metricLabel: 'Views',
    targetValue: '100000000',
    timeWindow: '24 Hours',
    liquidity: '250',
    imageUrl: 'https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80',
    question: 'Will MrBeast’s next YouTube challenge break 100M views within 24 hours?'
  },
  {
    label: '🎵 Dua Lipa Spotify Peak',
    category: 'Music',
    contentUrl: 'https://spotify.com/artist/dualipa',
    metricLabel: 'Streams',
    targetValue: '50000000',
    timeWindow: '48 Hours',
    liquidity: '100',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
    question: 'Will Dua Lipa’s new single hit 50M global streams in its first 48 hours?'
  },
  {
    label: '🤖 OpenAI GPT-5 Debut',
    category: 'Tech & Brands',
    contentUrl: 'https://openai.com/gpt-5',
    metricLabel: 'Users',
    targetValue: '10000000',
    timeWindow: '7 Days',
    liquidity: '500',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    question: 'Will OpenAI GPT-5 cross 10M active queries in its first 7 days?'
  },
  {
    label: '🏀 Caitlin Clark 45pt Masterclass',
    category: 'Sports',
    contentUrl: 'https://wnba.com/fever',
    metricLabel: 'Points',
    targetValue: '45',
    timeWindow: '24 Hours',
    liquidity: '150',
    imageUrl: '/images/caitlin_hoops.jpg',
    question: 'Will Caitlin Clark score 45+ points in tonight’s national broadcast game?'
  }
];

export function CreateMarket({ onClose, onCreateMarket }: CreateMarketProps) {
  const [promoSourceType, setPromoSourceType] = useState<'same' | 'upload'>('same');
  const [contentUrl, setContentUrl] = useState('');
  const [metricLabel, setMetricLabel] = useState('Views');
  const [targetValue, setTargetValue] = useState('');
  const [timeWindow, setTimeWindow] = useState('24 Hours');
  const [liquidity, setLiquidity] = useState('100');
  const [category, setCategory] = useState('Tech & Brands');
  const [customQuestion, setCustomQuestion] = useState('');
  const [selectedImageUrl, setSelectedImageUrl] = useState('https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?w=800&q=80');
  
  const [uploadedVideoName, setUploadedVideoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAiValidating, setIsAiValidating] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  const applyTemplate = (tmpl: QuickTemplate) => {
    setContentUrl(tmpl.contentUrl);
    setCategory(tmpl.category);
    setMetricLabel(tmpl.metricLabel);
    setTargetValue(tmpl.targetValue);
    setTimeWindow(tmpl.timeWindow);
    setLiquidity(tmpl.liquidity);
    setCustomQuestion(tmpl.question);
    setSelectedImageUrl(tmpl.imageUrl);
  };

  const finalQuestion = customQuestion.trim() || `Will this content reach ${parseInt(targetValue || '0').toLocaleString()} ${metricLabel} in ${timeWindow}?`;

  const isValid = contentUrl.trim() !== '' && parseInt(targetValue) > 0 && parseInt(liquidity) > 0 && (promoSourceType === 'same' || uploadedVideoName !== null);

  const handleLaunch = () => {
    if (!isValid) return;
    
    setIsAiValidating(true);
    setAiStatusMessage('AI Agent scanning content guidelines...');
    
    setTimeout(() => {
      setAiStatusMessage('Predicting initial market volatility & bonding curve...');
      
      setTimeout(() => {
        setIsAiValidating(false);
        onCreateMarket({
          contentUrl,
          metricLabel,
          category,
          imageUrl: selectedImageUrl,
          targetValue: parseInt(targetValue) || 1000000,
          liquidity: parseInt(liquidity) || 100,
          question: finalQuestion
        });
      }, 1200);
    }, 1200);
  };

  return (
    <div className="h-[100dvh] bg-black text-white pb-24 pt-6 px-4 overflow-y-auto relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img src="https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80" alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover blur-3xl opacity-20 scale-110" />
      </div>
      
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors cursor-pointer outline-none">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight">Create Market</h1>
              <p className="text-zinc-400 text-xs mt-0.5">The gold standard of decentralized attention.</p>
            </div>
            <div className="bg-[#C8FF00]/10 border border-[#C8FF00]/30 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-[0_0_15px_rgba(200,255,0,0.15)]">
              <ShieldCheck className="w-4 h-4 text-[#C8FF00]" />
              <span className="text-[#C8FF00] text-[10px] font-bold uppercase tracking-wider">Oracle Verified</span>
            </div>
          </div>
        </div>

        {/* 1-Click Quick Templates Carousel */}
        <div className="mb-4 bg-zinc-950 border border-zinc-850 rounded-2xl p-3">
          <div className="flex items-center gap-1.5 mb-2 text-zinc-400">
            <Sparkles className="w-3.5 h-3.5 text-[#C8FF00]" />
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-300">1-Click Test Templates:</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.label}
                type="button"
                onClick={() => applyTemplate(tmpl)}
                className="px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-[11px] font-bold text-zinc-200 hover:text-black hover:bg-[#C8FF00] hover:border-[#C8FF00] transition-all whitespace-nowrap cursor-pointer shrink-0"
              >
                {tmpl.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 flex-1 overflow-y-auto pb-10 no-scrollbar">
          
          {/* Step 1: Category & Question */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#C8FF00]/20 text-[#C8FF00] flex items-center justify-center font-bold text-xs">1</div>
              <h2 className="font-bold text-base">Category &amp; Contract Title</h2>
            </div>

            <div className="mb-3">
              <label className="block text-[10px] font-bold text-zinc-400 mb-1.5 uppercase tracking-wider">Category</label>
              <div className="flex flex-wrap gap-1.5">
                {['Tech & Brands', 'Events', 'Artists & AI', 'Sports', 'Music', 'Entertainment', 'Gaming', 'Culture'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all border cursor-pointer",
                      category === cat
                        ? "bg-[#C8FF00] text-black border-[#C8FF00]"
                        : "bg-black/50 text-zinc-400 border-white/10 hover:text-white"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-1 uppercase tracking-wider">Question Headline</label>
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g. Will this content reach 10,000,000 Views in 24 Hours?"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF00]/50"
              />
            </div>
          </div>

          {/* Step 2: Target Content */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#C8FF00]/20 text-[#C8FF00] flex items-center justify-center font-bold text-xs">2</div>
              <h2 className="font-bold text-base">Target Content URL</h2>
            </div>
            <p className="text-zinc-400 text-xs mb-3">The external link to the content being measured (TikTok, YouTube, Spotify, etc.).</p>

            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type="text"
                value={contentUrl}
                onChange={(e) => setContentUrl(e.target.value)}
                placeholder="https://tiktok.com/@creator/video/..."
                className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8FF00]/50"
              />
            </div>
          </div>

          {/* Step 3: Promotional Video (Market Source) */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#C8FF00]/20 text-[#C8FF00] flex items-center justify-center font-bold text-xs">3</div>
              <h2 className="font-bold text-base">Market Source Video</h2>
            </div>
            <p className="text-zinc-400 text-xs mb-3">The video shown on the feed. Upload a custom challenge video, or just use the target content.</p>

            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPromoSourceType('same')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-bold flex flex-row items-center justify-center gap-1.5 transition-colors cursor-pointer",
                  promoSourceType === 'same' ? "bg-white/20 text-white border border-white/20" : "text-zinc-500 hover:bg-white/5 border border-transparent"
                )}
              >
                <CheckCircle2 className="w-4 h-4 text-[#C8FF00]" /> Use Target Content
              </button>
              <button
                type="button"
                onClick={() => setPromoSourceType('upload')}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-bold flex flex-row items-center justify-center gap-1.5 transition-colors cursor-pointer",
                  promoSourceType === 'upload' ? "bg-white/20 text-white border border-white/20" : "text-zinc-500 hover:bg-white/5 border border-transparent"
                )}
              >
                <Video className="w-4 h-4" /> Upload Challenge
              </button>
            </div>

            <AnimatePresence mode="wait">
              {promoSourceType === 'upload' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-2"
                >
                  <input 
                    type="file" 
                    accept="video/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setUploadedVideoName(e.target.files[0].name);
                      }
                    }}
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors",
                      uploadedVideoName 
                        ? "border-[#C8FF00]/50 bg-[#C8FF00]/10 text-[#C8FF00]" 
                        : "border-zinc-700 hover:border-zinc-500 bg-zinc-800/50 text-zinc-400 hover:text-zinc-300"
                    )}
                  >
                    {uploadedVideoName ? (
                      <>
                        <FileVideo className="w-6 h-6 mb-2 text-[#C8FF00]" />
                        <p className="text-xs font-medium text-[#C8FF00] text-center max-w-full truncate px-4">{uploadedVideoName}</p>
                        <p className="text-[10px] text-[#C8FF00]/70 mt-1">Click to replace</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 mb-2" />
                        <p className="text-xs font-medium">Upload challenge preview video</p>
                        <p className="text-[10px] opacity-70 mt-1">MP4, MOV up to 50MB</p>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Step 4: Prediction Details */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#C8FF00]/20 text-[#C8FF00] flex items-center justify-center font-bold text-xs">4</div>
              <h2 className="font-bold text-base">Metric &amp; Threshold</h2>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 mb-2 ml-1 uppercase">Target Metric</label>
                <div className="flex flex-wrap gap-2">
                  {['Views', 'Likes', 'Streams', 'Followers', 'Sales', 'Listeners', 'Points'].map((metric) => (
                    <button
                      key={metric}
                      type="button"
                      onClick={() => setMetricLabel(metric)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                        metricLabel === metric
                          ? "bg-[#C8FF00]/20 border-[#C8FF00] text-[#C8FF00] shadow-[0_0_10px_rgba(200,255,0,0.2)]"
                          : "bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                      )}
                    >
                      {metric}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-1 ml-1 uppercase">Threshold Target</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="number"
                      value={targetValue}
                      onChange={(e) => setTargetValue(e.target.value)}
                      placeholder="1,000,000"
                      className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8FF00]/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 mb-2 ml-1 uppercase">Time Window</label>
                  <div className="flex gap-2">
                    {['24 Hours', '48 Hours', '7 Days'].map((window) => (
                      <button
                        key={window}
                        type="button"
                        onClick={() => setTimeWindow(window)}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                          timeWindow === window
                            ? "bg-[#C8FF00]/20 border-[#C8FF00] text-[#C8FF00] shadow-[0_0_10px_rgba(200,255,0,0.2)]"
                            : "bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                        )}
                      >
                        {window}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Liquidity */}
          <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#C8FF00]/20 text-[#C8FF00] flex items-center justify-center font-bold text-xs">5</div>
              <h2 className="font-bold text-base">Seed Liquidity</h2>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 mb-1 ml-1 uppercase">Amount to seed ({CURRENCY})</label>
              <div className="flex gap-2 mb-2">
                {[10, 50, 100, 500].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setLiquidity(amount.toString())}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all border cursor-pointer",
                      liquidity === amount.toString()
                        ? "bg-[#C8FF00]/20 border-[#C8FF00] text-[#C8FF00] shadow-[0_0_10px_rgba(200,255,0,0.2)]"
                        : "bg-black/50 border-white/10 text-zinc-400 hover:text-zinc-200 hover:border-white/20"
                    )}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="number"
                  value={liquidity}
                  onChange={(e) => setLiquidity(e.target.value)}
                  placeholder="100"
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-[#C8FF00]/50 font-mono"
                />
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 ml-1">Higher liquidity attracts more traders, clippers, and increases your creator fee cut.</p>
            </div>
          </div>

          <button 
            onClick={handleLaunch}
            disabled={!isValid || isAiValidating}
            className={cn(
              "w-full font-black text-sm uppercase tracking-wider py-4 rounded-2xl transition-all mt-4 relative overflow-hidden cursor-pointer outline-none",
              isValid 
                ? "bg-[#C8FF00] hover:bg-[#b3e600] text-black shadow-[0_0_20px_rgba(200,255,0,0.3)] active:scale-[0.99]" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            )}
          >
            {isAiValidating ? (
              <span className="flex flex-col items-center justify-center gap-1">
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  Analyzing Contract...
                </span>
                <span className="text-[10px] font-bold opacity-70 tracking-widest uppercase">{aiStatusMessage}</span>
              </span>
            ) : (
              "Deploy & Launch Market"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
