import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { API_ENDPOINTS } from '../utils/constants.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getWeatherAdvisory(location) {
  let weatherData = null;

  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey && apiKey !== 'your_openweather_api_key_here') {
      const url = `${API_ENDPOINTS.weather}/weather?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric&lang=hi`;
      const res = await fetch(url);
      if (res.ok) {
        weatherData = await res.json();
      }
    }
  } catch (err) {
    logger.warn(`Weather API error: ${err.message}`);
  }

  let forecastData = null;
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey && apiKey !== 'your_openweather_api_key_here') {
      const url = `${API_ENDPOINTS.weatherForecast}?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric&cnt=16`;
      const res = await fetch(url);
      if (res.ok) {
        forecastData = await res.json();
      }
    }
  } catch (err) {
    logger.warn(`Forecast API error: ${err.message}`);
  }

  const weatherSummary = weatherData
    ? `Temperature: ${weatherData.main.temp}°C, Humidity: ${weatherData.main.humidity}%, Weather: ${weatherData.weather[0].description}, Wind: ${weatherData.wind.speed} m/s`
    : 'Weather data unavailable — using general advisory';

  const prompt = `You are a weather-based farming advisor for Indian farmers. Give advice in Hinglish.

LOCATION: ${location}
CURRENT WEATHER: ${weatherSummary}
${forecastData ? `FORECAST: Next 2 days forecast available` : 'FORECAST: Not available'}

WEATHER FARMING RULES:
- Rain expected → delay fertilizer application, wash ho jayega
- Heavy rain → check drainage, waterlogging se bachein
- Heat wave (>40°C) → irrigation zaroor karein, mulching karein
- Cold wave (<5°C) → frost protection, crops cover karein
- Storm/strong wind → crop support karein, staking lagao
- High humidity → fungal disease ka risk, spray karein

TASK:
1. Analyze current weather for farming impact
2. Give 3-4 specific farming actions for TODAY
3. Warn about any weather risks for crops
4. Suggest irrigation timing based on weather

OUTPUT STYLE: Simple, practical, Hinglish.
Example: "Kal baarish aane wali hai, fertilizer aaj mat daalein. 2 din wait karein."

Keep response under 200 words.`;

  try {
    logger.ai('Calling Gemini for weather advisory...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });
    return {
      location,
      current: weatherData ? {
        temp: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
        wind: weatherData.wind.speed
      } : null,
      forecast: forecastData ? forecastData.list.slice(0, 8).map(f => ({
        time: f.dt_txt,
        temp: f.main.temp,
        description: f.weather[0].description,
        icon: f.weather[0].icon
      })) : [],
      advisory: response.text
    };
  } catch (error) {
    logger.error(`Gemini weather error: ${error.message}`);
    return {
      location,
      current: weatherData ? { temp: weatherData.main.temp, humidity: weatherData.main.humidity, description: weatherData.weather[0].description } : null,
      forecast: [],
      advisory: `## Weather Advisory for ${location}\n\n🌤️ Regular monitoring karein.\n💧 Subah jaldi irrigation karein.\n⚠️ Weather app check karte rahein daily.\n\n_Note: AI advisory unavailable._`
    };
  }
}
