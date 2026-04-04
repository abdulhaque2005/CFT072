import { useState } from 'react';
import { Droplet, Leaf, Sprout, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../services/api';
import Loading from '../components/Loading';
import SpeakButton from '../components/SpeakButton';

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
      // The axios interceptor strips .data, so res IS response.data
      // The backend returns: { success, data: { crop, intelligence }, message }
      const payload = res.data || res;
      const intelligence = payload?.intelligence || payload?.crop?.intelligence || (typeof payload === 'string' ? payload : null);
      
      if (intelligence && !intelligence.includes('unavailable')) {
        setData(intelligence);
      } else {
        // If API returned fallback with "unavailable", call again with simpler approach
        throw new Error('Got fallback response');
      }
      setStatus('success');
    } catch {
      // Use Gemini directly through the voice endpoint as a backup
      try {
        const voiceRes = await api.post('/ai/voice', { 
          transcript: `[Reply in: English] Give me a detailed bio-fertilizer recipe and organic farming guide for ${crop} crop. Include: 1) Specific bio-organic recipe (Jeevamrut/Neemastra etc), 2) Benefits over chemicals, 3) Application method, 4) Cost saving estimate. Keep it practical for Indian farmers.` 
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
      
      const utter = new SpeechSynthesisUtterance(data || getOfflineFallback(crop));
      const voices = window.speechSynthesis.getVoices();
      
      // Preferred female voices
      const femaleKeywords = ['female', 'kalpana', 'priya', 'swara', 'samantha', 'zira', 'google hindi', 'microsoft k'];
      const femaleVoices = voices.filter(v => 
        femaleKeywords.some(kw => v.name.toLowerCase().includes(kw))
      );
      
      // Try Hindi Female, then any Female, then any Hindi, then first voice
      const bestVoice = 
        femaleVoices.find(v => v.lang.includes('hi')) || 
        femaleVoices[0] || 
        voices.find(v => v.lang.includes('hi')) || 
        voices[0];

      if (bestVoice) {
        console.log('Selected Voice:', bestVoice.name);
        utter.voice = bestVoice;
      }
      
      utter.onstart = () => setStatus('playing');
      utter.onend = () => setStatus('idle');
      utter.onerror = (e) => {
        console.error('Speech synthesis error:', e);
        setStatus('idle');
      };
      window.speechSynthesis.speak(utter);
      setStatus('success');
    }
  };

  const getOfflineFallback = (cropName) => {
    return `🌿 Bio-Input Recipe for ${cropName}:

🧪 Jeevamrut Formula:
• 10L Water + 1kg Cow Dung + 1L Cow Urine
• Add 50g Jaggery + Handful of soil from farm
• Mix well, ferment for 48 hours in shade
• Apply 200L per acre every 15 days

✅ Benefits:
• 60-80% reduction in chemical fertilizer cost
• Improves soil microbiome & water retention
• Better taste & quality of produce
• Zero chemical residue — fully organic

📋 Application Method:
• Dilute 1:10 with water
• Apply near root zone in evening
• Best results when soil is moist
• Start from seedling stage

💰 Cost Saving: ₹4,000-8,000 per acre per season`;
  };

  // Format text with markdown-like rendering
  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const formatted = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-gray-900">$1</strong>')
        .replace(/^(#{1,3})\s+(.*)/, '<strong class="text-lg text-gray-900">$2</strong>');
      return (
        <span key={i} className="block mb-1 font-medium" dangerouslySetInnerHTML={{ __html: formatted }} />
      );
    });
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
                <div className="bg-green-50 rounded-2xl border border-green-200 p-6 animate-fade-in">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                      <span className="font-extrabold text-green-900 text-lg">AI Formula for {crop}</span>
                    </div>
                    <SpeakButton text={data} label="🔊 Listen" size="sm" />
                  </div>
                  <div className="text-gray-800 font-medium whitespace-pre-wrap leading-relaxed text-sm">
                    {formatText(data)}
                  </div>
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
