import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { GOVERNMENT_SCHEMES } from '../utils/constants.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function findSchemes(location, crop, farmerType) {
  const schemesList = GOVERNMENT_SCHEMES.map(s => `- ${s.name}: ${s.benefit} (${s.eligibility})`).join('\n');

  const prompt = `You are a government scheme advisor for Indian farmers. Give advice in Hinglish.

FARMER DETAILS:
- Location: ${location}
- Crop: ${crop || 'General'}
- Farmer Type: ${farmerType || 'Small farmer'}

AVAILABLE SCHEMES:
${schemesList}

TASK:
1. Check which schemes the farmer is eligible for
2. Explain each scheme's benefit in simple words
3. Give step-by-step apply instructions
4. Mention any documents needed

OUTPUT FORMAT for each scheme:
📋 **[Scheme Name]**
💰 Benefit: [What farmer gets]
✅ Eligibility: [Who can apply]
📝 How to Apply:
   Step 1: ...
   Step 2: ...
🔗 Website: [URL]

Suggest top 3-4 most relevant schemes.
Keep response under 350 words.`;

  try {
    logger.ai('Calling Gemini for scheme recommendation...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return {
      location,
      crop: crop || 'General',
      availableSchemes: GOVERNMENT_SCHEMES,
      recommendation: response.text
    };
  } catch (error) {
    logger.error(`Gemini scheme error: ${error.message}`);
    let fallback = `## Government Schemes for You\n\n`;
    GOVERNMENT_SCHEMES.slice(0, 4).forEach(s => {
      fallback += `📋 **${s.name}**\n💰 ${s.benefit}\n✅ ${s.eligibility}\n🔗 ${s.url}\n\n`;
    });
    return { location, crop: crop || 'General', availableSchemes: GOVERNMENT_SCHEMES, recommendation: fallback };
  }
}
