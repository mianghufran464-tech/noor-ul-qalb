
import React, { useState, useMemo } from 'react';
import { Surah } from '../types';
import { ICONS } from '../constants';

interface SurahListProps {
  surahs: Surah[];
  onSurahSelect: (surahNumber: number) => void;
}

const SurahList: React.FC<SurahListProps> = ({ surahs, onSurahSelect }) => {
  const [search, setSearch] = useState('');

  const filteredSurahs = useMemo(() => {
    return surahs.filter(s => 
      s.englishName.toLowerCase().includes(search.toLowerCase()) || 
      s.number.toString() === search ||
      s.name.includes(search)
    );
  }, [surahs, search]);

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 theme-bg pb-2 pt-2">
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search Surah (e.g. Yaseen, 36)" 
            className="w-full theme-card border theme-border rounded-2xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <ICONS.Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>
      
      <div className="p-1 space-y-3">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <SurahItem key={surah.number} surah={surah} onSelect={onSurahSelect} />
          ))
        ) : (
          <div className="py-20 text-center opacity-40 italic">No Surah found</div>
        )}
      </div>
    </div>
  );
};

const SurahItem = React.memo(({ surah, onSelect }: { surah: Surah, onSelect: (num: number) => void }) => (
  <button
    onClick={() => onSelect(surah.number)}
    className="tap-effect w-full flex items-center justify-between p-4 theme-card rounded-2xl border theme-border hover:border-emerald-200 transition-all group shadow-sm"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 flex items-center justify-center bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
        {surah.number}
      </div>
      <div className="text-left">
        <h3 className="font-semibold theme-text-primary">{surah.englishName}</h3>
        <p className="text-xs theme-text-secondary uppercase tracking-wider">{surah.revelationType} • {surah.numberOfAyahs}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="arabic-text text-xl text-emerald-700 dark:text-emerald-400 font-bold">{surah.name}</p>
    </div>
  </button>
));

export default React.memo(SurahList);
