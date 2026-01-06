import React, { useState, useEffect } from 'react';
import { Hadith, AppSettings } from '../types';
import { fetchHadiths, COLLECTIONS } from '../services/hadithService';

interface HadithViewProps {
  settings: AppSettings;
}

const HadithView: React.FC<HadithViewProps> = ({ settings }) => {
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCollection, setActiveCollection] = useState(COLLECTIONS[0].id);

  const shuffleArray = (array: Hadith[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchHadiths(activeCollection, '1-100');
        setHadiths(shuffleArray(data));
      } catch (err) {
        console.error("Hadith Library load error", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [activeCollection]);

  const textPrimary = "text-content-primary";
  const textSecondary = "text-content-secondary";
  const cardBg = settings.theme === 'dark' ? 'bg-slate-900 border-slate-800 shadow-black/40' : (settings.theme === 'sepia' ? 'bg-[#efdfbb] border-[#decba5]' : 'bg-white border-slate-100 shadow-slate-200/50');

  return (
    <div className={`min-h-screen theme-transition pb-36 ${settings.theme === 'dark' ? 'bg-[#020617]' : (settings.theme === 'sepia' ? 'bg-[#f4ecd8]' : 'bg-slate-50')}`}>
      <div className={`border-b sticky top-0 z-50 theme-transition backdrop-blur-md ${settings.theme === 'dark' ? 'bg-slate-950/80 border-slate-800' : (settings.theme === 'sepia' ? 'bg-[#f4ecd8]/80 border-[#decba5]' : 'bg-white/80 border-slate-100')}`}>
        <div className="overflow-x-auto no-scrollbar flex gap-6 px-6 py-6">
          {COLLECTIONS.map(coll => (
            <button
              key={coll.id}
              onClick={() => setActiveCollection(coll.id)}
              className={`tap-effect flex flex-col items-center gap-2 min-w-[95px] transition-all ${
                activeCollection === coll.id ? 'scale-110' : 'opacity-60'
              }`}
            >
              <div className={`icon-container w-16 h-16 rounded-[1.5rem] transition-all ${
                activeCollection === coll.id ? 'border-emerald-600 shadow-lg text-emerald-700' : 'text-slate-500'
              }`}>
                <span className="text-2xl">🕌</span>
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                activeCollection === coll.id ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
              }`}>
                {coll.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-8 space-y-10 mt-8">
        {loading && hadiths.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-48 space-y-6">
            <div className={`w-14 h-14 border-4 rounded-full animate-spin ${settings.theme === 'dark' ? 'border-emerald-900 border-t-emerald-400' : 'border-emerald-100 border-t-emerald-600'}`}></div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Accessing Hadith Vault...</p>
          </div>
        ) : (
          hadiths.map((h, idx) => (
            <div 
              key={`${h.hadithNumber}-${idx}`} 
              className={`rounded-[3rem] border overflow-hidden flex flex-col shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${cardBg}`}
            >
              <div className="p-10 space-y-10">
                <div className="flex justify-between items-center mb-2">
                   <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm ${h.authenticity === 'Sahih' ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'}`}>
                    {h.authenticity === 'Sahih' ? 'SAHIH' : 'HASAN'}
                  </span>
                  <p className={`text-[10px] font-black opacity-60 uppercase tracking-widest`} dir="ltr">
                    #{h.hadithNumber}
                  </p>
                </div>

                <p className={`arabic-text text-right leading-loose theme-transition antialiased font-bold ${textPrimary}`} dir="rtl" style={{ fontSize: '24px' }}>{h.hadithArabic}</p>
                
                <div className="flex items-center gap-6">
                  <div className={`h-px flex-1 ${settings.theme === 'dark' ? 'bg-slate-800' : (settings.theme === 'sepia' ? 'bg-[#decba5]' : 'bg-slate-100')}`}></div>
                  <div className={`w-2 h-2 rotate-45 ${settings.theme === 'dark' ? 'bg-emerald-900' : 'bg-emerald-100'}`}></div>
                  <div className={`h-px flex-1 ${settings.theme === 'dark' ? 'bg-slate-800' : (settings.theme === 'sepia' ? 'bg-[#decba5]' : 'bg-slate-100')}`}></div>
                </div>

                <p className={`urdu-text text-right leading-relaxed font-semibold theme-transition ${textSecondary}`} dir="rtl" style={{ fontSize: '18px' }}>{h.hadithUrdu}</p>

                <div className={`flex justify-between items-end pt-8 border-t theme-transition ${settings.theme === 'dark' ? 'border-slate-800' : (settings.theme === 'sepia' ? 'border-[#decba5]' : 'border-slate-50')}`}>
                  <div className="text-left space-y-1">
                    <p className={`text-[11px] font-black uppercase tracking-widest ${settings.theme === 'dark' ? 'text-emerald-500' : 'text-emerald-700'}`}>
                      {h.collectionName}
                    </p>
                    <p className={`text-[9px] font-medium italic opacity-50`}>Book: {h.bookNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-[11px] font-bold ${textSecondary}`} dir="rtl">
                      مروی ہے: <span className="font-black text-emerald-500">{h.narrator}</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={`px-10 py-5 flex justify-center gap-10 border-t theme-transition ${settings.theme === 'dark' ? 'bg-black/20 border-slate-800' : (settings.theme === 'sepia' ? 'bg-black/5 border-[#decba5]' : 'bg-slate-50/50 border-slate-50')}`}>
                 <button onClick={() => navigator.clipboard.writeText(`${h.hadithArabic}\n\n${h.hadithUrdu}`)} className="tap-effect text-[10px] font-black text-slate-500 hover:text-emerald-600 transition-all flex items-center gap-2 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                    Copy
                 </button>
                 <button className="tap-effect text-[10px] font-black text-slate-500 hover:text-rose-600 transition-all flex items-center gap-2 uppercase tracking-widest">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    Favorite
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HadithView;