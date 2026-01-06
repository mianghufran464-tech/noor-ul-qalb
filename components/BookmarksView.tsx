
import React from 'react';
import { Ayah, AppSettings } from '../types';
import { ICONS } from '../constants';

interface BookmarksViewProps {
  bookmarks: any[];
  settings: AppSettings;
  onToggleBookmark: (ayah: Ayah, surahName: string) => void;
}

const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, settings, onToggleBookmark }) => {
  return (
    <div className="p-6 pb-32">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <ICONS.Bookmark className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-black theme-text-primary">Saved Verses</h2>
        <p className="theme-text-secondary text-sm">Your spiritual collection</p>
      </div>

      {bookmarks.length === 0 ? (
        <div className="py-20 text-center opacity-40 italic">No bookmarks yet. Tap the bookmark icon while reading.</div>
      ) : (
        <div className="space-y-6">
          {bookmarks.map((ayah) => (
            <div key={ayah.number} className="theme-card border theme-border rounded-[2rem] p-8 shadow-sm relative group">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{ayah.surahName} : {ayah.numberInSurah}</span>
                <button onClick={() => onToggleBookmark(ayah, ayah.surahName)} className="tap-effect p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30">
                  <ICONS.Bookmark className="w-4 h-4 fill-rose-500 text-rose-500" />
                </button>
              </div>
              <p className="arabic-text text-right mb-6 theme-text-primary text-2xl font-bold" dir="rtl">{ayah.text}</p>
              <p className="urdu-text text-[14px] font-semibold theme-text-secondary text-right" dir="rtl">{settings.language === 'ur' ? ayah.urduTranslation : ayah.translation}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarksView;
