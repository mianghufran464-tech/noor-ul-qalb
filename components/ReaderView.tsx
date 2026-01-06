
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Ayah, SurahDetail, AppSettings } from '../types';
import { fetchSurahDetail } from '../services/quranDataService';
// Added AI_ERROR_GENERAL to imports
import { geminiService, AI_ERROR_QUOTA, AI_ERROR_KEY_INVALID, AI_ERROR_GENERAL } from '../services/geminiService';
import { ICONS } from '../constants';

interface ReaderViewProps {
  surahNumber: number;
  onBack: () => void;
  settings: AppSettings;
  bookmarks: any[];
  onToggleBookmark: (ayah: Ayah, surahName: string) => void;
}

const ReaderView: React.FC<ReaderViewProps> = ({ surahNumber, onBack, settings, bookmarks, onToggleBookmark }) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [tafseer, setTafseer] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [autoPlay, setAutoPlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadSurah = async () => {
      setLoading(true);
      try {
        const data = await fetchSurahDetail(surahNumber, settings.reciter);
        if (isMounted) setSurah(data);
      } catch (error) {
        console.error("Reader load failure", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadSurah();
    return () => { isMounted = false; };
  }, [surahNumber, settings.reciter]);

  const toggleAudio = useCallback((index: number) => {
    if (playingIndex === index) {
      audioRef.current?.pause();
      setPlayingIndex(null);
    } else {
      setPlayingIndex(index);
    }
  }, [playingIndex]);

  useEffect(() => {
    if (playingIndex !== null && surah?.ayahs[playingIndex]?.audio) {
      if (audioRef.current) {
        audioRef.current.src = surah.ayahs[playingIndex].audio!;
        audioRef.current.play();
      }
    }
  }, [playingIndex, surah]);

  const handleAudioEnd = () => {
    if (autoPlay && surah && playingIndex !== null && playingIndex < surah.ayahs.length - 1) {
      setPlayingIndex(playingIndex + 1);
    } else {
      setPlayingIndex(null);
    }
  };

  const shareAyah = useCallback((ayah: Ayah) => {
    const text = ayah.text;
    const translation = settings.language === 'ur' ? ayah.urduTranslation : ayah.translation;
    const ref = `${surah?.englishName} [${surahNumber}:${ayah.numberInSurah}]`;
    
    const shareData = {
      title: `Surah ${surah?.englishName}`,
      text: `${text}\n\n${translation}\n\n— ${ref}\n\nShared via Noor-ul-Qalb`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(shareData.text);
      alert("Ayah copied to clipboard!");
    }
  }, [surah, surahNumber, settings.language]);

  const showAiInsight = useCallback(async (ayah: Ayah) => {
    setTafseer(""); 
    setIsAiLoading(true);
    const result = await geminiService.getAyahInsight(
      ayah.text, 
      ayah.urduTranslation || "", 
      surah?.englishName || "Quran", 
      ayah.numberInSurah
    );
    
    // Check against all known AI error codes to show a user-friendly message
    if (result === AI_ERROR_QUOTA || result === AI_ERROR_KEY_INVALID || result === AI_ERROR_GENERAL || !result) {
      setTafseer("AI Ma'alumat load nahi ho saki.");
    } else {
      setTafseer(result);
    }
    setIsAiLoading(false);
  }, [surah]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 theme-bg min-h-screen">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-widest theme-text-secondary">Puri Surah aa rahi hai...</p>
    </div>
  );
  
  if (!surah) return <div className="p-8 text-center text-rose-500">Error loading.</div>;

  return (
    <div className="relative theme-bg min-h-screen">
      <audio ref={audioRef} onEnded={handleAudioEnd} className="hidden" />
      
      <div className="bg-emerald-700 dark:bg-emerald-950 p-12 rounded-b-[3.5rem] text-white text-center mb-10 relative shadow-lg overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        <button onClick={onBack} className="absolute left-6 top-8 p-3 bg-white/10 rounded-2xl border border-white/10 active:scale-90 transition-all">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
        </button>
        <div className="flex flex-col items-center relative z-10">
          <h2 className="text-3xl font-black mb-1">{surah.englishName}</h2>
          <p className="text-emerald-300 arabic-text text-2xl" dir="rtl">{surah.name}</p>
          <div className="mt-6 flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full border border-white/10">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Auto-Play</span>
             <button onClick={() => setAutoPlay(!autoPlay)} className={`w-10 h-5 rounded-full transition-all relative ${autoPlay ? 'bg-emerald-400' : 'bg-white/20'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${autoPlay ? 'right-1' : 'left-1'}`}></div>
             </button>
          </div>
        </div>
      </div>

      <div className="px-6 space-y-16 pb-40">
        {surahNumber !== 1 && surahNumber !== 9 && (
          <div className="text-center arabic-text text-4xl theme-text-primary py-10 opacity-80 border-b theme-border">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        )}
        
        {surah.ayahs.map((ayah, idx) => (
          <AyahRow 
            key={ayah.number} 
            ayah={ayah} 
            settings={settings} 
            isPlaying={playingIndex === idx}
            isBookmarked={bookmarks.some(b => b.number === ayah.number)}
            onToggleAudio={() => toggleAudio(idx)} 
            onBookmark={() => onToggleBookmark(ayah, surah.englishName)}
            onShowTafseer={() => showAiInsight(ayah)}
            onShare={() => shareAyah(ayah)}
          />
        ))}
      </div>

      {tafseer !== null && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-end animate-in fade-in duration-300" onClick={() => setTafseer(null)}>
          <div className="theme-nav theme-text-primary w-full max-w-md mx-auto rounded-t-[3.5rem] p-10 max-h-[75vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-20 duration-500" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                 <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                 <h3 className="text-lg font-black uppercase tracking-widest text-emerald-600">Sada Matlab</h3>
              </div>
              <button onClick={() => setTafseer(null)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            {isAiLoading ? (
               <div className="py-10 flex flex-col items-center gap-4">
                  <div className="w-8 h-8 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black theme-text-secondary uppercase tracking-[0.2em]">Malumat nikaal rahe hain...</p>
               </div>
            ) : (
              <div className="leading-relaxed theme-text-secondary prose prose-emerald text-sm whitespace-pre-wrap urdu-text" dir="rtl">
                {tafseer}
              </div>
            )}
            
            <button onClick={() => setTafseer(null)} className="tap-effect w-full mt-10 py-5 bg-emerald-600 text-white rounded-[1.5rem] font-bold uppercase tracking-widest shadow-xl shadow-emerald-600/20">Theek Hai</button>
          </div>
        </div>
      )}
    </div>
  );
};

const AyahRow = React.memo(({ ayah, settings, isPlaying, isBookmarked, onToggleAudio, onBookmark, onShowTafseer, onShare }: any) => (
  <div className={`pb-12 border-b theme-border transition-all duration-500 ${isPlaying ? 'bg-emerald-500/5 -mx-6 px-6 pt-4 rounded-xl border-emerald-500/20' : ''}`}>
    <div className="flex items-center justify-between mb-8">
       <div className="flex items-center gap-2">
         <div className={`w-10 h-10 rounded-xl font-bold text-[10px] flex items-center justify-center transition-colors shadow-sm ${isPlaying ? 'bg-emerald-600 text-white' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}`}>
           {ayah.numberInSurah}
         </div>
         <button onClick={onToggleAudio} className="tap-effect p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm border theme-border">
           <svg className={`w-5 h-5 ${isPlaying ? 'text-emerald-600' : 'text-slate-400'}`} fill="currentColor" viewBox="0 0 24 24">
             {isPlaying ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/> : <path d="M8 5v14l11-7z"/>}
           </svg>
         </button>
         <button onClick={onBookmark} className="tap-effect p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm border theme-border">
           <ICONS.Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
         </button>
         <button onClick={onShare} className="tap-effect p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shadow-sm border theme-border">
           <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
         </button>
       </div>
       <button onClick={onShowTafseer} className="tap-effect text-[9px] font-black border-2 border-emerald-500/20 px-5 py-2.5 rounded-2xl theme-text-primary bg-emerald-500/5 uppercase tracking-widest flex items-center gap-2">
         <ICONS.Sparkles className="w-3.5 h-3.5 text-emerald-600" />
         Matlab
       </button>
    </div>

    <p className="arabic-text text-right mb-8 theme-text-primary antialiased" dir="rtl" style={{ fontSize: `${settings.fontSizeArabic}px` }}>
      {ayah.text}
    </p>
    <p className="urdu-text leading-relaxed font-semibold theme-text-secondary antialiased" style={{ fontSize: `${settings.fontSizeTranslation}px` }} dir={settings.language === 'ur' ? 'rtl' : 'ltr'}>
      {settings.language === 'ur' ? ayah.urduTranslation : ayah.translation}
    </p>
  </div>
));

export default React.memo(ReaderView);
