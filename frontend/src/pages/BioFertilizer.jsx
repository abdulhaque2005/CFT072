import { useState } from 'react';
import { Droplet, Leaf, Sprout, CheckCircle2, ArrowRight, ShieldCheck, Sparkles, TestTube } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';

const COMMON_INPUTS = [
  { name: 'Jeevamrut', desc: 'Cow dung & urine based super-culture', icon: '🐄', target: 'Wheat, Rice, Veggies', accent: 'from-amber-100 to-orange-100', text: 'text-orange-800' },
  { name: 'Neemastra', desc: 'Powerful natural pest deterrent', icon: '🌿', target: 'Cotton, Tomatoes', accent: 'from-emerald-100 to-teal-100', text: 'text-teal-800' },
  { name: 'Vermicompost', desc: 'Earthworm compost for rich soil', icon: '🪱', target: 'Potatoes, Orchards', accent: 'from-stone-100 to-amber-100', text: 'text-amber-900' },
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
      setData(null);
      const res = await api.post('/ai/bio-inputs', { crop });
      const payload = res.data || res;
      const intelligence = payload?.intelligence || payload?.crop?.intelligence || (typeof payload === 'string' ? payload : null);
      
      if (intelligence && !intelligence.includes('unavailable')) {
        setData(intelligence);
      } else {
        throw new Error('Got fallback response');
      }
      setStatus('success');
    } catch {
      try {
        const voiceRes = await api.post('/ai/voice', { 
          transcript: `[Reply in: English] Give me a detailed bio-fertilizer recipe and organic farming guide for ${crop} crop. Format cleanly. Include: 1) Specific recipe (Jeevamrut/Neemastra), 2) Benefits, 3) Application method.` 
        });
        const voicePayload = voiceRes.data || voiceRes;
        const advice = voicePayload?.advice || voicePayload;
        if (advice && typeof advice === 'string' && !advice.includes('samajh nahi paaya')) {
          setData(advice);
        } else {
          setData(getOfflineFallback(crop));
        }
      } catch {
        setData(getOfflineFallback(crop));
      }
      setStatus('success');
    }
  };

  const getOfflineFallback = (cropName) => {
    return `Bio-Input Recipe for ${cropName}:

Jeevamrut Formula:
• 10L Water + 1kg Cow Dung + 1L Cow Urine
• Add 50g Jaggery + Handful of soil from farm
• Mix well, ferment for 48 hours in shade
• Apply 200L per acre every 15 days

Benefits:
• 60-80% reduction in chemical fertilizer cost
• Improves soil microbiome & water retention
• Zero chemical residue — fully organic

Application Method:
• Dilute 1:10 with water
• Apply near root zone in evening
• Best results when soil is moist
• Start from seedling stage

Cost Saving: Rs 4,000-8,000 per acre per season`;
  };

  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      let formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-black text-green-950">$1</strong>')
        .replace(/^(#{1,3})\s+(.*)/, '<strong class="text-xl font-black text-green-800 my-2 block border-b border-green-100 pb-1">$2</strong>');
      
      if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
        return (
          <li key={i} className="flex items-start gap-2 mb-2 text-gray-700">
            <span className="text-green-500 mt-1 flex-shrink-0"><CheckCircle2 className="w-4 h-4" /></span>
            <span dangerouslySetInnerHTML={{ __html: formatted.replace(/^[•-]\s*/, '') }} />
          </li>
        );
      }
      
      return (
        <span key={i} className="block mb-2 text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#f4f7f4] relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-200 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-emerald-200 rounded-full blur-[100px] opacity-40 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-green-100 to-emerald-50 rounded-3xl mb-6 shadow-sm border border-green-200/50">
            <Leaf className="w-10 h-10 text-green-600 drop-shadow-sm" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            Bio-Fertilizer <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">Intelligence</span>
          </h1>
          <p className="text-gray-500 font-medium text-lg w-4/5 mx-auto">
            Shift to premium organic farming. Get expert, crop-specific AI recipes to grow chemical-free yields while saving massive costs.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Main Action Area */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white p-8 sm:p-12 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-green-50 to-transparent rounded-bl-[100%] pointer-events-none opacity-50 group-hover:scale-110 transition-transform duration-700" />
              
              <h2 className="text-2xl font-black text-gray-900 mb-2 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-yellow-500" /> Craft Your Recipe
              </h2>
              <p className="text-gray-500 font-medium mb-10 text-sm">
                Enter your exact crop below, and our advanced AI will instantly generate the optimal organic bio-fertilizer formula.
              </p>
              
              <form onSubmit={handleSearch} className="mb-4">
                <div className="relative group/input">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-300 to-emerald-300 rounded-[2rem] blur opacity-25 group-focus-within/input:opacity-75 transition duration-500" />
                  <div className="relative flex flex-col sm:flex-row gap-3 bg-white p-2 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex-1 relative flex items-center">
                      <Sprout className="w-6 h-6 text-green-500 absolute left-4" />
                      <input
                        type="text"
                        value={crop}
                        onChange={(e) => setCrop(e.target.value)}
                        placeholder="E.g., High-Yield Wheat, Cherry Tomato..."
                        className="w-full bg-transparent border-none py-4 pl-14 pr-4 text-gray-800 font-bold text-lg focus:ring-0 placeholder-gray-400 outline-none"
                      />
                    </div>
                    <button type="submit" disabled={!crop || status === 'loading'} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-10 py-4 sm:py-0 rounded-[1.5rem] font-black text-lg shadow-[0_4px_14px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:grayscale active:scale-95">
                      {status === 'loading' ? 'Brewing...' : 'Generate AI Plan'} 
                      {status !== 'loading' && <ArrowRight className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </form>

              {status === 'loading' && (
                <div className="mt-12 mb-4 flex justify-center">
                   <Loading text="AI is synthesizing optimal organic elements..." />
                </div>
              )}
            </div>

            {/* Results Area */}
            {status === 'success' && data && (
              <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-green-100 overflow-hidden animate-fade-in-up">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-8 py-6 border-b border-green-100/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-green-100 text-green-600">
                      <TestTube className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-green-950 text-xl leading-tight">Bio-Intelligence Report</h3>
                      <p className="text-green-700/80 text-xs font-bold uppercase tracking-wider">Optimized for: {crop}</p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center">
                    <SpeakButton text={data} label="Listen Audio" size="md" />
                  </div>
                </div>
                
                <div className="p-8 sm:p-10">
                  <ul className="text-sm">
                    {formatText(data)}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Impact Card */}
            <div className="relative bg-gradient-to-br from-gray-900 to-green-950 rounded-[2rem] p-8 text-white text-center shadow-[0_12px_40px_rgba(0,0,0,0.2)] overflow-hidden group">
              <div className="absolute top-0 right-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110">
                <ShieldCheck className="w-64 h-64" />
              </div>
              <div className="relative z-10">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 backdrop-blur-md border border-white/20">
                  <span className="text-3xl">💰</span>
                </div>
                <h3 className="font-black text-3xl mb-2 tracking-tight">Cut Costs.</h3>
                <p className="text-green-100/80 font-medium mb-6 leading-relaxed">
                  Switching to organic inputs lowers your costs by up to <strong className="text-white">₹8,000/Acre</strong>. Watch profits soar.
                </p>
              </div>
            </div>

            {/* Popular Bio Inputs Sidebar */}
            <div className="bg-white border text-left border-gray-100 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" /> Best Bio-Agri Inputs
              </h2>
              <div className="space-y-4">
                {COMMON_INPUTS.map((input, i) => (
                  <div key={i} className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${input.accent} flex items-center justify-center text-2xl shadow-sm border border-white`}>
                      {input.icon}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 leading-tight">{input.name}</h3>
                      <p className="text-xs text-gray-500 font-medium mb-1 mt-0.5">{input.desc}</p>
                      <p className={`text-[10px] font-extrabold uppercase tracking-widest ${input.text}`}>{input.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
