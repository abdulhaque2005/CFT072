import { useState, useEffect } from 'react';
import { Wheat, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { getCrops } from '../services/cropApi';
<<<<<<< HEAD
import CropCard from '../components/CropCard';
import Loading from '../components/Loading';
import Error from '../components/Error';

=======
import Loading from '../components/Loading';
import Error from '../components/Error';
import CropCard from '../components/CropCard';
>>>>>>> 8efd5e29595e15ef40d7809388cbd5ffb896a352
export default function CropRecommendations() {
  const { setAnalysis } = useAgri();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      setLoading(true);
      setError('');
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : {
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5, organicCarbon: 0.6
      };
      const res = await getCrops({
        nitrogen: Number(soilData.nitrogen),
        phosphorus: Number(soilData.phosphorus),
        potassium: Number(soilData.potassium),
        ph: Number(soilData.ph),
        organicCarbon: Number(soilData.organicCarbon) || 0.5,
        location: soilData.location || 'India'
      });
      // interceptor strips response.data → res = { success, data, message }
      const result = res.data || res;
      setData(result);
      setAnalysis({ crops: result });
    } catch (err) {
      console.error('Crop load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Finding the best crops..." />;
  if (error) return <Error message={error} onRetry={loadCrops} />;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="section-title flex items-center justify-center gap-3">
          <Wheat className="w-8 h-8 text-primary-700" /> Crop Recommendations
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Best crops recommended based on your soil and weather conditions</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary-600" /> Highly Recommended
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {data.topCrops?.map((crop, i) => (
              <CropCard key={i} rank={i + 1} name={crop.name} score={crop.score} reason={crop.reason} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-gray-600" /> Rotation Crops
          </h2>
          <div className="space-y-4">
            {data.rotationCrops?.map((crop, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-primary-200 transition-colors">
                <h4 className="font-bold text-gray-900 mb-1">{crop.name}</h4>
                <p className="text-xs text-gray-500 font-medium">{crop.benefit}</p>
              </div>
            ))}
          </div>

          {data.marketTrends && (
            <div className="mt-8 bg-gradient-to-br from-green-50 to-primary-100 p-6 rounded-2xl border border-green-200 shadow-sm">
              <h3 className="font-extrabold text-primary-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" /> Market Prediction
              </h3>
              <p className="text-sm text-green-800 font-medium leading-relaxed">{data.marketTrends}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
