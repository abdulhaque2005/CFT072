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
      setSoilResult(result.data);
      toast.success('Mitti ka analysis ho gaya! 🌱');
      return result.data;
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
      setCropResult(result.data);
      toast.success('Best crops mil gaye! 🌾');
      return result.data;
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
      setFertilizerResult(result.data);
      toast.success('Fertilizer plan ready! 🧪');
      return result.data;
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { soilResult, cropResult, fertilizerResult, loading, error, analyze, getCrops, getFertilizer };
}
