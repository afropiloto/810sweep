import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Smartphone, Loader2 } from 'lucide-react';

interface PrivyDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (provider?: string) => void;
}

export function PrivyDemoModal({ isOpen, onClose, onLoginSuccess }: PrivyDemoModalProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  const handleLogin = (provider: string) => {
    setIsConnecting(true);
    setConnectingProvider(provider);
    setTimeout(() => {
      setIsConnecting(false);
      setConnectingProvider(null);
      onLoginSuccess(provider);
      onClose();
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-md z-[200]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92%] max-w-sm bg-zinc-950 border border-zinc-800 rounded-3xl p-6 z-[201] shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-400" />
            </button>

            <div className="text-center mb-6 mt-1">
              <div className="w-14 h-14 bg-neon rounded-2xl mx-auto mb-3 flex items-center justify-center shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                <span className="text-black font-black italic text-3xl leading-none mt-0.5">8</span>
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Log in with Privy</h2>
              <p className="text-zinc-400 text-xs">Connect social accounts or Web3 wallet</p>
            </div>

            {/* Social Logins Grid */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {/* TikTok */}
                <button 
                  onClick={() => handleLogin('TikTok')}
                  disabled={isConnecting}
                  className="bg-zinc-900 border border-zinc-800 text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-xs active:scale-95 disabled:opacity-60"
                >
                  {isConnecting && connectingProvider === 'TikTok' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#00f2fe]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.3 0 .58.05.85.12V9.45a6.34 6.34 0 0 0-.85-.06 6.34 6.34 0 0 0-6.34 6.34A6.34 6.34 0 0 0 9.49 22a6.34 6.34 0 0 0 6.34-6.34V9.22a8.16 8.16 0 0 0 3.76.92v-3.45z"/>
                    </svg>
                  )}
                  <span>TikTok</span>
                </button>

                {/* Instagram */}
                <button 
                  onClick={() => handleLogin('Instagram')}
                  disabled={isConnecting}
                  className="bg-zinc-900 border border-zinc-800 text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-xs active:scale-95 disabled:opacity-60"
                >
                  {isConnecting && connectingProvider === 'Instagram' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#E1306C]" />
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  )}
                  <span>Instagram</span>
                </button>

                {/* Twitch */}
                <button 
                  onClick={() => handleLogin('Twitch')}
                  disabled={isConnecting}
                  className="bg-zinc-900 border border-zinc-800 text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-xs active:scale-95 disabled:opacity-60"
                >
                  {isConnecting && connectingProvider === 'Twitch' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#9146FF]" />
                  ) : (
                    <svg className="w-4 h-4 text-[#9146FF]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714z"/>
                    </svg>
                  )}
                  <span>Twitch</span>
                </button>

                {/* Kick */}
                <button 
                  onClick={() => handleLogin('Kick')}
                  disabled={isConnecting}
                  className="bg-zinc-900 border border-zinc-800 text-white font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 hover:border-zinc-700 transition-all text-xs active:scale-95 disabled:opacity-60"
                >
                  {isConnecting && connectingProvider === 'Kick' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[#53FC18]" />
                  ) : (
                    <span className="font-black text-[#53FC18] tracking-tighter text-sm">KICK</span>
                  )}
                  <span>Kick</span>
                </button>
              </div>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                  <span className="bg-zinc-950 px-2 text-zinc-500 uppercase tracking-widest font-semibold">Or standard options</span>
                </div>
              </div>

              {/* Email Button */}
              <button 
                onClick={() => handleLogin('Email')}
                disabled={isConnecting}
                className="w-full bg-zinc-900 border border-zinc-800 text-white font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2.5 hover:bg-zinc-850 hover:border-zinc-700 transition-all text-xs active:scale-98 disabled:opacity-70"
              >
                {isConnecting && connectingProvider === 'Email' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-neon" />
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-zinc-400" />
                    <span>Continue with Email</span>
                  </>
                )}
              </button>

              {/* Google & Apple Grid */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button 
                  onClick={() => handleLogin('Google')}
                  disabled={isConnecting}
                  className="bg-zinc-900 border border-zinc-800 text-white font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-70 text-xs"
                >
                  {isConnecting && connectingProvider === 'Google' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-yellow-400" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      <span>Google</span>
                    </>
                  )}
                </button>
                <button 
                  onClick={() => handleLogin('Apple')}
                  disabled={isConnecting}
                  className="bg-zinc-900 border border-zinc-800 text-white font-medium py-2 px-3 rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors disabled:opacity-70 text-xs"
                >
                  {isConnecting && connectingProvider === 'Apple' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.948 1.565-.025 2.613-1.506 3.6-2.955 1.144-1.67 1.616-3.287 1.64-3.37-.037-.013-3.165-1.213-3.214-4.82-.043-3.024 2.468-4.512 2.58-4.588-1.42-2.072-3.62-2.364-4.41-2.43-2.005-.18-4.04 1.1-5.08 1.1zm-1.02-4.92c.86-1.04 1.44-2.49 1.28-3.93-1.23.05-2.74.82-3.64 1.86-.72.83-1.38 2.31-1.19 3.72 1.38.11 2.69-.61 3.55-1.65z" />
                      </svg>
                      <span>Apple</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-zinc-500 text-[10px] text-center mt-5">
              Powered by Privy Embedded Wallets • Low latency execution
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
