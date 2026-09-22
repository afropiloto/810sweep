import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, User, Smartphone, Wifi, WifiOff, Bell, BellRing, 
  Trash2, RefreshCw, Terminal, Check, ShieldCheck, 
  Save, Sparkles, Eye, CloudLightning
} from 'lucide-react';
import { User as UserType } from '../types';
import { cn } from '../lib/utils';

interface PwaSettingsModalProps {
  isOpen: boolean;
  user: UserType;
  onClose: () => void;
  onSaveProfile: (updatedUser: Partial<UserType>) => void;
  
  // PWA states synced with parent app
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  isInstalled: boolean;
  setIsInstalled: (installed: boolean) => void;
  pushEnabled: boolean;
  setPushEnabled: (enabled: boolean) => void;
  onTriggerTestPush: (title: string, message: string) => void;
}

export function PwaSettingsModal({
  isOpen,
  user,
  onClose,
  onSaveProfile,
  isOffline,
  setIsOffline,
  isInstalled,
  setIsInstalled,
  pushEnabled,
  setPushEnabled,
  onTriggerTestPush
}: PwaSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'pwa'>('profile');
  
  // Profile settings state
  const [username, setUsername] = useState(user.username);
  const [avatar, setAvatar] = useState(user.avatar);
  const [bio, setBio] = useState(user.bio || '');
  const [twitter, setTwitter] = useState(user.socials?.twitter || '');
  const [tiktok, setTiktok] = useState(user.socials?.tiktok || '');

  // PWA specific interactive state
  const [isCachClearing, setIsCacheClearing] = useState(false);
  const [assetCacheSize, setAssetCacheSize] = useState('4.8 MB');
  const [dataCacheSize, setDataCacheSize] = useState('142 KB');
  const [cachedItemsCount, setCachedItemsCount] = useState(48);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '[INIT] Service Worker v2.10.1 registered successfully',
    '[CACHE] Loaded 32 default audio-visual shell resources',
    '[DB] Loaded local indexed IndexedDB collection',
    '[NETWORK] Websocket connection linked: /api/live-ticker'
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the terminal logs
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  // Periodic mock logs if modal is active in PWA tab
  useEffect(() => {
    if (activeTab !== 'pwa') return;
    
    const messages = [
      '[SYNC] Synced 2 pending trades to decentralized contract channel',
      '[SW] Pre-fetching assets for live streaming creator frames...',
      '[PWA] Cache validated: all images matched offline state',
      '[TELEMETRY] Latency optimized via local storage buffers',
      '[DB] Garbage collection cleared 1.2 KB stale mock volume',
    ];

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * messages.length);
      const timestamp = new Date().toLocaleTimeString();
      setTerminalLogs(prev => [...prev, `[${timestamp}] ${messages[idx]}`]);
    }, 4500);

    return () => clearInterval(interval);
  }, [activeTab]);

  const addTerminalLog = (log: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTerminalLogs(prev => [...prev, `[${timestamp}] ${log}`]);
  };

  const handleSaveProfile = () => {
    onSaveProfile({
      username,
      avatar,
      bio,
      socials: { twitter, tiktok }
    });
    addTerminalLog(`[PROFILE] Updated user profile: @${username}`);
  };

  const handleSimulateInstallation = () => {
    if (isInstalled) return;
    setIsInstalled(true);
    addTerminalLog('[PWA_INSTALL] Manifest handshake success: Registered shortcut to desktop');
    onTriggerTestPush('App Installed 🎉', '810.ONE is now successfully added to your device Home Screen!');
  };

  const handleToggleOffline = (val: boolean) => {
    setIsOffline(val);
    if (val) {
      addTerminalLog('[NET_STATE] Offline state engaged. Simulating fallback offline asset storage...');
      onTriggerTestPush('Offline Mode Active ⚠️', 'Application running from locally cached assets. Real transactions paused.');
    } else {
      addTerminalLog('[NET_STATE] Restored full high-availability internet connection');
      onTriggerTestPush('Back Online ⚡', 'Reconnected successfully to the live 810 API endpoints.');
    }
  };

  const handleTogglePush = (val: boolean) => {
    setPushEnabled(val);
    if (val) {
      addTerminalLog('[NOTIFICATION] Authorized FCM push notification capabilities');
      setTimeout(() => {
        onTriggerTestPush('Notifications Enabled 🔔', 'Receipt validated. You will now receive alerts for matched social contracts.');
      }, 500);
    } else {
      addTerminalLog('[NOTIFICATION] Disabled push channel token keys');
    }
  };

  const handleClearCache = () => {
    setIsCacheClearing(true);
    addTerminalLog('[CACHE] Requesting garbage collection purge...');
    
    setTimeout(() => {
      setIsCacheClearing(false);
      setAssetCacheSize('0.0 KB');
      setDataCacheSize('0.0 KB');
      setCachedItemsCount(0);
      addTerminalLog('[CACHE] Clear operation completed. All cache buckets invalidated.');
      onTriggerTestPush('Cache Purged 🧹', 'Stale mock telemetry wiped from memory.');
    }, 1500);
  };

  const handleTriggerTestPushBtn = () => {
    if (!pushEnabled) {
      onTriggerTestPush('System Overrule 📢', 'Please enable Push Notifications first inside the PWA settings!');
      return;
    }
    const messages = [
      { t: "Whale Buy Alert! 🐋", m: "10,000 YES shares purchased on @kai_cenat's twitch contract." },
      { t: "Market Matched! 🚀", m: "Taylor Swift's views surpassed target! YES payouts editable in claims." },
      { t: "Arbitrage Alert ⚡", m: "Slight discrepancy detected on @mrbeast gaming. Trade ready." },
    ];
    const item = messages[Math.floor(Math.random() * messages.length)];
    onTriggerTestPush(item.t, item.m);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100dvh' }}
          animate={{ y: 0 }}
          exit={{ y: '100dvh' }}
          transition={{ type: 'spring', damping: 26, stiffness: 350, mass: 0.9 }}
          className="w-full h-full md:h-[780px] md:max-w-[390px] relative overflow-hidden rounded-t-[32px] md:rounded-[40px] border border-white/15 shadow-2xl bg-zinc-950 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header background effect */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#C8FF00]/10 to-transparent pointer-events-none" />

          {/* Modal Header */}
          <div className="relative z-10 p-5 pb-3 flex justify-between items-start border-b border-zinc-900">
            <div>
              <p className="text-[10px] text-[#C8FF00] font-black tracking-widest uppercase font-mono">Control Panel</p>
              <h3 className="text-xl font-black text-white">App Configurations</h3>
            </div>
            <button 
              onClick={onClose} 
              className="p-1.5 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 hover:text-white text-zinc-400 transition-colors outline-none"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* Tab Selection */}
          <div className="flex px-4.5 py-3 gap-2 bg-zinc-900/40 border-b border-zinc-900/80 sticky top-0 z-10">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                "flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 outline-none border",
                activeTab === 'profile' 
                  ? "bg-[#C8FF00] text-black border-[#C8FF00]' shadow-sm" 
                  : "bg-black/20 text-zinc-400 border-zinc-900 hover:text-white"
              )}
            >
              <User className="w-3.5 h-3.5" />
              Social Profile
            </button>
            <button
              onClick={() => setActiveTab('pwa')}
              className={cn(
                "flex-1 py-2 text-xs font-black uppercase rounded-xl transition-all flex items-center justify-center gap-1.5 outline-none border",
                activeTab === 'pwa' 
                  ? "bg-[#C8FF00] text-black border-[#C8FF00] shadow-sm" 
                  : "bg-black/20 text-zinc-400 border-zinc-900 hover:text-white"
              )}
            >
              <Smartphone className="w-3.5 h-3.5" />
              PWA &amp; Engine
            </button>
          </div>

          {/* Scrollable Configuration Fields */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar pb-12">
            
            {activeTab === 'profile' && (
              <div className="space-y-4">
                
                {/* Profile Preview Header card */}
                <div className="bg-black/50 border border-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                  <img 
                    src={avatar} 
                    alt="" 
                    className="w-12 h-12 rounded-full border border-zinc-850 object-cover" 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = 'https://avatars.githubusercontent.com/u/10000?v=4';
                    }}
                  />
                  <div>
                    <h4 className="text-white font-black text-sm">@{username || 'anonymous'}</h4>
                    <span className="text-[9px] font-mono font-bold bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/15 px-1.5 py-0.5 rounded uppercase">
                      Social Node Locked
                    </span>
                  </div>
                </div>

                {/* Fields */}
                <div className="space-y-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 ml-1">Avatar Image URL</label>
                    <input 
                      type="text" 
                      value={avatar} 
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full bg-black border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF00]/40 font-medium"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 ml-1">Channel Username</label>
                    <input 
                      type="text" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="custom_handle"
                      className="w-full bg-black border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF00]/40 font-medium font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 ml-1">Aesthetic Bio Description</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Enter a decentralized channel biological bio description..."
                      className="w-full bg-black border border-zinc-900 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF00]/40 h-20 resize-none font-medium text-zinc-300"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 ml-1">Twitter Handle</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-650 text-xs font-bold font-mono">@</span>
                        <input 
                          type="text" 
                          value={twitter} 
                          onChange={(e) => setTwitter(e.target.value)}
                          placeholder="twitter"
                          className="w-full bg-black border border-zinc-900 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF00]/40 font-mono"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1 ml-1">TikTok Handle</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-650 text-xs font-bold font-mono">@</span>
                        <input 
                          type="text" 
                          value={tiktok} 
                          onChange={(e) => setTiktok(e.target.value)}
                          placeholder="tiktok"
                          className="w-full bg-black border border-zinc-900 rounded-xl pl-7 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#C8FF00]/40 font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 mt-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#C8FF00] hover:bg-[#b0e000] text-black transition-all transform active:scale-[0.98] flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(200,255,0,0.2)]"
                >
                  <Save className="w-4 h-4" />
                  Apply Custom Profile
                </button>

              </div>
            )}

            {activeTab === 'pwa' && (
              <div className="space-y-4">
                
                {/* 1. App Installation Emulation */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 flex items-center justify-between">
                  <div className="pr-3 flex-1">
                    <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4 text-[#C8FF00]" />
                      Installd Home Shortcut
                    </h4>
                    <p className="text-[10px] text-zinc-500 mt-1">Add 810.ONE directly to your home dock bar</p>
                  </div>
                  
                  <button
                    onClick={handleSimulateInstallation}
                    disabled={isInstalled}
                    className={cn(
                      "px-3 py-2 rounded-xl text-[10px] font-black uppercase transition-all whitespace-nowrap outline-none",
                      isInstalled 
                        ? "bg-zinc-950 text-zinc-500 border border-zinc-900/80 cursor-default flex items-center gap-1"
                        : "bg-[#C8FF00] text-black hover:bg-[#b0e000] active:scale-95"
                    )}
                  >
                    {isInstalled ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#C8FF00]" /> Installed
                      </>
                    ) : 'Register'}
                  </button>
                </div>

                {/* 2. Interactive Network state toggle (with Wifi off fallback) */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                        {isOffline ? <WifiOff className="w-4 h-4 text-rose-400" /> : <Wifi className="w-4 h-4 text-[#C8FF00]" />}
                        Offline Flight Mode
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Test app behavior when internet is completely cut</p>
                    </div>
                    
                    <button
                      onClick={() => handleToggleOffline(!isOffline)}
                      className={cn(
                        "w-12 h-6.5 rounded-full p-1 transition-all duration-300 relative outline-none",
                        isOffline ? "bg-rose-500" : "bg-zinc-850"
                      )}
                    >
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-full bg-white transition-all duration-300 transform shadow-md",
                        isOffline ? "translate-x-5.5" : "translate-x-0"
                      )} />
                    </button>
                  </div>
                  
                  {isOffline && (
                    <div className="mt-2 bg-rose-500/10 border border-rose-500/20 rounded-lg p-2 flex items-start gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping mt-1.5 shrink-0" />
                      <p className="text-[9px] text-rose-400 font-medium leading-relaxed uppercase">
                        Active Sandbox: offline mode matches local assets and blocks trade submission to prevent loss.
                      </p>
                    </div>
                  )}
                </div>

                {/* 3. Push notifications Simulation Toggles & Trigger Button */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-white font-bold text-xs flex items-center gap-1.5">
                        {pushEnabled ? <BellRing className="w-4 h-4 text-[#C8FF00]" /> : <Bell className="w-4 h-4 text-zinc-550" />}
                        App Push Notifications
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">Allow web worker platform messaging alerts</p>
                    </div>
                    
                    <button
                      onClick={() => handleTogglePush(!pushEnabled)}
                      className={cn(
                        "w-12 h-6.5 rounded-full p-1 transition-all duration-300 relative outline-none",
                        pushEnabled ? "bg-[#C8FF00]" : "bg-zinc-850"
                      )}
                    >
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-full bg-zinc-950 transition-all duration-300 transform",
                        pushEnabled ? "translate-x-5.5 bg-black" : "translate-x-0 bg-zinc-400"
                      )} />
                    </button>
                  </div>

                  <button
                    onClick={handleTriggerTestPushBtn}
                    className="w-full py-2.5 rounded-xl border border-zinc-800 hover:border-[#C8FF00]/40 text-zinc-300 hover:text-white transition-all bg-black/60 text-xs font-bold leading-none flex items-center justify-center gap-1.5"
                  >
                    <CloudLightning className="w-3.5 h-3.5 text-[#C8FF00]" />
                    Trigger Simulated Push Notification
                  </button>
                </div>

                {/* 4. Service Worker Cache Clear Diagnostics */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex justifying-between items-start mb-3">
                    <div>
                      <h4 className="text-white font-bold text-xs">PWA cache parameters</h4>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{cachedItemsCount} specific items compiled</p>
                    </div>
                    <button 
                      onClick={handleClearCache}
                      disabled={isCachClearing}
                      className="p-1.5 bg-black hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 rounded-lg border border-zinc-850 hover:border-rose-500/20 transition-all outline-none"
                      title="Clear Cache Storage"
                    >
                      {isCachClearing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-[9px] uppercase font-bold text-zinc-400">
                    <div className="bg-black/40 border border-zinc-900 rounded-xl p-2.5">
                      <span className="block text-zinc-600 text-[8px] mb-0.5">Asset Shell</span>
                      <span className="text-white font-black">{assetCacheSize}</span>
                    </div>
                    <div className="bg-black/40 border border-zinc-900 rounded-xl p-2.5">
                      <span className="block text-zinc-600 text-[8px] mb-0.5">JSON Contracts</span>
                      <span className="text-neon font-black">{dataCacheSize}</span>
                    </div>
                  </div>
                </div>

                {/* 5. Terminal Logger */}
                <div className="bg-black/90 border border-zinc-900 rounded-2xl p-4 relative">
                  <div className="flex justify-between items-center mb-2.5 pb-1 border-b border-zinc-900">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-[#C8FF00]" />
                      <span className="text-[10px] font-mono uppercase font-black tracking-wide text-zinc-400">Worker Sync Log</span>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-[#C8FF00] animate-pulse" />
                  </div>

                  <div className="h-28 overflow-y-auto font-mono text-[9px] text-[#C8FF00]/80 leading-relaxed pr-1 no-scrollbar space-y-1">
                    {terminalLogs.map((log, i) => (
                      <div key={i} className="break-all">
                        {log}
                      </div>
                    ))}
                    <div ref={bottomRef} />
                  </div>
                </div>

              </div>
            )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
