import api from './api';

export const getWeatherAdvisory = (location) => api.get(`/weather/${encodeURIComponent(location)}`);
