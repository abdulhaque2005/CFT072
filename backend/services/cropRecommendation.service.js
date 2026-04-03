import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { SEASONS } from '../utils/constants.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  for (const [key, season] of Object.entries(SEASONS)) {
    if (season.months.includes(month)) return { key, ...season };
  }
  return { key: 'rabi', ...SEASONS.rabi };
}

export async function recommendCrops(soilData, location, season) {
  const currentSeason = season || getCurrentSeason();
  const seasonLabel = typeof currentSeason === 'string' ? currentSeason : currentSeason.label;

  const prompt = `You are a crop advisor for Indian farmers. Give advice in simple Hindi + English mix.

SOIL DATA:
- Nitrogen: ${soilData.nitrogen} kg/ha
- Phosphorus: ${soilData.phosphorus} kg/ha
- Potassium: ${soilData.potassium} kg/ha
- pH: ${soilData.ph}
- Organic Carbon: ${soilData.organicCarbon || 'N/A'}%

LOCATION: ${location || 'India'}
SEASON: ${seasonLabel}

RECOMMENDATION RULES:
- Good N (>280) → leafy crops (palak, methi, dhaniya) aur cereal crops
- Balanced soil (all medium+) → wheat/rice best rahega
- Bad/poor soil → millets (bajra, jowar) ya pulses (moong, chana) better hai
- Acidic (pH < 6) → tea, potato, blue berries suitable
- Alkaline (pH > 7.5) → barley, sugar beet suitable
- High K → root crops like aloo, gajar

TASK:
1. Suggest top 3 best crops — rank them 1st, 2nd, 3rd
2. For each crop, explain WHY it's suitable (2 lines max)
3. Give suitability score (0-100) for each
4. Suggest 2 crops to AVOID and explain why

OUTPUT FORMAT:
🥇 Best Crop: [Name] — Score: [X]/100
   Reason: [Why]
🥈 2nd Best: [Name] — Score: [X]/100
   Reason: [Why]
🥉 3rd Best: [Name] — Score: [X]/100
   Reason: [Why]

❌ Avoid: [Crop1] — [Reason]
❌ Avoid: [Crop2] — [Reason]

Keep response under 250 words. Be practical.`;

  try {
    logger.ai('Calling Gemini for crop recommendation...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return {
      season: seasonLabel,
      location: location || 'India',
      soilSummary: { n: soilData.nitrogen, p: soilData.phosphorus, k: soilData.potassium, ph: soilData.ph },
      recommendation: response.text
    };
  } catch (error) {
    logger.error(`Gemini crop recommendation error: ${error.message}`);
    return {
      season: seasonLabel,
      location: location || 'India',
      soilSummary: { n: soilData.nitrogen, p: soilData.phosphorus, k: soilData.potassium, ph: soilData.ph },
      recommendation: generateFallbackCrops(soilData, seasonLabel)
    };
  }
}

function generateFallbackCrops(soil, season) {
  let crops = [];
  const isBalanced = soil.nitrogen >= 200 && soil.phosphorus >= 15 && soil.potassium >= 150;

  if (isBalanced) {
    crops = ['Wheat (Gehun)', 'Rice (Chawal)', 'Maize (Makka)'];
  } else if (soil.nitrogen < 140) {
    crops = ['Moong (Green Gram)', 'Chana (Gram)', 'Masoor (Lentil)'];
  } else {
    crops = ['Bajra (Millet)', 'Jowar (Sorghum)', 'Arhar (Pigeon Pea)'];
  }

  return `## Crop Recommendations (${season})\n\n🥇 **${crops[0]}** — Score: 85/100\n🥈 **${crops[1]}** — Score: 75/100\n🥉 **${crops[2]}** — Score: 65/100\n\n_Note: Gemini API unavailable, using rule-based recommendations._`;
}
