import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function compareMandis(crop, location, mandiPrices) {
  const mandiList = mandiPrices && mandiPrices.length > 0
    ? mandiPrices.map(m => `${m.name}: ₹${m.price}/quintal`).join('\n')
    : 'No mandi data provided';

  const prompt = `You are a mandi (market) comparison advisor for Indian farmers. Give advice in Hinglish.

CROP: ${crop}
FARMER LOCATION: ${location}
NEARBY MANDI PRICES:
${mandiList}

TASK:
1. Compare all mandi prices
2. Find the BEST mandi (highest price)
3. Consider transport cost and distance
4. Give clear recommendation — kahan sell karein

OUTPUT FORMAT:
📍 Best Mandi: [Name] — ₹[Price]/quintal
📍 2nd Option: [Name] — ₹[Price]/quintal
💡 Recommendation: [Where to sell and why]
🚛 Transport Tip: [Consider distance]

If no mandi data provided, suggest checking e-NAM portal (enam.gov.in).

Keep response under 150 words.`;

  try {
    logger.ai('Calling Gemini for mandi comparison...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
