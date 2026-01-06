
export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  translation?: string;
  urduTranslation?: string;
  tafseer?: string;
  audio?: string;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
}

export interface Hadith {
  id: number;
  collectionId: string;
  collectionName: string;
  bookNumber: string;
  hadithNumber: string;
  hadithArabic: string;
  hadithEnglish: string;
  hadithUrdu?: string;
  narrator: string;
  chapterName: string;
  authenticity: 'Sahih' | 'Hasan' | 'Da\'if' | 'Unknown';
  topic: string;
}

export enum ViewMode {
  HOME = 'home',
  READER = 'reader',
  HADITH = 'hadith',
  AI_INSIGHTS = 'ai_insights',
  SETTINGS = 'settings',
  BOOKMARKS = 'bookmarks',
  TASBEEH = 'tasbeeh'
}

export interface AppSettings {
  fontSizeArabic: number;
  fontSizeTranslation: number;
  language: 'en' | 'ur';
  theme: 'light' | 'dark' | 'sepia';
  reciter: string;
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
  date: string;
  location: string;
}
