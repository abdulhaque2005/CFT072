import { getWeatherAdvisory } from '../services/weather.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getWeather(req, res, next) {
  try {
    const { location } = req.params;
    const result = await getWeatherAdvisory(location);
    return successResponse(res, result, 'Weather advisory generated');
  } catch (error) {
    next(error);
  }
}
