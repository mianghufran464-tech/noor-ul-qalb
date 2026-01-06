import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt, systemInstruction } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // API key must be named API_KEY in your Vercel Environment Variables
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are a helpful Quranic assistant providing simple Urdu meanings."
      },
    });

    // Accessing .text as a property as required by guidelines
    const generatedText = response.text || "";
    
    return res.status(200).json({ text: generatedText });
  } catch (error: any) {
    console.error("Gemini Server Error:", error);
    
    const errorMsg = error.message?.toLowerCase() || "";
    if (errorMsg.includes("429") || errorMsg.includes("quota")) {
      return res.status(429).json({ error: 'QUOTA_EXHAUSTED' });
    }
    if (errorMsg.includes("401") || errorMsg.includes("api_key_invalid") || errorMsg.includes("unauthorized")) {
      return res.status(401).json({ error: 'KEY_INVALID' });
    }
    
    return res.status(500).json({ error: 'AI_ERROR', details: error.message });
  }
}