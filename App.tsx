import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import Layout from './components/Layout';
import { ViewMode, Surah, AppSettings, Ayah, PrayerTimes } from './types';
import { fetchSurahList } from './services/quranDataService';
import { fetchPrayerTimes } from './services/prayerService';
import { ICONS } from './constants';
import './index.css';

// Using standard imports without extensions as Vite resolves these automatically
const SurahList = lazy(() => import('./components/SurahList'));
const ReaderView = lazy(() => import('./components/ReaderView'));
const HadithView = lazy(() => import('./components/HadithView'));
const AiInsights = lazy(() => import('./components/AiInsights'));
const SettingsView = lazy(() => import('./components/SettingsView'));
const BookmarksView = lazy(() => import('./components/BookmarksView'));
const TasbeehView = lazy(() => import('./components/TasbeehView'));

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>(ViewMode.HOME);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [dailyAyah, setDailyAyah] = useState<{ text: string, ref: string, surahNum: number, translation?: string } | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [bookmarks, setBookmarks] = useState<any[]>(() => {
    const saved = localStorage.getItem('noor_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('noor_settings');
    return saved ? JSON.parse(saved) : {
      fontSizeArabic: 32,
      fontSizeTranslation: 18,
      language: 'ur',
      theme: 'light',
      reciter: 'ar.alafasy'
    };
  });

  useEffect(() => {
    localStorage.setItem('noor_settings', JSON.stringify(settings));
    document.body.className = settings.theme;
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('noor_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = useCallback((ayah: Ayah, surahName: string) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.number === ayah.number);
      if (exists) return prev.filter(b => b.number !== ayah.number);
      return [...prev, { ...ayah, surahName }];
    });
  }, []);

  const handleSurahSelect = useCallback((num: number) => {
    setSelectedSurah(num);
    setActiveView(ViewMode.READER);
  }, []);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const list = await fetchSurahList();
        setSurahs(list);
        
        const inspirations = [
          { text: "فَإِنَّ مَعَ الْعُسْرِ يُسْرًا", ref: '94:5', surahNum: 94, translation: "Beshaq mushkil ke saath asaani hai." },
          { text: "وَقُل رَّبِّ زِدْنِي عِلْمًا", ref: '20:114', surahNum: 20, translation: "Aye Rab, mere ilm mein izafa farma." },
          { text: "إِنَّ اللَّهَ مَعَ الصَّابِرِينَ", ref: '2:153', surahNum: 2, translation: "Allah sabr karne walon ke saath hai." }
        ];
        setDailyAyah(inspirations[Math.floor(Math.random() * inspirations.length)]);

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (pos) => {
            try {
              const times = await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
              setPrayerTimes(times);
            } catch (e) {
              console.warn("Prayer times fetch failed");
            }
          }, (err) => {
            console.warn("Location permission not granted.");
          });
        }

        setLoading(false);
      } catch (error) { 
        console.error("Initialization error:", error);
        setLoading(false); 
      }
    };
    loadInitialData();
  }, []);

  const homeView = useMemo(() => (
    <div className="px-6 py-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight theme-text-primary">Salaam,</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Have a blessed day</p>
        </div>
      </header>

      <div className="glass rounded-[2.5rem] p-6 border border-emerald-500/10 shadow-sm">
        <div className="flex justify-between items-center mb-4 px-2">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Namaz Auqat</span>
          <span className="text-[10px] font-bold text-emerald-600">Today</span>
        </div>
        <div className="flex justify-between overflow-x-auto no-scrollbar gap-3">
          {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(p => (
            <div key={p} className="flex flex-col items-center min-w-[64px] p-3 rounded-2xl bg-white/40 dark:bg-black/20 border border-emerald-500/5">
              <span className="text-[8px] font-black uppercase opacity-40 mb-1">{p}</span>
              <span className="text-xs font-black theme-text-primary">{prayerTimes ? (prayerTimes as any)[p] : '--:--'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-emerald-700 dark:bg-emerald-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="relative z-10">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-60">Ayat of the Day</span>
          {dailyAyah && (
            <>
              <p className="arabic-text text-4xl mt-6 mb-4 leading-relaxed text-right" dir="rtl">{dailyAyah.text}</p>
              <p className="text-sm opacity-90 font-medium mb-8 text-right italic">"{dailyAyah.translation}"</p>
              <button 
                onClick={() => handleSurahSelect(dailyAyah.surahNum)}
                className="bg-white text-emerald-900 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center gap-2"
              >
                Read Now <ICONS.ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => setActiveView(ViewMode.READER)} className="glass border border-emerald-500/10 p-6 rounded-[2rem] flex flex-col items-center gap-2 shadow-sm">
          <ICONS.Book className="w-6 h-6 text-emerald-600" />
          <span className="text-[10px] font-black uppercase tracking-widest theme-text-primary">Al-Quran</span>
        </button>
        <button onClick={() => setActiveView(ViewMode.TASBEEH)} className="glass border border-emerald-500/10 p-6 rounded-[2rem] flex flex-col items-center gap-2 shadow-sm">
          <ICONS.Tasbeeh className="w-6 h-6 text-rose-500" />
          <span className="text-[10px] font-black uppercase tracking-widest theme-text-primary">Tasbeeh</span>
        </button>
      </div>
    </div>
  ), [prayerTimes, dailyAyah, handleSurahSelect]);

  return (
    <Layout activeView={activeView} onViewChange={setActiveView} title={activeView === ViewMode.HOME ? 'Noor-ul-Qalb' : undefined}>
      <Suspense fallback={<div className="p-20 text-center animate-pulse theme-text-primary">Loading...</div>}>
        {activeView === ViewMode.HOME ? homeView : (
          activeView === ViewMode.READER && selectedSurah ? (
            <ReaderView surahNumber={selectedSurah} onBack={() => setSelectedSurah(null)} settings={settings} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />
          ) : activeView === ViewMode.READER ? (
            <div className="px-6"><SurahList surahs={surahs} onSurahSelect={handleSurahSelect} /></div>
          ) : activeView === ViewMode.HADITH ? (
            <HadithView settings={settings} />
          ) : activeView === ViewMode.AI_INSIGHTS ? (
            <AiInsights />
          ) : activeView === ViewMode.SETTINGS ? (
            <SettingsView settings={settings} onSettingsChange={setSettings} />
          ) : activeView === ViewMode.BOOKMARKS ? (
            <BookmarksView settings={settings} bookmarks={bookmarks} onToggleBookmark={toggleBookmark} />
          ) : (
            <TasbeehView />
          )
        )}
      </Suspense>
    </Layout>
  );
};

export default App;