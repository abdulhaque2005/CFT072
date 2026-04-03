import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function predictMarketPrice(crop, location, currentPrice, pastTrend) {
  const prompt = `You are a market advisor for Indian farmers. Give advice in Hinglish.

CROP: ${crop}
LOCATION: ${location}
CURRENT PRICE: ₹${currentPrice || 'Unknown'} per quintal
PAST TREND: ${pastTrend || 'Not available'}

MARKET PREDICTION RULES:
- Increasing trend + low supply → price will go UP, wait karein
- Decreasing trend + high supply → price will go DOWN, jaldi sell karein
- Stable trend → hold, thoda wait karein
- Festival season → demand badhti hai, prices UP
- Harvest season (glut) → supply zyada, prices DOWN
- Government MSP se compare karein

TASK:
1. Predict if price will go UP or DOWN in next 7-15 days
2. Give clear recommendation: SELL NOW or WAIT
3. Explain reasoning
4. Mention MSP (Minimum Support Price) if applicable

OUTPUT FORMAT:
📊 Price Prediction: [UP/DOWN/STABLE]
💡 Recommendation: [SELL NOW / WAIT X DAYS]
📝 Reason: [Short explanation]

Keep response under 150 words.`;

  try {
    logger.ai('Calling Gemini for market prediction...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return {
      crop,
      location,
      currentPrice: currentPrice || null,
      prediction: response.text
    };
  } catch (error) {
    logger.error(`Gemini market error: ${error.message}`);
    return {
      crop,
      location,
      currentPrice: currentPrice || null,
      prediction: `## Market Advisory for ${crop}\n\n📊 Trend: Data analysis available nahi hai.\n💡 Suggestion: Local mandi prices check karein.\n📞 e-NAM portal (enam.gov.in) pe current prices dekh sakte hain.`
    };
  }
}
