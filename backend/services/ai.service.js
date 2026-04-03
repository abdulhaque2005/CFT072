import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { analyzeSoil } from './soilAnalysis.service.js';
import { recommendCrops } from './cropRecommendation.service.js';
import { getFertilizerPlan } from './fertilizer.service.js';
import { getWeatherAdvisory } from './weather.service.js';
import { findSchemes } from './govScheme.service.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function masterAdvisor(input) {
  const { soilData, location, crop, season, farmerQuery } = input;

  const results = {};

  if (soilData) {
    results.soil = await analyzeSoil(soilData);
  }

  if (soilData && location) {
    results.crops = await recommendCrops(soilData, location, season);
  }

  if (soilData && crop) {
    results.fertilizer = await getFertilizerPlan(soilData, crop);
  }

  if (location) {
    results.weather = await getWeatherAdvisory(location);
  }

  if (location) {
    results.schemes = await findSchemes(location, crop);
  }

  const masterPrompt = `You are the MASTER AI BRAIN of Smart Farming AI. You must combine ALL the data below and give ONE FINAL comprehensive response to the farmer.

FARMER'S QUESTION: ${farmerQuery || 'Give me complete farming advice'}
LOCATION: ${location || 'Not specified'}
CROP: ${crop || 'Not decided'}

${results.soil ? `SOIL ANALYSIS:
- Health Score: ${results.soil.healthScore}/100
- Soil Type: ${results.soil.soilType}
- N Level: ${results.soil.nutrients?.nitrogen?.level || 'Unknown'}
- P Level: ${results.soil.nutrients?.phosphorus?.level || 'Unknown'}
- K Level: ${results.soil.nutrients?.potassium?.level || 'Unknown'}` : ''}

${results.crops ? `CROP RECOMMENDATION: Available` : ''}
${results.fertilizer ? `FERTILIZER PLAN: Available` : ''}
${results.weather ? `WEATHER: ${results.weather.current ? `${results.weather.current.temp}°C, ${results.weather.current.description}` : 'Data unavailable'}` : ''}

YOUR BEHAVIOR:
- Talk like a human friend, not a robot
- Use simple Hinglish (Hindi + English mix)
- Give practical advice that farmer can act on TODAY
- Be encouraging — "Aap sahi raaste pe hain!"
- If problem detected, give solution immediately

FINAL OUTPUT FORMAT:
1. 🌱 Mitti ki Haalat (Soil Condition) — 2-3 lines
2. 🌾 Best Fasal (Crop) — top recommendation
3. 🧪 Fertilizer Plan — key points only
4. 🌧️ Mausam Advisory (Weather) — today's action
5. 💰 Market/Scheme Tip — any opportunity
6. ✅ Final Sujhav (Suggestion) — 1 clear action item

Keep total response under 400 words. Be warm and helpful.`;

  try {
    logger.ai('Calling Gemini MASTER MODE...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: masterPrompt
    });

    return {
      masterAdvice: response.text,
      details: results,
      query: farmerQuery || null
    };
  } catch (error) {
    logger.error(`Gemini master error: ${error.message}`);

    let fallback = `## 🌾 Smart Farming Report\n\n`;
    if (results.soil) fallback += `**Soil Score:** ${results.soil.healthScore}/100 (${results.soil.soilType})\n\n`;
    if (results.crops) fallback += `**Crop Advice:** Available in details\n\n`;
    if (results.weather) fallback += `**Weather:** Check details below\n\n`;
    fallback += `_Detailed AI analysis unavailable. Check individual sections for more info._`;

    return { masterAdvice: fallback, details: results, query: farmerQuery || null };
  }
}

export async function recoveryAdvisor(problem, soilData) {
  const prompt = `You are a crop recovery expert for Indian farmers. Respond in Hinglish.

PROBLEM: ${problem}
${soilData ? `SOIL: N=${soilData.nitrogen}, P=${soilData.phosphorus}, K=${soilData.potassium}, pH=${soilData.ph}` : ''}

RECOVERY RULES:
- Flood damage → short duration crops (moong, urad) — 60-70 din mein taiyar
- Drought → drought-resistant crops (bajra, jowar, moth)
- Pest attack → neem-based organic spray, crop rotation
- Disease → fungicide + resistant varieties
- Hail damage → insurance claim + quick replanting

TASK:
1. Assess damage type
2. Suggest recovery crops (low cost, short duration)
3. Give immediate action plan
4. Mention any insurance/govt support

Keep response under 200 words. Be encouraging.`;

  try {
    logger.ai('Calling Gemini for recovery advice...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return { problem, recovery: response.text };
  } catch (error) {
    logger.error(`Gemini recovery error: ${error.message}`);
    return {
      problem,
      recovery: `## Recovery Plan\n\n🌿 Short duration crops try karein (Moong, Urad — 60 din)\n💧 Soil moisture maintain karein\n📋 PM Fasal Bima Yojana mein claim karein\n💪 Himmat rakhein — recovery possible hai!`
    };
  }
}
