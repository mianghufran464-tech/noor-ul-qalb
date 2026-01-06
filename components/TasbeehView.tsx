
import React, { useState, useEffect, useCallback } from 'react';

const ADHKAR = [
  { text: "Subhan Allah", ar: "سُبْحَانَ اللَّهِ" },
  { text: "Alhamdulillah", ar: "الْحَمْدُ لِلَّهِ" },
  { text: "Allahu Akbar", ar: "اللَّهُ أَكْبَرُ" },
  { text: "La Ilaha Illallah", ar: "لَا إِلٰهَ إِلَّا اللهُ" },
  { text: "Astaghfirullah", ar: "أَسْتَغْفِرُ اللَّهَ" }
];

const TasbeehView: React.FC = () => {
  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('noor_tasbeeh_count');
    return saved ? parseInt(saved) : 0;
  });
  const [activeDhikr, setActiveDhikr] = useState(0);

  useEffect(() => {
    localStorage.setItem('noor_tasbeeh_count', count.toString());
  }, [count]);

  const handleCount = useCallback(() => {
    setCount(prev => prev + 1);
    if (window.navigator.vibrate) window.navigator.vibrate(50);
  }, []);

  const resetCount = useCallback(() => {
    if (confirm("Reset count to 0?")) {
      setCount(0);
    }
  }, []);

  return (
    <div className="p-8 h-full flex flex-col items-center justify-between">
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-black theme-text-primary text-center">Digital Tasbeeh</h2>
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4 px-1">
          {ADHKAR.map((d, i) => (
            <button
              key={d.text}
              onClick={() => setActiveDhikr(i)}
              className={`tap-effect whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-bold transition-all border ${
                activeDhikr === i 
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg' 
                  : 'theme-card theme-border theme-text-secondary'
              }`}
            >
              {d.text}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="arabic-text text-4xl theme-text-primary font-bold mb-2 animate-in fade-in zoom-in duration-500" key={activeDhikr}>
            {ADHKAR[activeDhikr].ar}
          </p>
          <p className="text-sm theme-text-secondary opacity-60 uppercase tracking-widest">Total Counts</p>
        </div>

        <button 
          onClick={handleCount}
          className="tap-effect w-64 h-64 rounded-full border-8 border-emerald-500/10 flex flex-col items-center justify-center bg-white dark:bg-slate-800 shadow-[0_20px_50px_rgba(5,150,105,0.15)] relative overflow-hidden group active:scale-95 transition-transform"
        >
          <div className="absolute inset-0 bg-emerald-500/5 group-active:bg-emerald-500/10 transition-colors"></div>
          <span className="text-7xl font-black theme-text-primary z-10 transition-all group-active:scale-110">{count}</span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600 mt-2 z-10">TAP TO COUNT</span>
        </button>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 pb-8">
        <button 
          onClick={resetCount}
          className="tap-effect py-4 rounded-2xl border theme-border theme-text-secondary text-[10px] font-black uppercase tracking-widest bg-slate-50/50 dark:bg-slate-900/50"
        >
          Reset Counter
        </button>
        <button 
          onClick={() => { if(window.navigator.vibrate) window.navigator.vibrate(100); }}
          className="tap-effect py-4 rounded-2xl bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
        >
          Set Goal (33/100)
        </button>
      </div>
    </div>
  );
};

export default TasbeehView;
