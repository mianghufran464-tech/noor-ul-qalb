
import { API_BASE } from '../constants';
import { Surah, SurahDetail, Ayah } from '../types';

const QURAN_CACHE_PREFIX = 'noor_quran_surah_';

export const fetchSurahList = async (): Promise<Surah[]> => {
  const cacheKey = 'noor_quran_surah_list';
  const cached = localStorage.getItem(cacheKey);
  
  if (!navigator.onLine && cached) {
    return JSON.parse(cached);
  }

  try {
    const response = await fetch(`${API_BASE}/surah`);
    const data = await response.json();
    localStorage.setItem(cacheKey, JSON.stringify(data.data));
    return data.data;
  } catch (e) {
    return cached ? JSON.parse(cached) : [];
  }
};

export const fetchSurahDetail = async (surahNumber: number, reciter: string = 'ar.alafasy'): Promise<SurahDetail> => {
  const cacheKey = `${QURAN_CACHE_PREFIX}${surahNumber}_${reciter}`;
  const cached = localStorage.getItem(cacheKey);

  if (!navigator.onLine && cached) {
    return JSON.parse(cached);
  }

  try {
    // Editions: quran-uthmani (Arabic), en.sahih (English), ur.jalandhry (Urdu), reciter
    const editions = `quran-uthmani,en.sahih,ur.jalandhry,${reciter}`;
    const response = await fetch(`${API_BASE}/surah/${surahNumber}/editions/${editions}`);
    const data = await response.json();
    
    const arabic = data.data[0];
    const english = data.data[1];
    const urdu = data.data[2];
    const audio = data.data[3];

    const ayahs: Ayah[] = arabic.ayahs.map((ayah: any, index: number) => ({
      ...ayah,
      translation: english.ayahs[index].text,
      urduTranslation: urdu.ayahs[index].text,
      audio: audio.ayahs[index].audio
    }));

    const result = { ...arabic, ayahs };
    localStorage.setItem(cacheKey, JSON.stringify(result));
    return result;
  } catch (e) {
    if (cached) return JSON.parse(cached);
    throw e;
  }
};

export const fetchTafseer = async (surahNum: number, ayahNum: number): Promise<string> => {
  const cacheKey = `tafseer_${surahNum}_${ayahNum}`;
  const cached = localStorage.getItem(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`https://api.alquran.cloud/v1/ayah/${surahNum}:${ayahNum}/editions/en.asad`);
    const data = await response.json();
    const text = data.data[0].text;
    localStorage.setItem(cacheKey, text);
    return text;
  } catch (e) {
    return "Tafseer information currently unavailable offline.";
  }
};
