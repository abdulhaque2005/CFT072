import { Link } from 'react-router-dom';
import { Sprout, FlaskConical, Wheat, CloudSun, BarChart3, Landmark, CalendarDays, ArrowRight, Sparkles, Tractor, MapPin, Gauge } from 'lucide-react';
import { useState, useEffect } from 'react';
import useLocation from '../hooks/useLocation';

const features = [
  { icon: <FlaskConical className="w-8 h-8" />, title: 'Soil Analysis', desc: 'Mitti ki poori report — N, P, K, pH score', path: '/soil-input' },
  { icon: <Wheat className="w-8 h-8" />, title: 'Crop Recommendation', desc: 'Best fasal suggest karega AI', path: '/crops' },
  { icon: <Sprout className="w-8 h-8" />, title: 'Fertilizer Plan', desc: 'Kitna, kab, kaunsa fertilizer daalein', path: '/fertilizer' },
  { icon: <CloudSun className="w-8 h-8" />, title: 'Weather Advisory', desc: 'Mausam ke hisaab se farming advice', path: '/weather' },
  { icon: <BarChart3 className="w-8 h-8" />, title: 'Market Insights', desc: 'Mandi price prediction aur sell advice', path: '/market' },
  { icon: <Landmark className="w-8 h-8" />, title: 'Govt Schemes', desc: 'Sarkari yojanayein aur kaise apply karein', path: '/schemes' },
  { icon: <CalendarDays className="w-8 h-8" />, title: 'Farming Calendar', desc: 'Poora farming schedule — buwai se katai tak', path: '/calendar' }
];

const stats = [
  { value: '11+', label: 'AI Modules' },
  { value: '50+', label: 'Crops Supported' },
  { value: '10+', label: 'Govt Schemes' },
  { value: '24/7', label: 'AI Available' }
];

export default function Home() {
  const { city, state, loading: locLoading } = useLocation();

  return (
    <div className="overflow-hidden bg-[#f8faf8]">
      {/* Premium Hero Section with Background Video */}
      <section className="relative min-h-[85vh] flex items-center justify-center">
        {/* Background Image of Farmer */}
        <div className="absolute inset-0 overflow-hidden w-full h-full bg-black">
          <img
            src="https://images.unsplash.com/photo-1599839619711-2eb2ce0ab0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Lush Indian Farming"
            className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-primary-900/40 to-transparent mix-blend-multiply"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full mt-10">
          <div className="max-w-3xl">
            {/* Location Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium mb-4 border border-white/20 shadow-lg">
              <MapPin className="w-4 h-4 text-green-300" />
              {locLoading ? 'Detecting Location...' : `Farming in ${city}, ${state}`}
            </div>

            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 backdrop-blur-md px-4 py-2 rounded-full text-yellow-300 text-sm font-extrabold mb-6 border border-yellow-500/30">
              <Sparkles className="w-4 h-4" /> Powered by Gemini 2.0 Flash
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-tight mb-6 drop-shadow-md">
              Complex Soil Data ko
              <span className="block text-primary-300">Simple Farming</span>
            </h1>

            <p className="text-lg text-gray-200 mb-8 max-w-xl leading-relaxed drop-shadow font-medium">
              Aapki {city} ki mitti aur mausam ke hisaab se, AI turant batayega best crop, fertilizer plan, 5-din ka forecast aur profitable govt schemes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/soil-input" className="bg-white text-primary-900 px-8 py-4 rounded-xl font-bold text-base hover:bg-gray-100 transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-white/40 active:scale-95 flex items-center gap-2">
                <FlaskConical className="w-5 h-5" /> Start Free Analysis
                <ArrowRight className="w-5 h-5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Seamless Fade Transition to Next Section */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f8faf8] via-[#f8faf8]/80 to-transparent z-10" />
      </section>

      {/* Stats Section with Glassmorphism */}
      <section className="py-12 bg-[#f8faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-24 relative z-20">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-xl border border-primary-100/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] rounded-2xl p-6 text-center transform transition-transform hover:-translate-y-2">
                <div className="text-4xl font-black text-primary-800 bg-clip-text text-transparent bg-gradient-to-r from-primary-900 to-primary-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-2 font-bold uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f8faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 flex items-center justify-center gap-3">
              <Tractor className="w-8 h-8 text-primary-600" /> Hamari Subidhayein
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto font-medium text-lg">AI-powered tools jo {city} mein farming ko easy banayein</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Link
                key={i}
                to={f.path}
                className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-gray-100 hover:border-primary-400 hover:shadow-2xl transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center text-primary-700 group-hover:bg-gradient-to-br group-hover:from-primary-600 group-hover:to-primary-800 group-hover:text-white group-hover:scale-110 transition-transform duration-300 mb-6 shadow-sm border border-primary-100 group-hover:border-transparent">
                  {f.icon}
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2 group-hover:text-primary-800 transition-colors">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed flex-grow font-medium">{f.desc}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-extrabold text-primary-600 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0 duration-300">
                  Tool Kholein <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-[#0a2e0d] rounded-[3rem] p-10 md:p-20 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
              <Gauge className="w-[500px] h-[500px] text-white" />
            </div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Mitti Test Karo, <br/>Fasal Badhao <Sparkles className="inline w-8 h-8 text-yellow-400 mb-2" /></h2>
              <p className="text-primary-100/90 mb-10 text-lg font-medium">
                Bas apni mitti ka basic data daalein aur AI complete farming plan de dega. Purely free.
              </p>
              <Link to="/soil-input" className="inline-flex items-center gap-3 bg-white text-primary-950 px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-gray-50 transition-all active:scale-95">
                <FlaskConical className="w-6 h-6" /> Start Soil Analysis Nu
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#0a1a0c] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">AgriSaar</span>
            </div>
            <p className="text-sm text-gray-400 font-medium">
              © 2026 AgriSaar. Smart Farming Assistant. Made with <span className="text-green-500 animate-pulse inline-block mx-1">♥</span> for Farmers.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
