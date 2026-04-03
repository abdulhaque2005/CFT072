import { useState } from 'react';
import { LifeBuoy, AlertTriangle, CloudRain, Bug, Sun, Sprout, ArrowRight, XCircle } from 'lucide-react';
import api from '../services/api';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';

const PROBLEMS = [
  { id: 'rain', icon: <CloudRain className="w-8 h-8" />, label: 'Unseasonal Rain', desc: 'Sthiti: Baarish se fasal kharab ho gayi' },
  { id: 'pest', icon: <Bug className="w-8 h-8" />, label: 'Pest Attack', desc: 'Sthiti: Keedo/bimaari ne hamla kiya' },
  { id: 'drought', icon: <Sun className="w-8 h-8" />, label: 'Drought / Less Water', desc: 'Sthiti: Paani ki kami aur sukhad' },
  { id: 'other', icon: <XCircle className="w-8 h-8" />, label: 'Other Crop Damage', desc: 'Sthiti: Kisi annya kaaran se nuksan' }
];

export default function LossRecovery() {
  const { city } = useLocation();
  const [selectedProblem, setSelectedProblem] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success
  const [report, setReport] = useState(null);

  const handleAnalyze = async () => {
    if (!selectedProblem) return;
    try {
      setStatus('loading');
      const saved = localStorage.getItem('agrisaar_soil');
      const soilData = saved ? JSON.parse(saved) : null;
      
      const probLabel = PROBLEMS.find(p => p.id === selectedProblem)?.label || selectedProblem;
      
      const { data } = await api.post('/ai/recovery', { problem: probLabel, soilData });
      setReport(data.recovery || data.data?.recovery); // Handle payload wrapper
      setStatus('success');
    } catch (error) {
      console.error(error);
      setReport('## Recovery Plan\\n\\n🌿 Try short duration crops like Green Gram (60 days).\\n📋 Consider filing a claim under PM Fasal Bima Yojana.\\n_AI analysis temporarily unavailable._');
      setStatus('success');
    }
  };

  return (
    <div className="min-h-screen bg-green-50/50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4 shadow-sm border border-red-200">
            <LifeBuoy className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Crop Loss Recovery Wizard</h1>
          <p className="text-gray-600 font-medium">Nuksaan ki bharpai ke liye AI se emergency crops aur steps pata karein ({city})</p>
        </div>

        {status === 'idle' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Kya samasya hui hai?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {PROBLEMS.map((prob) => (
                <button
                  key={prob.id}
                  onClick={() => setSelectedProblem(prob.id)}
                  className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all text-left
                    ${selectedProblem === prob.id 
                      ? 'border-green-600 bg-green-50 shadow-md transform -translate-y-1' 
                      : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'}`}
                >
                  <div className={`p-3 rounded-xl ${selectedProblem === prob.id ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {prob.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold ${selectedProblem === prob.id ? 'text-green-900' : 'text-gray-800'}`}>{prob.label}</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">{prob.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!selectedProblem}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-lg transition-all ${selectedProblem ? 'bg-green-600 text-white shadow-xl hover:bg-green-700 hover:-translate-y-1' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              Emergency Solution Dekhein <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {status === 'loading' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <Loading text="AI is analyzing damage and finding the fastest cash crops to recover your loss..." />
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-3xl shadow-sm border border-green-200 p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <Sprout className="w-8 h-8 text-green-700" />
                <h2 className="text-2xl font-black text-green-900">AI Recovery Plan</h2>
              </div>
              <div className="prose prose-green max-w-none text-gray-800 font-medium whitespace-pre-wrap">
                {report}
              </div>
            </div>
            
            <div className="text-center">
              <button 
                onClick={() => { setStatus('idle'); setSelectedProblem(''); setReport(null); }}
                className="bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 px-6 py-3 rounded-xl font-bold transition-all"
              >
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
