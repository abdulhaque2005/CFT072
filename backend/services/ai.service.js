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

  const masterPrompt = `You are the MASTER AI BRAIN of Smart Farming AI. Combine ALL data and give ONE comprehensive response.

FARMER'S QUESTION: ${farmerQuery || 'Give me complete farming advice'}
LOCATION: ${location || 'Not specified'}
CROP: ${crop || 'Not decided'}

${results.soil ? `SOIL ANALYSIS:
- Health Score: ${results.soil.healthScore}/100
- Soil Type: ${results.soil.soilType}` : ''}

${results.weather ? `WEATHER: ${results.weather.current ? `${results.weather.current.temp}°C, ${results.weather.current.description}` : 'Data unavailable'}` : ''}

YOUR BEHAVIOR:
- Talk like a human friend in Hinglish
- Give practical advice farmer can act on TODAY
- Be encouraging

OUTPUT FORMAT:
1. 🌱 Mitti ki Haalat — 2-3 lines
2. 🌾 Best Fasal — top recommendation
3. 🧪 Fertilizer Plan — key points
4. 🌧️ Mausam Advisory — today's action
5. 💰 Market/Scheme Tip
6. ✅ Final Sujhav — 1 clear action

Keep under 400 words. Be warm and helpful.`;

  try {
    logger.ai('Calling Gemini MASTER MODE...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: masterPrompt
    });
    return { masterAdvice: response.text, details: results, query: farmerQuery || null };
  } catch (error) {
    logger.error(`Gemini master error: ${error.message}`);
    let fallback = `## 🌾 Smart Farming Report\n\n`;
    if (results.soil) fallback += `**Soil Score:** ${results.soil.healthScore}/100\n\n`;
    if (results.weather) fallback += `**Weather:** Check details below\n\n`;
    fallback += `_Detailed AI analysis unavailable._`;
    return { masterAdvice: fallback, details: results, query: farmerQuery || null };
  }
}

export async function recoveryAdvisor(problem, soilData) {
  const prompt = `You are a crop recovery expert for Indian farmers. Respond in Hinglish.

PROBLEM: ${problem}
${soilData ? `SOIL: N=${soilData.nitrogen}, P=${soilData.phosphorus}, K=${soilData.potassium}, pH=${soilData.ph}` : ''}

TASK:
1. Assess damage type
2. Suggest recovery crops (low cost, short duration)
3. Give immediate action plan
4. Mention any insurance/govt support

Keep under 200 words. Be encouraging.`;

  try {
    logger.ai('Calling Gemini for recovery advice...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
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

export async function processVoiceQuery(transcript) {
  const prompt = `You are AgriSaar Fast Voice AI for farmers.

USER SPEECH: "${transcript}"

RULES:
1. Detect language, respond in Hinglish (Latin script)
2. EXTREMELY SHORT — under 15 seconds to read aloud (2-3 sentences max)
3. Give exact solution right away

OUTPUT ONLY THE RESPONSE TEXT.`;

  try {
    logger.ai('Calling Gemini for Voice AI...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    return { success: true, advice: response.text.trim() };
  } catch (error) {
    logger.error(`Gemini voice error: ${error.message}`);
    return { success: false, advice: `Main samajh nahi paaya. Kripya dobara bolein.` };
  }
}

export async function getNearbyFarmingInfo(lat, lon, location) {
  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });
  const currentSeason = getSeasonName();

  const prompt = `You are a local agriculture information system for Indian farmers. Respond in Hinglish.

FARMER LOCATION: ${location || `${lat}, ${lon}`}
CURRENT MONTH: ${currentMonth}
CURRENT SEASON: ${currentSeason}

TASK: Generate a comprehensive NEARBY FARMING REPORT for this location. Include:

1. **Nearby Krishi Vigyan Kendras (KVK)**: Estimate how many KVK/agriculture advisory centers are within 50km radius. Give approximate count and name 1-2 nearest ones.

2. **Crop Advisory for this Region**: What crops are currently being grown in this area? What stage are they at (buwai, growth, harvest)?

3. **Expected Yield**: For top 2-3 crops in this region, what is the expected yield per acre this season?

4. **Current Farming Activities**: What are farmers in this region doing RIGHT NOW (this week)?

5. **Advisors Count**: Estimate total agriculture advisors, extension workers, and KVK scientists available in the nearby district.

OUTPUT FORMAT — respond in structured text:
🏛️ Nearby Advisors: [X+ KVK centers, Y+ agriculture officers in district]
🌾 Active Crops: [List crops currently growing]
📊 Growth Stage: [Stage details]
📈 Expected Yield: [Yield per acre for top crops]
🗓️ This Week: [What to do right now]
👨‍🌾 Expert Access: [How to reach nearest KVK/advisor]

Keep response under 250 words. Be specific to the location.`;

  try {
    logger.ai('Calling Gemini for nearby farming info...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    return {
      location: location || `${lat}, ${lon}`,
      season: currentSeason,
      month: currentMonth,
      info: response.text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Gemini nearby info error: ${error.message}`);
    return {
      location: location || `${lat}, ${lon}`,
      season: currentSeason,
      month: currentMonth,
      info: `🏛️ Nearby Advisors: Apne district ke KVK (Krishi Vigyan Kendra) se contact karein\n🌾 Active Crops: Season ke hisaab se crops chal rahi hain\n📞 Helpline: Kisan Call Center — 1800-180-1551 (Free)\n\n_AI info temporarily unavailable._`,
      timestamp: new Date().toISOString()
    };
  }
}

function getSeasonName() {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return 'Kharif (Monsoon)';
  if (month >= 11 || month <= 3) return 'Rabi (Winter)';
  return 'Zaid (Summer)';
}
