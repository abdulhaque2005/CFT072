import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Loader2, Sprout, HelpCircle, ChevronRight, X, BookOpen } from 'lucide-react';
import { useAgri } from '../context/AgriContext';
import api from '../services/api';

// ─── Farmer Avatar ───────────────────────────────────────────────────────────
const FARMER_AVATAR = '/farmer_avatar.png';

// ─── Home Page Guided Tour Script ────────────────────────────────────────────
// Each step has:
//   - label:    button number/name shown in the tour panel
//   - sectionId:  ID of the DOM element to scroll to
//   - speech:   full narration line-by-line for that section
const HOME_TOUR_STEPS = [
  {
    step: 1,
    label: 'Hero',
    sectionId: 'section-hero',
    title: '🌾 Welcome to AgriSaar',
    speech: `Namaste Kisan Bhai! Yeh hai AgriSaar ka Hero Section. Yahan aapko ek badi headline dikhti hai — "Complex Soil Data ko Simple Farming" — iska matlab hai ki aapki mitti ki mushkil jaankari ko hum aasaan bana dete hain. Neeche ek haara button hai — "Start Free Analysis" — jo aapko seedha soil testing page par le jaata hai. Upar ek location badge bhi hai jo aapka city detect karta hai, jaise ki Indore ya Pune, taaki advice local ho.`,
  },
  {
    step: 2,
    label: 'Stats',
    sectionId: 'section-stats',
    title: '📊 Our Numbers',
    speech: `Yeh hai hamaara Stats Section. Yahan aap dekh sakte hain ki AgriSaar mein 11 se zyada AI modules hain, 50 se zyada crops supported hain, 10 se zyada government schemes ke baare mein jaankari dete hain, aur yeh service 24 ghante 7 din available hai. Yeh numbers dikhate hain ki AgriSaar kitna capable aur trustworthy platform hai.`,
  },
  {
    step: 3,
    label: 'Features',
    sectionId: 'section-features',
    title: '🛠️ Our Features',
    speech: `Ab aao Features Section mein. Yahan 7 powerful tools hain. Pehla hai Soil Analysis — N, P, K aur pH levels check karta hai. Doosra Crop Recommendation — AI aapki mitti ke hisaab se best crop suggest karta hai. Teesra Fertilizer Plan — kitna, kab aur kaunsa khaad daalna hai bataata hai. Chautha Weather Advisory — mausam ke hisaab se farming alert deta hai. Paanchwa Market Insights — mandi price prediction. Chhaata Government Schemes — sarkari yojanaon ki jaankari. Aur saatwa Farming Calendar — poori farming schedule seedha aapke phone mein.`,
  },
  {
    step: 4,
    label: 'CTA',
    sectionId: 'section-cta',
    title: '🚀 Start Analysis',
    speech: `Yeh hai hamaara Call To Action section. Ek sundar dark green background mein likha hai — "Test Your Soil, Grow Better Crops". Neeche ek white button hai — "Start Soil Analysis" — jo aapko seedha analysis page par le jaata hai. Yeh bilkul free hai. Bas apni mitti ki NPK values daalo, aur AI poora farming plan bana deta hai.`,
  },
  {
    step: 5,
    label: 'Footer',
    sectionId: 'section-footer',
    title: '📋 Footer',
    speech: `Yeh hai AgriSaar ka Footer. Yahan AgriSaar ka logo hai aur likhaa hai — "Smart Farming Assistant, Made with love for Farmers." Copyright 2026 AgriSaar. Hum farmers ke liye dedicated hain. Yeh tha AgriSaar ka poora parichay! Agar aapke koi sawaal hain, toh main yahan hoon. Mic button dabaayein aur puchhein!`,
  },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FarmerVoiceAssistant() {
  const { analysis } = useAgri();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tooltip, setTooltip] = useState('Namaste! Tap to start tour.');
  const [showTourPanel, setShowTourPanel] = useState(false);
  const [activeTourStep, setActiveTourStep] = useState(null); // null | step number

  const navigate = useNavigate();
  const location = useLocation();
  const recognitionRef = useRef(null);
  const synthesisRef = useRef(window.speechSynthesis);
  const lastSpokenPath = useRef(null);

  // ─── Speech Recognition Init ─────────────────────────────────────────────
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'hi-IN';
      recognitionRef.current.onstart = () => { setIsListening(true); setTooltip('Main sun raha hoon...'); };
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onresult = (event) => processQuery(event.results[0][0].transcript);
    }
  }, []);

  // ─── Core TTS ────────────────────────────────────────────────────────────
  const speak = useCallback((text, onDone) => {
    if (isMuted || !synthesisRef.current) { onDone?.(); return; }
    synthesisRef.current.cancel();
    const cleanText = text.replace(/[*_#\[\]()<>]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.88;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => { setIsSpeaking(false); onDone?.(); };
    utterance.onerror = () => { setIsSpeaking(false); onDone?.(); };
    synthesisRef.current.speak(utterance);
  }, [isMuted]);

  // ─── Guided Tour: Run a Step ─────────────────────────────────────────────
  const runTourStep = useCallback((stepNum) => {
    // Only show tour on home page
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => runTourStep(stepNum), 800);
      return;
    }

    const step = HOME_TOUR_STEPS.find(s => s.step === stepNum);
    if (!step) return;

    setActiveTourStep(stepNum);
    setTooltip(step.title);

    // Scroll to section
    const el = document.getElementById(step.sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Speak narration
    const isLastStep = stepNum === HOME_TOUR_STEPS.length;
    const farewell = isLastStep
      ? ' Dhanyawad! AgriSaar mein aapka swagat hai. Agar aur koi sawaal ho toh mic button click karein — main yahan hoon, aapka sahayak!'
      : '';

    speak(step.speech + farewell, () => {
      if (isLastStep) {
        setActiveTourStep(null);
        setTooltip('Tour complete! Ask me anything. 🎉');
      }
    });
  }, [location.pathname, navigate, speak]);

  // ─── Page-Aware Guidance (non-home pages) ────────────────────────────────
  const getPageSummary = useCallback(() => {
    const path = location.pathname;
    const { soil, crops, fertilizer } = analysis || {};
    if (path === '/analysis') {
      if (soil) {
        const score = soil.healthScore || soil.score;
        return `Dost, aapki mitti ka health score ${score} hai. ${score > 70 ? 'Mitti bahut upjau hai.' : 'Mitti ko thode sudhaar ki zaroorat hai.'} Niche di gayi report dhyaan se dekhein.`;
      }
      return 'Pehle soil data daalo, phir main aapko poori analysis bata de ta hoon.';
    }
    if (path === '/crops') {
      const best = crops?.topCrops?.[0]?.name;
      return best ? `Aapke liye ${best} sabse behtar fasal hai. Baaki recommendations bhi niche di gayi hain.` : 'Crops ki recommendations ke liye pahle mitti ki jaankari chahiye.';
    }
    if (path === '/fertilizer') return fertilizer?.requirements ? 'Maine aapki khet ke liye fertilizer plan taiyar kar diya hai. Sahi samay par daalein, achhi yield milegi.' : 'Fertilizer plan ke liye crop detail chahiye.';
    if (path === '/weather') return 'Yahan aap apne area ka mausam dekh sakte hain. Aaj ki farming advisory dhyan rakhein.';
    return null;
  }, [location.pathname, analysis]);

  useEffect(() => {
    if (location.pathname === '/') return; // handled by tour
    if (lastSpokenPath.current === location.pathname) return;
    const summary = getPageSummary();
    if (summary) {
      const t = setTimeout(() => { speak(summary); lastSpokenPath.current = location.pathname; }, 1200);
      return () => clearTimeout(t);
    }
  }, [location.pathname, getPageSummary, speak]);

  // ─── Voice Command Handler ────────────────────────────────────────────────
  const processQuery = async (query) => {
    const q = query.toLowerCase();
    setIsLoading(true);
    setTooltip('Soch raha hoon...');
    synthesisRef.current?.cancel();

    const routes = {
      weather: '/weather', mausam: '/weather',
      soil: '/soil-input', mitti: '/soil-input',
      analysis: '/analysis',
      crop: '/crops', fasal: '/crops',
      fertilizer: '/fertilizer', khaad: '/fertilizer',
      home: '/', ghar: '/',
    };

    let target = null;
    for (const [k, v] of Object.entries(routes)) { if (q.includes(k)) { target = v; break; } }

    if (target) {
      speak(`Theek hai, le ja raha hoon.`); navigate(target);
    } else if (q.includes('back') || q.includes('piche')) {
      speak('Piche ja raha hoon.'); navigate(-1);
    } else if (q.includes('tour') || q.includes('dikhao') || q.includes('explain')) {
      setShowTourPanel(true); speak('Tour panel khul gaya hai. Number click karein.');
    } else if (q.includes('help') || q.includes('madad')) {
      speak('Main AgriSaar Assistant hoon. Mitti, crop, weather, ya guided tour ke liye puchh sakte ho.');
    } else {
      try {
        const ctx = JSON.stringify({ page: location.pathname, soil: analysis?.soil?.healthScore || 'N/A', topCrop: analysis?.crops?.topCrops?.[0]?.name || 'N/A' });
        const res = await api.post('/ai/voice', { transcript: `[Context: ${ctx}] ${query}` });
        const txt = res.data?.advice || res.advice || 'Maaf karna, samajh nahi aaya.';
        speak(txt);
        setTooltip(txt.substring(0, 45) + '...');
      } catch { speak('Connectivity issue. Dobara try karein.'); }
    }
    setIsLoading(false);
  };

  const toggleMic = () => {
    if (isListening) recognitionRef.current?.stop();
    else { synthesisRef.current?.cancel(); recognitionRef.current?.start(); }
  };

  // ─── Lip Sync Overlay ─────────────────────────────────────────────────────
  const LipSyncMouth = () => (
    <motion.div
      className="absolute left-1/2 top-[34%] -translate-x-1/2 w-4 z-20"
      animate={isSpeaking ? { height: [2, 6, 2, 8, 2], opacity: 1 } : { height: 1, opacity: 0 }}
      transition={isSpeaking ? { repeat: Infinity, duration: 0.25 } : {}}
    >
      <div className="w-full h-full bg-[#2d1b0f] rounded-full border border-black/5 shadow-sm" />
    </motion.div>
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end gap-3">

      {/* ── Tour Panel ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showTourPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 16 }}
            className="bg-white rounded-3xl shadow-2xl border border-emerald-100 w-72 overflow-hidden"
          >
            {/* Panel Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-700 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-white" />
                <span className="text-white font-black text-sm tracking-wide uppercase">Guided Tour</span>
              </div>
              <button onClick={() => { setShowTourPanel(false); synthesisRef.current?.cancel(); }} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tour Instruction */}
            <div className="px-5 py-3 bg-emerald-50 border-b border-emerald-100">
              <p className="text-[11px] text-emerald-800 font-semibold leading-snug">
                Click a number to hear the explanation of that section. The page will auto-scroll!
              </p>
            </div>

            {/* Tour Step Buttons */}
            <div className="p-4 flex flex-col gap-2">
              {HOME_TOUR_STEPS.map((step) => {
                const isActive = activeTourStep === step.step;
                return (
                  <button
                    key={step.step}
                    onClick={() => runTourStep(step.step)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-left transition-all duration-300 font-semibold text-sm border ${
                      isActive
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg scale-[1.02]'
                        : 'bg-white text-gray-700 border-gray-100 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    {/* Step Number Badge */}
                    <span className={`w-8 h-8 flex-shrink-0 rounded-xl flex items-center justify-center font-black text-base ${
                      isActive ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {step.step}
                    </span>
                    <span className="flex-1">{step.title}</span>
                    {isActive && isSpeaking && (
                      <span className="flex gap-0.5">
                        {[0.1, 0.3, 0.2].map((d, i) => (
                          <motion.span key={i} className="w-1 bg-white rounded-full" animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: d }} />
                        ))}
                      </span>
                    )}
                    {!isActive && <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </button>
                );
              })}
            </div>

            {/* Panel Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-gray-500 font-medium">Mic active after every explanation</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Speech Tooltip ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {tooltip && !showTourPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85 }}
            className="mb-1 bg-white px-5 py-2.5 rounded-2xl shadow-2xl border border-emerald-50 max-w-[260px] text-center relative pointer-events-none self-center"
          >
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-r border-b border-emerald-50" />
            <p className="text-[11px] font-extrabold text-emerald-900 tracking-wider uppercase leading-tight italic">
              "{tooltip}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Avatar + Controls ───────────────────────────────────────────────── */}
      <div className="flex items-end gap-3">

        {/* Tour Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTourPanel(v => !v)}
          className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-all ${
            showTourPanel ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border border-emerald-100 hover:bg-emerald-50'
          }`}
          title="Open Guided Tour"
        >
          <BookOpen className="w-5 h-5" />
        </motion.button>

        {/* Main Avatar */}
        <div className="relative cursor-pointer group" onClick={toggleMic}>
          {/* Pulse Rings */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.5, opacity: [0, 0.3, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 rounded-full bg-emerald-300 -z-10" />
            )}
            {isListening && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1.8, opacity: [0.1, 0.45, 0.1] }} transition={{ repeat: Infinity, duration: 1 }} className="absolute inset-0 rounded-full bg-red-300 -z-10 shadow-[0_0_40px_rgba(239,68,68,0.4)]" />
            )}
          </AnimatePresence>

          {/* Floating Avatar */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className={`relative w-28 h-28 rounded-full border-4 shadow-2xl overflow-hidden transition-all duration-700 ${
              isSpeaking ? 'border-emerald-500 shadow-emerald-200' : isListening ? 'border-red-500 shadow-red-200 scale-105' : 'border-white hover:border-emerald-100'
            }`}
          >
            <img src={FARMER_AVATAR} alt="AgriSaar Assistant" className="w-full h-full object-cover object-top scale-[1.35] translate-y-[2%]" />
            <LipSyncMouth />
            {isLoading && (
              <div className="absolute inset-0 bg-emerald-900/10 backdrop-blur-[1px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              </div>
            )}
          </motion.div>

          {/* Mute Button */}
          <button
            onClick={(e) => { e.stopPropagation(); setIsMuted(v => !v); if (!isMuted) synthesisRef.current?.cancel(); }}
            className={`absolute -right-2 top-1 w-9 h-9 rounded-xl shadow-lg flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white' : 'bg-white text-emerald-600'}`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Sound Waves */}
          {isSpeaking && (
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 h-5">
              {[0.1, 0.4, 0.2, 0.5, 0.3].map((delay, i) => (
                <motion.div key={i} animate={{ height: [4, 20, 5, 15, 4] }} transition={{ repeat: Infinity, duration: 0.6, delay }} className="w-1.5 bg-emerald-500 rounded-full shadow-sm" />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
