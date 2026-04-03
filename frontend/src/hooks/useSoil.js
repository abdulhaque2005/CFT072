import { useState } from 'react';
import { analyzeSoil } from '../services/soilApi';
import { getCropRecommendation } from '../services/cropApi';
import { getFertilizerPlan } from '../services/fertilizerApi';
import toast from 'react-hot-toast';

export function useSoil() {
  const [soilResult, setSoilResult] = useState(null);
  const [cropResult, setCropResult] = useState(null);
  const [fertilizerResult, setFertilizerResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyze = async (soilData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await analyzeSoil(soilData);
      // interceptor strips response.data → result = { success, data, message }
      const payload = result.data || result;
      setSoilResult(payload);
      toast.success('Mitti ka analysis ho gaya!');
      return payload;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getCrops = async (soilData) => {
    setLoading(true);
    try {
      const result = await getCropRecommendation(soilData);
      const payload = result.data || result;
      setCropResult(payload);
      toast.success('Best crops mil gaye!');
      return payload;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFertilizer = async (soilData) => {
    setLoading(true);
    try {
      const result = await getFertilizerPlan(soilData);
      const payload = result.data || result;
      setFertilizerResult(payload);
      toast.success('Fertilizer plan ready!');
      return payload;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { soilResult, cropResult, fertilizerResult, loading, error, analyze, getCrops, getFertilizer };
}
