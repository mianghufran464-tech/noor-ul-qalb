
import React, { useState } from 'react';
import { geminiService } from '../services/geminiService';
import { ICONS } from '../constants';

const AiInsights: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await geminiService.conceptualSearch(query);
      if (response === "AI_ERROR" || response?.includes("QUOTA")) {
        setError("AI Service temporary unavailable. Please try again later.");
      } else {
        setResult(response || 'No results found.');
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    }
    setLoading(false);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice Search is not supported in this browser.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.start();
    setIsListening(true);
    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
      setIsListening(false);
      handleSearch();
    };
    recognition.onerror = () => setIsListening(false);
  };

  return (
    <div className="p-6 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center">
        <div className={`w-24 h-24 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 transition-all shadow-2xl ${isListening ? 'bg-rose-500 text-white scale-110 animate-pulse' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30'}`}>
          <ICONS.Sparkles className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-black theme-text-primary">Ma'arifat AI</h2>
        <p className="theme-text-secondary text-sm font-medium mt-1">Deep Quranic Exploration</p>
      </div>

      <form onSubmit={handleSearch} className="mb-10">
        <div className="relative group">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Concept of patience in Quran..." 
            className="w-full theme-card border-2 theme-border rounded-[2.5rem] py-6 pl-14 pr-24 focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 theme-text-primary transition-all text-sm"
          />
          <ICONS.Search className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <button type="button" onClick={startListening} className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 transition-colors">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
            </button>
            <button type="submit" disabled={loading} className="bg-emerald-600 text-white px-5 rounded-2xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all">
              {loading ? <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div> : <ICONS.ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mb-10 theme-card border-2 border-rose-200 bg-rose-50 dark:bg-rose-950/20 rounded-[2.5rem] p-8 text-center animate-in zoom-in duration-300">
          <p className="text-rose-600 font-black text-sm uppercase tracking-widest">{error}</p>
        </div>
      )}

      {result && (
        <div className="theme-card border-2 theme-border rounded-[3rem] p-10 shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
             <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ma'arifat Analysis</p>
          </div>
          <div className="theme-text-primary leading-loose text-sm whitespace-pre-wrap">{result}</div>
          <div className="mt-8 flex gap-4">
            <button onClick={() => { navigator.clipboard.writeText(result); alert("Copied to clipboard"); }} className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
               Copy
            </button>
            <button onClick={() => {
               if (navigator.share) {
                 navigator.share({ title: 'AI Insight', text: result });
               }
            }} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
               Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiInsights;
