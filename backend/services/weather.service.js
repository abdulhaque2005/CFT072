import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { API_ENDPOINTS } from '../utils/constants.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function fetchWeatherData(lat, lon) {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey || apiKey === 'your_openweather_api_key_here') {
    return { current: null, forecast: null };
  }

  let current = null;
  let forecast = null;

  try {
    const url = `${API_ENDPOINTS.weather}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=hi`;
    const res = await fetch(url);
    if (res.ok) current = await res.json();
  } catch (err) {
    logger.warn(`Weather current API error: ${err.message}`);
  }

  try {
    const url = `${API_ENDPOINTS.weatherForecast}?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&cnt=40&lang=hi`;
    const res = await fetch(url);
    if (res.ok) forecast = await res.json();
  } catch (err) {
    logger.warn(`Weather forecast API error: ${err.message}`);
  }

  return { current, forecast };
}

function getWeatherIcon(iconCode) {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

function buildForecastDays(forecastData) {
  if (!forecastData?.list) return [];
  
  const dailyMap = {};
  forecastData.list.forEach(item => {
    const date = item.dt_txt.split(' ')[0];
    if (!dailyMap[date]) {
      dailyMap[date] = {
        date,
        temps: [],
        descriptions: [],
        icons: [],
        humidity: [],
        wind: []
      };
    }
    dailyMap[date].temps.push(item.main.temp);
    dailyMap[date].descriptions.push(item.weather[0].description);
    dailyMap[date].icons.push(item.weather[0].icon);
    dailyMap[date].humidity.push(item.main.humidity);
    dailyMap[date].wind.push(item.wind.speed);
  });

  return Object.values(dailyMap).slice(0, 5).map(day => {
    const midIndex = Math.floor(day.icons.length / 2);
    return {
      date: day.date,
      dayName: new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short' }),
      tempMax: Math.round(Math.max(...day.temps)),
      tempMin: Math.round(Math.min(...day.temps)),
      description: day.descriptions[midIndex] || day.descriptions[0],
      icon: getWeatherIcon(day.icons[midIndex] || day.icons[0]),
      humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      wind: Math.round(day.wind.reduce((a, b) => a + b, 0) / day.wind.length * 10) / 10
    };
  });
}

export async function getWeatherAdvisory(location) {
  let weatherData = null;
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (apiKey && apiKey !== 'your_openweather_api_key_here') {
      const url = `${API_ENDPOINTS.weather}/weather?q=${encodeURIComponent(location)},IN&appid=${apiKey}&units=metric&lang=hi`;
      const res = await fetch(url);
      if (res.ok) weatherData = await res.json();
    }
  } catch (err) {
    logger.warn(`Weather API error: ${err.message}`);
  }

  const weatherSummary = weatherData
    ? `Temperature: ${weatherData.main.temp}°C, Humidity: ${weatherData.main.humidity}%, Weather: ${weatherData.weather[0].description}, Wind: ${weatherData.wind.speed} m/s`
    : 'Weather data unavailable — using general advisory';

  const prompt = `You are a weather-based farming advisor for Indian farmers. Give advice in Hinglish.

LOCATION: ${location}
CURRENT WEATHER: ${weatherSummary}

TASK:
1. Analyze current weather for farming impact
2. Give 3-4 specific farming actions for TODAY
3. Warn about any weather risks for crops
4. Suggest irrigation timing based on weather

Keep response under 200 words. Simple, practical, Hinglish.`;

  try {
    logger.ai('Calling Gemini for weather advisory...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });
    return {
      location,
      current: weatherData ? {
        temp: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        description: weatherData.weather[0].description,
        icon: getWeatherIcon(weatherData.weather[0].icon),
        wind: weatherData.wind.speed,
        feelsLike: weatherData.main.feels_like,
        pressure: weatherData.main.pressure
      } : null,
      forecast: [],
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

export async function getWeatherByCoords(lat, lon, locationName) {
  const { current, forecast } = await fetchWeatherData(lat, lon);
  const forecastDays = buildForecastDays(forecast);
  const loc = locationName || `${lat},${lon}`;

  const weatherSummary = current
    ? `Temperature: ${current.main.temp}°C, Feels Like: ${current.main.feels_like}°C, Humidity: ${current.main.humidity}%, Weather: ${current.weather[0].description}, Wind: ${current.wind.speed} m/s, Pressure: ${current.main.pressure} hPa`
    : 'Weather data unavailable — generate general seasonal advice';

  const forecastSummary = forecastDays.length > 0
    ? forecastDays.map(d => `${d.dayName}: ${d.tempMin}-${d.tempMax}°C, ${d.description}`).join('\n')
    : 'Forecast not available';

  const currentMonth = new Date().toLocaleString('en-IN', { month: 'long' });

  const prompt = `You are a weather-based farming advisor for Indian farmers. Give advice in Hinglish.

LOCATION: ${loc}
MONTH: ${currentMonth}
CURRENT WEATHER: ${weatherSummary}
5-DAY FORECAST:
${forecastSummary}

TASK:
1. Aaj ke mausam ka farming pe kya asar hoga — 2-3 lines
2. Agle 5 din mein kya dhyan rakhna hai — specific actions
3. Irrigation schedule suggest karo based on forecast
4. Agar baarish ya heatwave expected hai toh warn karo
5. Iss mahine mein kaun si crops ka dhyan rakhna zaroori hai

OUTPUT STYLE: Simple, practical, warm Hinglish. Use emojis sparingly.
Keep response under 300 words.`;

  try {
    logger.ai('Calling Gemini for coordinate-based weather advisory...');
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt
    });

    return {
      location: loc,
      current: current ? {
        temp: Math.round(current.main.temp),
        feelsLike: Math.round(current.main.feels_like),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        icon: getWeatherIcon(current.weather[0].icon),
        wind: Math.round(current.wind.speed * 3.6),
        pressure: current.main.pressure,
        visibility: current.visibility ? Math.round(current.visibility / 1000) : null,
        sunrise: current.sys?.sunrise,
        sunset: current.sys?.sunset
      } : null,
      forecast: forecastDays,
      advisory: response.text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error(`Gemini coords weather error: ${error.message}`);
    return {
      location: loc,
      current: current ? {
        temp: Math.round(current.main.temp),
        humidity: current.main.humidity,
        description: current.weather[0].description,
        icon: getWeatherIcon(current.weather[0].icon),
        wind: Math.round(current.wind.speed * 3.6)
      } : null,
      forecast: forecastDays,
      advisory: `## ${loc} ke liye Mausam Advisory\n\n🌤️ Mausam normal hai. Regular farming continue karein.\n💧 Subah 6-8 baje irrigation best hai.\n📱 Daily mausam check karte rahein.\n\n_AI advisory temporarily unavailable._`,
      timestamp: new Date().toISOString()
    };
  }
}
