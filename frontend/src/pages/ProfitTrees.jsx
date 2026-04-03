import { useState, useEffect } from 'react';
import { Trees, TrendingUp, Sun, Droplets, MapPin } from 'lucide-react';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';

export default function ProfitTrees() {
  const { locationText, loading: locLoading } = useLocation();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!locLoading) loadData();
  }, [locLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.post('/ai/agroforestry', { location: locationText });
      const payload = res.data?.data || res.data;
      setData(payload.advice);
    } catch {
      setData('🌲 Top Tree: Teak (Sagwan)\\n💰 Estimated Return: ₹1.5 Cr after 10 years per acre.\\n💧 Maintenance: Minimal after 2 years.\\n\\n🌲 Top Tree: Bamboo\\n💰 Return: Steady income after 3 years.\\n\\n_AI analysis temporarily unavailable._');
    } finally {
      setLoading(false);
    }
  };

  if (loading || locLoading) return <Loading text="Analyzing your geography for high-profit timber and fruit trees..." />;

  return (
    <div className="min-h-screen bg-green-50/30 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-3xl p-8 mb-10 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
            <Trees className="w-64 h-64" />
          </div>
          <div className="relative z-10">
            <span className="bg-green-500/30 text-green-100 font-bold px-3 py-1 text-xs rounded-full uppercase tracking-widest border border-green-400/30 mb-4 inline-flex items-center gap-2">
              <MapPin className="w-3 h-3" /> {locationText || 'India'}
            </span>
            <h1 className="text-3xl md:text-5xl font-black mb-3 leading-tight">High-Profit<br/>Agroforestry</h1>
            <p className="text-green-100/90 text-lg max-w-xl font-medium">Lambe samay ka investment. Pedh lagayein, aur khet ko apna retirement fund banayein.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
              <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-green-600" /> AI Recommendations
              </h2>
              <div className="prose prose-green max-w-none text-gray-700 font-medium whitespace-pre-wrap leading-relaxed">
                {data}
              </div>
            </div>
          </div>

          {/* Quick Calculator Panel */}
          <div className="space-y-6">
            <div className="bg-green-50 rounded-3xl p-6 border border-green-200">
              <h3 className="font-bold text-green-900 mb-2">Why Agroforestry?</h3>
              <ul className="text-sm text-green-800 space-y-3 font-medium">
                <li className="flex gap-2 items-start"><Sun className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" /> Additional income from border planting</li>
                <li className="flex gap-2 items-start"><Droplets className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" /> Improves groundwater level</li>
                <li className="flex gap-2 items-start"><Trees className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> Zero soil erosion</li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm text-center">
              <div className="text-3xl mb-2">🪵</div>
              <h3 className="font-bold text-gray-900 mb-1">Teak (Sagwan)</h3>
              <p className="text-xs text-gray-500 mb-4">Maturity: 10-15 Years</p>
              <div className="bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
                <p className="text-[10px] uppercase font-bold text-gray-400">Est. Value Per Tree</p>
                <p className="text-xl font-black text-green-700">₹30,000 - ₹50,000</p>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
