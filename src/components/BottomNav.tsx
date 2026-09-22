import { Home, Search, Briefcase, Sparkles, Trophy, PlusSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface BottomNavProps {
  activeTab: string;
  onChange: (tab: string) => void;
}

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  const tabs = [
    { id: 'feed', icon: Home, label: 'Feed' },
    { id: 'explore', icon: Search, label: 'Explore' },
    { id: 'create', icon: PlusSquare, label: 'Create' },
    { id: 'leaderboard', icon: Trophy, label: 'Leaders' },
    { id: 'portfolio', icon: Briefcase, label: 'Portfolio', isSoon: false },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/95 backdrop-blur-md border-t border-zinc-800/80 flex items-center justify-around px-2 z-50 pb-safe">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex flex-col items-center justify-center w-14 h-full transition-colors active:scale-95 relative",
              isActive ? "text-[#C8FF00]" : "text-zinc-500 hover:text-zinc-300"
            )}
            id={`nav-tab-${tab.id}`}
          >
            {tab.isSoon && (
              <span className="absolute top-1 right-1 text-[7px] font-black tracking-widest px-1 py-0.2 rounded bg-[#C8FF00]/10 text-[#C8FF00] border border-[#C8FF00]/20 scale-90">
                SOON
              </span>
            )}
            <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
            <span className="text-[9px] font-bold tracking-wide uppercase">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}


