import { useState, useEffect } from 'react';
import { Sprout, CalendarClock, Beaker, Ban } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import { getFertilizerPlan } from '../services/fertilizerApi';
// ... existing imports ...

export default function FertilizerPlan() {
  const { setAnalysis } = useAgri();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : {
        nitrogen: 200, phosphorus: 25, potassium: 180, ph: 6.5, organicCarbon: 0.6
      };
      const res = await getFertilizerPlan({
        nitrogen: Number(soilData.nitrogen),
        phosphorus: Number(soilData.phosphorus),
        potassium: Number(soilData.potassium),
        ph: Number(soilData.ph),
        organicCarbon: Number(soilData.organicCarbon) || 0.5,
        crop: soilData.crop || 'Wheat'
      });
      // interceptor strips response.data → res = { success, data, message }
      const result = res.data || res;
      setData(result);
      setAnalysis({ fertilizer: result });
    } catch (err) {
      console.error('Fertilizer load error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading text="Creating fertilizer plan..." />;
  if (error) return <Error message={error} onRetry={loadPlan} />;
  if (!data) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10 text-center">
        <h1 className="section-title flex items-center justify-center gap-3">
          <Sprout className="w-8 h-8 text-primary-700" /> Fertilizer Plan
        </h1>
        <p className="text-gray-500 mt-2 font-medium">Kitna, kab, aur kaunsa fertilizer daalna hai</p>
      </div>

      <div className="mb-12">
        <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-primary-600" /> Requirements Checklist
        </h2>
        <FertilizerTable quickReference={data.requirements} />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-primary-600" /> Schedule (Kab daalna hai)
          </h2>
          <div className="space-y-6">
            {data.schedule?.map((stage, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative pl-8">
                <div className="absolute left-0 top-6 bottom-0 w-1 bg-primary-100 rounded-r-full"></div>
                <div className="absolute left-[-5px] top-6 w-3 h-3 bg-primary-500 rounded-full border-2 border-white"></div>
                
                <h3 className="font-bold text-lg text-primary-900 mb-2">{stage.stage} ( {stage.timing} )</h3>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  {stage.actions?.map((act, j) => (
                    <div key={j} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <span className="text-xs font-black uppercase text-gray-400 block mb-1">Dose</span>
                      <strong className="text-gray-900">{act}</strong>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
            <Ban className="w-6 h-6 text-red-500" /> Zaroori Warnings
          </h2>
          <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
            <ul className="space-y-4">
              {data.warnings?.map((w, i) => (
                <li key={i} className="flex gap-3 text-red-800 text-sm font-medium leading-relaxed">
                  <span className="flex-shrink-0 mt-0.5"><Ban className="w-4 h-4" /></span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
