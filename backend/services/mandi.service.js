import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function compareMandis(crop, location, mandiPrices) {
  const mandiList = mandiPrices && mandiPrices.length > 0
    ? mandiPrices.map(m => `${m.name}: ₹${m.price}/quintal`).join('\n')
    : 'No mandi data provided';

  const prompt = `You are a real-time mandi (market) comparison advisor for Indian farmers. Give advice ONLY in pure simple Hindi.

CROP: ${crop}
FARMER LOCATION: ${location}
NEARBY MANDI PRICES PROVIDED BY SYSTEM:
${mandiList}

TASK:
1. If "NEARBY MANDI PRICES" are empty or "No mandi data", YOU MUST act as a live data fetcher. Search your knowledge base and simulate/predict the REAL current average market prices for ${crop} in 2-3 prominent Mandis nearest to ${location}.
2. Compare the mandi prices (either provided or simulated by you).
3. Find the BEST mandi (highest price).
4. Consider transport cost and distance from ${location}.
5. Give clear recommendation — kahan sell karein (sell locally vs travel far).

OUTPUT STRICTLY IN THIS EXACT FORMAT:
📍 Best Mandi: [Near by Location Name] — ₹[Predict Price]/quintal
📍 2nd Option: [Near by Location Name] — ₹[Predict Price]/quintal
💡 Recommendation: [Where to sell and why based on location cost]
🚛 Transport Tip: [Consider distance from ${location}]

Keep response short, under 100 words, IN HINDI but written in Hinglish script (e.g. "Aapko paas wali mandi mein...") or pure Hindi script. Make it feel like it fetched LIVE data from nearby ${location}.`;

  try {
    logger.ai('Calling Gemini for mandi comparison...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt
    });
    return {
      crop,
      location,
      mandis: mandiPrices || [],
      comparison: response.text
    };
  } catch (error) {
    logger.error(`Gemini mandi error: ${error.message}`);
    return {
      crop,
      location,
      mandis: mandiPrices || [],
      comparison: `## Mandi Comparison\n\n📍 Local mandi prices check karein\n🌐 e-NAM portal: enam.gov.in pe online prices milenge\n📞 Apne area ke mandi samiti se contact karein`
    };
  }
}
