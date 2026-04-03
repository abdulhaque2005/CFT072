import { masterAdvisor, recoveryAdvisor } from '../services/ai.service.js';
import { generateFarmingCalendar } from '../services/calendar.service.js';
import { successResponse } from '../utils/responseFormatter.js';

export async function getMasterAdvice(req, res, next) {
  try {
    const result = await masterAdvisor(req.body);
    return successResponse(res, result, 'Master advice generated');
  } catch (error) {
    next(error);
  }
}

export async function getRecoveryAdvice(req, res, next) {
  try {
    const { problem, soilData } = req.body;
    const result = await recoveryAdvisor(problem, soilData);
    return successResponse(res, result, 'Recovery advice generated');
  } catch (error) {
    next(error);
  }
}

export async function getCalendar(req, res, next) {
  try {
    const { crop, season, location } = req.body;
    const result = await generateFarmingCalendar(crop, season, location);
    return successResponse(res, result, 'Farming calendar generated');
  } catch (error) {
    next(error);
  }
}
