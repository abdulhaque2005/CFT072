import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function predictMarketPrice(crop, location, currentPrice, pastTrend) {
  const prompt = `You are an expert agricultural market analyst.
CROP: ${crop}
LOCATION: ${location || 'India'}

TASK: Predict the market price trend for the next 7 days. Give highly realistic simulated data if real data is unavailable.
OUTPUT FORMAT: Return ONLY valid JSON inside a code block exactly like this:
{
  "currentPrice": 2450,
  "trendData": [
    { "day": "Day 1", "price": 2450 },
    { "day": "Day 2", "price": 2480 },
    { "day": "Day 3", "price": 2510 },
    { "day": "Day 4", "price": 2490 },
    { "day": "Day 5", "price": 2550 },
    { "day": "Day 6", "price": 2600 },
    { "day": "Day 7", "price": 2650 }
  ],
  "analysis": "Prices are currently stable but expected to rise by weekend due to festival demand.",
  "recommendation": "Hold for 5 days. Sell when price hits 2600."
}`;

  try {
    logger.ai('Calling Gemini for market prediction...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    const jsonMatch = rawText.match(/```(?:json)?\n([\s\S]*?)\n```/) || rawText.match(/{[\s\S]*}/);
    const resultJson = jsonMatch ? JSON.parse(jsonMatch[1] || jsonMatch[0]) : null;

    if (resultJson) {
      return { crop, location, ...resultJson };
    }
    throw new Error('Invalid JSON from Gemini');
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
