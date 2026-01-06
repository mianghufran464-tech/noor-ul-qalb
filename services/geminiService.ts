export const AI_ERROR_QUOTA = "QUOTA_EXHAUSTED";
export const AI_ERROR_KEY_INVALID = "KEY_INVALID";
export const AI_ERROR_GENERAL = "AI_ERROR";

export class GeminiService {
  private async callApi(prompt: string, systemInstruction?: string) {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, systemInstruction })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return errorData.error || AI_ERROR_GENERAL;
      }

      const data = await response.json();
      return data.text || "";
    } catch (e) {
      console.error("Gemini Communication Error:", e);
      return AI_ERROR_GENERAL;
    }
  }

  async getAyahInsight(ayahText: string, translation: string, surahName: string, ayahNumber: number) {
    const prompt = `Verse: ${ayahText}\nTranslation: ${translation}\nLocation: Surah ${surahName}, Ayah ${ayahNumber}`;
    const system = "Provide a simple, heartwarming 2-sentence explanation of this verse in plain Urdu. Avoid complex words.";
    return this.callApi(prompt, system);
  }

  async conceptualSearch(query: string) {
    const prompt = `Topic: "${query}"`;
    const system = "Find 2-3 relevant Quranic verses for this topic and give their simple Urdu meanings. Format with Arabic then Urdu.";
    return this.callApi(prompt, system);
  }

  async translateHadithToUrdu(arabicText: string): Promise<string> {
    const prompt = `Translate Hadith: ${arabicText}`;
    const system = "Translate this Hadith into very simple, easy Urdu.";
    const result = await this.callApi(prompt, system);
    if (result === AI_ERROR_GENERAL || result === AI_ERROR_QUOTA || result === AI_ERROR_KEY_INVALID) return "";
    return result;
  }
}

export const geminiService = new GeminiService();