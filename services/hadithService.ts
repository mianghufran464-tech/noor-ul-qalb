import { Hadith } from '../types';
import { geminiService } from './geminiService';

const BASE_URL = 'https://api.hadith.gading.dev/books';
const CACHE_KEY = 'noor_hadith_store_v2';

export const COLLECTIONS = [
  { id: 'bukhari', name: 'صحیح بخاری', enName: 'Sahih Bukhari', icon: 'mosque' },
  { id: 'muslim', name: 'صحیح مسلم', enName: 'Sahih Muslim', icon: 'crescent' },
  { id: 'abudaud', name: 'سنن ابی داؤد', enName: 'Sunan Abu Dawood', icon: 'book' },
  { id: 'tirmidzi', name: 'سنن ترمذی', enName: 'Sunan al-Tirmidhi', icon: 'scroll' },
  { id: 'nasai', name: 'سنن نسائی', enName: 'Sunan an-Nasa’i', icon: 'star' },
  { id: 'ibnumajah', name: 'سنن ابن ماجہ', enName: 'Sunan Ibn Majah', icon: 'kaaba' },
];

const SEED_DATA: Record<string, any[]> = {
  'bukhari': [
    { num: 1, arab: "إنما الأعمال بالنيات", urdu: "اعمال کا دارومدار نیتوں پر ہے۔", narrator: "حضرت عمر بن خطاب رضی اللہ عنہ", auth: "Sahih" },
    { num: 10, arab: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ", urdu: "مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔", narrator: "حضرت عبداللہ بن عمرو رضی اللہ عنہ", auth: "Sahih" },
    { num: 13, arab: "لا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ", urdu: "تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔", narrator: "حضرت انس بن مالک رضی اللہ عنہ", auth: "Sahih" }
  ],
  'muslim': [
    { num: 1, arab: "الطُّهُورُ شَطْرُ الإِيمَانِ", urdu: "پاکیزگی نصف ایمان ہے۔", narrator: "حضرت ابومالک اشعری رضی اللہ عنہ", auth: "Sahih" },
    { num: 223, arab: "الصَّلاةُ نُورٌ", urdu: "نماز نور ہے۔", narrator: "حضرت ابومالک اشعری رضی اللہ عنہ", auth: "Sahih" }
  ],
  'abudaud': [
    { num: 1, arab: "إِذَا دَخَلَ أَحَدُكُمُ الْمَسْجِدَ فَلْيُصَلِّ رَكْعَتَيْنِ قَبْلَ أَنْ يَجْلِسَ", urdu: "جب تم میں سے کوئی مسجد میں داخل ہو تو بیٹھنے سے پہلے دو رکعت (تحیۃ المسجد) پڑھے۔", narrator: "حضرت ابوقتیادہ رضی اللہ عنہ", auth: "Sahih" }
  ],
  'ibnumajah': [
    { num: 224, arab: "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ", urdu: "علم کا حاصل کرنا ہر مسلمان پر فرض ہے۔", narrator: "حضرت انس بن مالک رضی اللہ عنہ", auth: "Sahih" }
  ]
};

const getCache = (): Record<string, Record<string, Hadith>> => {
  const saved = localStorage.getItem(CACHE_KEY);
  return saved ? JSON.parse(saved) : {};
};

const saveToCache = (hadith: Hadith) => {
  const cache = getCache();
  if (!cache[hadith.collectionId]) cache[hadith.collectionId] = {};
  cache[hadith.collectionId][hadith.hadithNumber] = hadith;
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

function cleanNarratorUrdu(raw: string): string {
  const map: Record<string, string> = {
    "Umar bin Al-Khaththab": "حضرت عمر بن خطاب",
    "Ibnu 'Abbas": "حضرت ابن عباس",
    "Abu Hurairah": "حضرت ابوہریرہ",
    "Aisyah": "حضرت عائشہ صدیقہ",
    "Anas bin Malik": "حضرت انس بن مالک",
    "Abdullah bin Mas'ud": "حضرت عبداللہ بن مسعود"
  };
  let cleaned = raw.replace(/telah menceritakan kepada kami|telah mengabarkan kepada kami|dari|berkata|mendengar|\[|\]/gi, '').trim();
  const matched = Object.keys(map).find(k => cleaned.includes(k));
  return matched ? `${map[matched]} رضی اللہ عنہ` : `حضرت ${cleaned} رضی اللہ عنہ`;
}

export const fetchHadiths = async (collectionId: string, range: string = '1-30'): Promise<Hadith[]> => {
  const cache = getCache();
  const localItems = cache[collectionId] ? Object.values(cache[collectionId]) : [];
  const collection = COLLECTIONS.find(c => c.id === collectionId);

  const seeds: Hadith[] = (SEED_DATA[collectionId] || []).map(s => ({
    id: s.num, collectionId, collectionName: collection?.name || 'حدیث', bookNumber: collectionId, hadithNumber: s.num.toString(), hadithArabic: s.arab, hadithUrdu: s.urdu, hadithEnglish: "", narrator: s.narrator, chapterName: collection?.name || "باب", authenticity: s.auth, topic: 'General'
  }));

  if (!navigator.onLine) {
    const merged = [...seeds];
    localItems.forEach(item => { if (!merged.find(m => m.hadithNumber === item.hadithNumber)) merged.push(item); });
    return merged.sort((a, b) => parseInt(a.hadithNumber) - parseInt(b.hadithNumber));
  }

  try {
    const response = await fetch(`${BASE_URL}/${collectionId}?range=${range}`);
    const data = await response.json();
    if (!data.data || !data.data.hadiths) return seeds;

    const finalResults: Hadith[] = [...seeds];
    const existingNums = new Set(seeds.map(s => s.hadithNumber));

    // Process first 10 immediately, defer others
    for (const h of data.data.hadiths.slice(0, 10)) {
      if (existingNums.has(h.number.toString())) continue;
      if (cache[collectionId]?.[h.number.toString()]) {
        finalResults.push(cache[collectionId][h.number.toString()]);
        continue;
      }
      const urduText = await geminiService.translateHadithToUrdu(h.arab);
      if (urduText) {
        const newHadith: Hadith = {
          id: h.number, collectionId, collectionName: collection?.name || 'حدیث', bookNumber: collectionId, hadithNumber: h.number.toString(), hadithArabic: h.arab, hadithEnglish: "", hadithUrdu: urduText, narrator: cleanNarratorUrdu(h.id?.split(',')[0] || "صحابی"), chapterName: collection?.name || "باب", authenticity: 'Sahih', topic: 'General'
        };
        saveToCache(newHadith);
        finalResults.push(newHadith);
      }
    }
    return finalResults.sort((a, b) => parseInt(a.hadithNumber) - parseInt(b.hadithNumber));
  } catch (e) {
    return seeds;
  }
};

export const fetchHadithByCategory = async (category: string): Promise<Hadith[]> => {
  return fetchHadiths('bukhari', '1-10');
};