
import React from 'react';
import { AppSettings } from '../types';
import { RECITERS } from '../constants';

interface SettingsViewProps {
  settings: AppSettings;
  onSettingsChange: (newSettings: AppSettings) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ settings, onSettingsChange }) => {
  const updateSetting = (key: keyof AppSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const clearAppCache = () => {
    if (confirm("Kya aap tamam saved data aur cache khatam karna chahte hain?")) {
      localStorage.clear();
      caches.keys().then(names => {
        for (let name of names) caches.delete(name);
      });
      window.location.reload();
    }
  };

  return (
    <div className="p-8 space-y-12 pb-40 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1 text-left">App Appearance</h3>
        <div className="flex gap-4">
          {(['light', 'dark', 'sepia'] as const).map(t => (
            <button
              key={t}
              onClick={() => updateSetting('theme', t)}
              className={`tap-effect flex-1 aspect-square rounded-3xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${settings.theme === t ? 'border-emerald-500 bg-emerald-500/5' : 'theme-border theme-card shadow-sm'}`}
            >
              <div className={`w-10 h-10 rounded-full shadow-inner ${t === 'light' ? 'bg-white border' : t === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-[#f4ecd8] border border-[#decba5]'}`}></div>
              <span className="text-[10px] font-black uppercase theme-text-primary tracking-widest">{t}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1 text-left">Reading Experience</h3>
        <div className="space-y-8 theme-card border theme-border p-8 rounded-[2.5rem] shadow-sm">
          <div>
            <div className="flex justify-between text-[10px] mb-3">
              <span className="font-black theme-text-secondary uppercase tracking-widest">Arabic Font Size</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">{settings.fontSizeArabic}px</span>
            </div>
            <input 
              type="range" min="24" max="52" value={settings.fontSizeArabic} 
              onChange={(e) => updateSetting('fontSizeArabic', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
          <div>
            <div className="flex justify-between text-[10px] mb-3">
              <span className="font-black theme-text-secondary uppercase tracking-widest">Translation Size</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-black">{settings.fontSizeTranslation}px</span>
            </div>
            <input 
              type="range" min="14" max="28" value={settings.fontSizeTranslation} 
              onChange={(e) => updateSetting('fontSizeTranslation', parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-1 text-left">App Maintenance</h3>
        <div className="space-y-3">
           <button onClick={() => window.location.reload()} className="tap-effect w-full p-5 rounded-2xl border theme-border theme-card flex items-center justify-between shadow-sm active:bg-slate-50">
              <span className="text-sm font-bold theme-text-primary">Check for Updates</span>
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
           </button>
           <button onClick={clearAppCache} className="tap-effect w-full p-5 rounded-2xl border border-rose-100 dark:border-rose-900/30 bg-rose-50/50 dark:bg-rose-950/10 flex items-center justify-between shadow-sm active:bg-rose-100">
              <span className="text-sm font-bold text-rose-600">Clear Local Storage & Cache</span>
              <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
           </button>
        </div>
      </section>

      <div className="pt-10 flex flex-col items-center gap-2 opacity-20 pb-10">
        <div className="w-10 h-10 bg-emerald-500 rounded-[1rem] flex items-center justify-center">
           <span className="text-white font-black text-xl">N</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest theme-text-primary">Noor-ul-Qalb Production</p>
        <p className="text-[8px] font-bold opacity-60 uppercase">Version 1.1.0 (Stable)</p>
      </div>
    </div>
  );
};

export default SettingsView;
