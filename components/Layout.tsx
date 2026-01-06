import React from 'react';
import { ViewMode } from '../types';
import { ICONS } from '../constants';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, onViewChange, title }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-[var(--bg-primary)] text-[var(--text-primary)] max-w-md mx-auto relative overflow-hidden transition-colors duration-300">
      
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-[200] max-w-md mx-auto glass border-b border-black/5 dark:border-white/5 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white p-1 flex items-center justify-center border border-emerald-500/10 shadow-sm">
            <Logo className="w-full h-full" />
          </div>
          <div className="flex flex-col -space-y-1">
            <h1 className="text-xl font-black tracking-tight text-emerald-800 dark:text-emerald-400">
              {title || 'Noor-ul-Qalb'}
            </h1>
            <span className="text-[7px] font-black uppercase tracking-[0.2em] text-emerald-600/60">نُورُ الْقَلْبِ</span>
          </div>
        </div>
        <button 
          onClick={() => onViewChange(ViewMode.READER)} 
          className="p-2.5 rounded-2xl active:bg-black/5 dark:active:bg-white/10 transition-colors"
        >
          <ICONS.Search className="w-5 h-5 opacity-70" />
        </button>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto no-scrollbar pt-20 pb-[calc(7.5rem+env(safe-area-inset-bottom))]">
        {children}
      </main>

      {/* FOOTER NAV */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass border-t border-black/5 dark:border-white/5 px-2 z-[200] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] h-[calc(6.5rem+env(safe-area-inset-bottom))] flex items-start pt-3">
        <div className="w-full flex justify-around">
          <NavItem icon={<ICONS.Home />} label="Home" active={activeView === ViewMode.HOME} onClick={() => onViewChange(ViewMode.HOME)} />
          <NavItem icon={<ICONS.Book />} label="Quran" active={activeView === ViewMode.READER} onClick={() => onViewChange(ViewMode.READER)} />
          <NavItem icon={<ICONS.Bookmark />} label="Saved" active={activeView === ViewMode.BOOKMARKS} onClick={() => onViewChange(ViewMode.BOOKMARKS)} />
          <NavItem icon={<ICONS.Sparkles />} label="AI Search" active={activeView === ViewMode.AI_INSIGHTS} onClick={() => onViewChange(ViewMode.AI_INSIGHTS)} />
          <NavItem icon={<ICONS.Settings />} label="Settings" active={activeView === ViewMode.SETTINGS} onClick={() => onViewChange(ViewMode.SETTINGS)} />
        </div>
      </nav>
    </div>
  );
};

const NavItem = React.memo(({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1.5 p-1 transition-all min-w-[64px] ${active ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}
  >
    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${active ? 'scale-110 shadow-lg shadow-emerald-500/10 bg-emerald-500/10' : 'opacity-80'}`}>
      <span className="w-5 h-5">{icon}</span>
    </div>
    <span className="text-[7px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
));

export default React.memo(Layout);
