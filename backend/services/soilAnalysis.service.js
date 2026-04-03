import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { SOIL_THRESHOLDS, PH_RANGES } from '../utils/constants.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

function classifySoil(ph) {
  for (const [key, range] of Object.entries(PH_RANGES)) {
    if (ph >= range.min && ph < range.max) return range.label;
  }
  return 'Unknown';
}

function getNutrientLevel(value, thresholds) {
  if (value <= thresholds.low) return 'Low';
  if (value <= thresholds.medium) return 'Medium';
  return 'High';
}

function calculateSoilScore(soilData) {
  let score = 50;
  const nLevel = getNutrientLevel(soilData.nitrogen, SOIL_THRESHOLDS.nitrogen);
  const pLevel = getNutrientLevel(soilData.phosphorus, SOIL_THRESHOLDS.phosphorus);
  const kLevel = getNutrientLevel(soilData.potassium, SOIL_THRESHOLDS.potassium);

  if (nLevel === 'High') score += 15; else if (nLevel === 'Medium') score += 8; else score -= 10;
  if (pLevel === 'High') score += 15; else if (pLevel === 'Medium') score += 8; else score -= 10;
  if (kLevel === 'High') score += 10; else if (kLevel === 'Medium') score += 5; else score -= 8;

  if (soilData.ph >= 6.0 && soilData.ph <= 7.5) score += 10;
  else if (soilData.ph >= 5.5 && soilData.ph <= 8.0) score += 3;
  else score -= 10;

  if (soilData.organicCarbon) {
    const ocLevel = getNutrientLevel(soilData.organicCarbon, SOIL_THRESHOLDS.organicCarbon);
    if (ocLevel === 'High') score += 10; else if (ocLevel === 'Medium') score += 5; else score -= 5;
  }

  return Math.max(0, Math.min(100, score));
}

export async function analyzeSoil(soilData) {
  const soilType = classifySoil(soilData.ph);
  const healthScore = calculateSoilScore(soilData);
  const nLevel = getNutrientLevel(soilData.nitrogen, SOIL_THRESHOLDS.nitrogen);
  const pLevel = getNutrientLevel(soilData.phosphorus, SOIL_THRESHOLDS.phosphorus);
  const kLevel = getNutrientLevel(soilData.potassium, SOIL_THRESHOLDS.potassium);

  const prompt = `You are a soil expert. Analyze this soil data and give practical advice in simple Hindi + English mix (Hinglish).

SOIL DATA:
- Nitrogen (N): ${soilData.nitrogen} kg/ha → Level: ${nLevel}
- Phosphorus (P): ${soilData.phosphorus} kg/ha → Level: ${pLevel}
- Potassium (K): ${soilData.potassium} kg/ha → Level: ${kLevel}
- pH: ${soilData.ph} → Soil Type: ${soilType}
- Organic Carbon: ${soilData.organicCarbon || 'Not provided'}%
- Location: ${soilData.location || 'Not specified'}

ANALYSIS RULES:
- Low N → growth issue, fasal ki growth slow hogi
- Low P → root development weak, jadon mein problem
- Low K → plant strength kam, fasal kamzor hogi
- pH < 6 → acidic mitti
- pH > 7.5 → alkaline mitti
- pH 6-7.5 → balanced, acha hai

TASK:
1. Check if soil is healthy or not
2. Identify which nutrients are low/high
3. Classify the soil type
4. Give soil health score explanation (Score: ${healthScore}/100)
5. Give 2-3 practical suggestions to improve soil

OUTPUT STYLE: Simple, Hinglish, like talking to a farmer friend.
Example: "Aapki mitti thodi weak hai. Nitrogen kam hai, isliye fasal growth slow ho sakti hai."

Keep response under 300 words.`;

  let aiAnalysis = '';
  try {
    logger.ai('Calling Gemini for soil analysis...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    aiAnalysis = response.text;
    logger.ai('Soil analysis complete');
  } catch (error) {
    logger.error(`Gemini API error: ${error.message}`);
    aiAnalysis = generateFallbackAnalysis(soilData, soilType, healthScore, nLevel, pLevel, kLevel);
  }

  return {
    healthScore,
    soilType,
    nutrients: {
      nitrogen: { value: soilData.nitrogen, level: nLevel, unit: 'kg/ha' },
      phosphorus: { value: soilData.phosphorus, level: pLevel, unit: 'kg/ha' },
      potassium: { value: soilData.potassium, level: kLevel, unit: 'kg/ha' }
    },
    ph: { value: soilData.ph, classification: soilType },
    organicCarbon: soilData.organicCarbon || null,
    analysis: aiAnalysis
  };
}

function generateFallbackAnalysis(data, soilType, score, nLevel, pLevel, kLevel) {
  let msg = `## Mitti ki Report (Score: ${score}/100)\n\n`;
  msg += `Aapki mitti **${soilType}** category mein hai (pH: ${data.ph}).\n\n`;

  if (nLevel === 'Low') msg += `⚠️ **Nitrogen kam hai** — fasal ki growth slow ho sakti hai. Urea ya organic compost use karein.\n`;
  if (pLevel === 'Low') msg += `⚠️ **Phosphorus kam hai** — root development weak rahega. DAP fertilizer daalein.\n`;
  if (kLevel === 'Low') msg += `⚠️ **Potassium kam hai** — fasal ki strength kam hogi. Potash use karein.\n`;
  if (nLevel !== 'Low' && pLevel !== 'Low' && kLevel !== 'Low') msg += `✅ Sab nutrients balanced hain — acha hai!\n`;

  msg += `\n**Suggestion:** Har 6 mahine mitti ki testing karwate rahein.`;
  return msg;
}
