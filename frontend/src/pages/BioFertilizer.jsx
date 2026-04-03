import { useState } from 'react';
import { Droplet, Leaf, Sprout, Search, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';

const COMMON_INPUTS = [
  { name: 'Jeevamrut', desc: 'Cow dung + Urine based liquid fertilizer', icon: '🐄', target: 'Wheat, Rice, Veggies' },
  { name: 'Neemastra', desc: 'Neem-based natural pest control', icon: '🌿', target: 'Cotton, Tomatoes' },
  { name: 'Vermicompost', desc: 'Earthworm compost for rich soil', icon: '🪱', target: 'Potatoes, Orchards' },
];

export default function BioFertilizer() {
  const [crop, setCrop] = useState('');
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!crop) return;
    try {
      setStatus('loading');
      const res = await api.post('/ai/bio-inputs', { crop });
      const payload = res.data?.data || res.data;
      setData(payload.intelligence);
      setStatus('success');
    } catch {
      setData('🌿 Bio-Input: Jeevamrut (Cow dung + Urine + Jaggery).\\n✅ Benefits: Low cost, soil health, better yield.\\n🧪 Action: Apply every 15 days near roots.');
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8faf8] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4 shadow-sm border border-green-200">
            <Droplet className="w-8 h-8 text-green-700" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Bio-Fertilizer Intelligence</h1>
          <p className="text-gray-600 font-medium">Chemical free farming — banayein apni khad, bachayein paise.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" /> Popular Bio-Inputs
              </h2>
              <div className="space-y-4">
                {COMMON_INPUTS.map((input, i) => (
                  <div key={i} className="flex gap-3 items-start border-b border-gray-50 pb-3 last:border-0">
                    <div className="text-2xl mt-1">{input.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-800">{input.name}</h3>
                      <p className="text-xs text-gray-500 font-medium leading-tight">{input.desc}</p>
                      <p className="text-[10px] text-green-700 font-bold mt-1 bg-green-50 inline-block px-2 py-0.5 rounded">Best for: {input.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-800 to-green-950 rounded-3xl p-6 text-white text-center shadow-lg">
              <h3 className="font-black text-lg mb-2">Save up to ₹8000/Acre</h3>
              <p className="text-green-100 text-sm font-medium mb-4">Chemical fertilizer ka kharcha bacha ke profits badhaayein.</p>
              <div className="text-2xl">💰</div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10 h-full">
              <h2 className="text-2xl font-black text-gray-900 mb-2">Apni Fasal Ka Recipe Paayein</h2>
              <p className="text-gray-500 font-medium mb-8">Apni fasal ka naam likhein aur AI aapko exact bio-fertilizer recipe dega.</p>
              
              <form onSubmit={handleSearch} className="flex gap-3 mb-8">
                <div className="flex-1 relative">
                  <Sprout className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    placeholder="E.g., Wheat, Tomato, Cotton"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
                  />
                </div>
                <button type="submit" disabled={!crop || status === 'loading'} className="bg-green-600 hover:bg-green-700 text-white px-8 rounded-2xl font-bold shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                  {status === 'loading' ? 'Searching...' : 'AI Guide'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {status === 'loading' && <Loading text="Fetching organic intelligence..." />}
              
              {status === 'success' && data && (
                <div className="bg-green-50 rounded-2xl border border-green-200 p-6 animate-fade-in text-gray-800 font-medium whitespace-pre-wrap leading-relaxed">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-green-200">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                    <span className="font-extrabold text-green-900 text-lg">AI Formula for {crop}</span>
                  </div>
                  {data}
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
