export const SOIL_THRESHOLDS = {
  nitrogen: { low: 140, medium: 280, high: 400, unit: 'kg/ha' },
  phosphorus: { low: 10, medium: 25, high: 50, unit: 'kg/ha' },
  potassium: { low: 110, medium: 280, high: 400, unit: 'kg/ha' },
  organicCarbon: { low: 0.4, medium: 0.75, high: 1.0, unit: '%' }
};

export const PH_RANGES = {
  veryAcidic: { min: 0, max: 4.5, label: 'Very Acidic' },
  acidic: { min: 4.5, max: 6.0, label: 'Acidic' },
  slightlyAcidic: { min: 6.0, max: 6.5, label: 'Slightly Acidic' },
  neutral: { min: 6.5, max: 7.5, label: 'Neutral' },
  slightlyAlkaline: { min: 7.5, max: 8.0, label: 'Slightly Alkaline' },
  alkaline: { min: 8.0, max: 9.0, label: 'Alkaline' },
  veryAlkaline: { min: 9.0, max: 14, label: 'Very Alkaline' }
};

export const SEASONS = {
  kharif: { months: [6, 7, 8, 9, 10], label: 'Kharif (Monsoon)', crops: ['Rice', 'Maize', 'Soybean', 'Cotton', 'Groundnut', 'Bajra', 'Jowar'] },
  rabi: { months: [10, 11, 12, 1, 2, 3], label: 'Rabi (Winter)', crops: ['Wheat', 'Gram', 'Mustard', 'Barley', 'Peas', 'Lentil'] },
  zaid: { months: [3, 4, 5, 6], label: 'Zaid (Summer)', crops: ['Moong', 'Watermelon', 'Cucumber', 'Sunflower', 'Muskmelon'] }
};

export const FERTILIZER_MAP = {
  nitrogen: { name: 'Urea', content: '46% N', defaultDose: '25-30 kg/acre' },
  phosphorus: { name: 'DAP', content: '46% P₂O₅, 18% N', defaultDose: '25 kg/acre' },
  potassium: { name: 'MOP (Muriate of Potash)', content: '60% K₂O', defaultDose: '15-20 kg/acre' },
  zinc: { name: 'Zinc Sulphate', content: '33% Zn', defaultDose: '5 kg/acre' },
  sulphur: { name: 'Gypsum', content: '18% S', defaultDose: '20 kg/acre' }
};

export const GOVERNMENT_SCHEMES = [
  { name: 'PM-Kisan Samman Nidhi', benefit: '₹6000/year', eligibility: 'Small & marginal farmers', url: 'https://pmkisan.gov.in' },
  { name: 'Soil Health Card Scheme', benefit: 'Free soil testing', eligibility: 'All farmers', url: 'https://soilhealth.dac.gov.in' },
  { name: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Crop insurance', eligibility: 'All farmers', url: 'https://pmfby.gov.in' },
  { name: 'Kisan Credit Card', benefit: 'Low-interest loan', eligibility: 'All farmers', url: 'https://www.nabard.org' },
  { name: 'PM Krishi Sinchai Yojana', benefit: 'Irrigation support', eligibility: 'Farmers with irrigation needs', url: 'https://pmksy.gov.in' },
  { name: 'e-NAM', benefit: 'Online mandi trading', eligibility: 'All farmers', url: 'https://enam.gov.in' },
  { name: 'Paramparagat Krishi Vikas Yojana', benefit: 'Organic farming support ₹50,000/ha', eligibility: 'Organic farmers', url: 'https://pgsindia-ncof.gov.in' }
];

export const API_ENDPOINTS = {
  weather: 'https://api.openweathermap.org/data/2.5',
  weatherForecast: 'https://api.openweathermap.org/data/2.5/forecast'
};
