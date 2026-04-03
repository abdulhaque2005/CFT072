import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { FERTILIZER_MAP } from '../utils/constants.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getFertilizerPlan(soilData, crop) {
  const prompt = `You are a fertilizer expert for Indian farming. Give advice in simple Hindi + English mix.

SOIL DATA:
- Nitrogen: ${soilData.nitrogen} kg/ha
- Phosphorus: ${soilData.phosphorus} kg/ha
- Potassium: ${soilData.potassium} kg/ha
- pH: ${soilData.ph}
- Organic Carbon: ${soilData.organicCarbon || 'N/A'}%

CROP: ${crop}

FERTILIZER RULES:
- Low N (<140 kg/ha) → Urea (46% N) — 25-30 kg per acre
- Low P (<10 kg/ha) → DAP (46% P₂O₅) — 25 kg per acre
- Low K (<110 kg/ha) → MOP/Potash (60% K₂O) — 15-20 kg per acre
- Low Zinc → Zinc Sulphate — 5 kg per acre
- Acidic soil → Add lime
- Alkaline soil → Add gypsum

IMPORTANT SAFETY RULES:
- Zyada fertilizer mat daalein — soil damage hota hai
- Split doses mein daalein (2-3 parts)
- Baarish se pehle fertilizer mat do — wash ho jayega
- Organic manure bhi mix karein

TASK:
1. Identify which nutrients are deficient
2. Suggest specific fertilizer for each deficiency
3. Give exact quantity per acre
4. Give timing (when to apply — basal, 25 DAS, 45 DAS etc.)
5. Warn about overuse

OUTPUT FORMAT in a table-like structure:
| Fertilizer | Quantity/Acre | Timing | Purpose |
Then give 2-3 important warnings.

Keep response under 300 words.`;

  try {
    logger.ai('Calling Gemini for fertilizer plan...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt
    });
    return {
      crop,
      soilSummary: { n: soilData.nitrogen, p: soilData.phosphorus, k: soilData.potassium, ph: soilData.ph },
      plan: response.text,
      quickReference: buildQuickReference(soilData)
    };
  } catch (error) {
    logger.error(`Gemini fertilizer error: ${error.message}`);
    return {
      crop,
      soilSummary: { n: soilData.nitrogen, p: soilData.phosphorus, k: soilData.potassium, ph: soilData.ph },
      plan: generateFallbackPlan(soilData, crop),
      quickReference: buildQuickReference(soilData)
    };
  }
}

function buildQuickReference(soil) {
  const ref = [];
  if (soil.nitrogen < 140) ref.push({ nutrient: 'Nitrogen', status: 'Low', fertilizer: FERTILIZER_MAP.nitrogen.name, dose: FERTILIZER_MAP.nitrogen.defaultDose });
  if (soil.phosphorus < 10) ref.push({ nutrient: 'Phosphorus', status: 'Low', fertilizer: FERTILIZER_MAP.phosphorus.name, dose: FERTILIZER_MAP.phosphorus.defaultDose });
  if (soil.potassium < 110) ref.push({ nutrient: 'Potassium', status: 'Low', fertilizer: FERTILIZER_MAP.potassium.name, dose: FERTILIZER_MAP.potassium.defaultDose });
  return ref;
}

function generateFallbackPlan(soil, crop) {
  let plan = `## Fertilizer Plan for ${crop}\n\n`;
  if (soil.nitrogen < 140) plan += `🧪 **Urea**: 25 kg/acre — 2 split doses mein daalein (sowing + 25 din baad)\n`;
  if (soil.phosphorus < 10) plan += `🧪 **DAP**: 25 kg/acre — sowing ke time daalein (basal dose)\n`;
  if (soil.potassium < 110) plan += `🧪 **MOP**: 15 kg/acre — sowing ke time daalein\n`;
  plan += `\n⚠️ **Warning:** Zyada urea mat daalein — soil ki health kharab hogi.\n`;
  plan += `⚠️ **Tip:** Organic khad (FYM) bhi zaroor use karein — 2 ton/acre`;
  return plan;
}
