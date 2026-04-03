import { Link } from 'react-router-dom';
import { Sprout, FlaskConical, Wheat, CloudSun, BarChart3, Landmark, CalendarDays, ArrowRight, Sparkles, Tractor, MapPin, Gauge } from 'lucide-react';
import { useState, useEffect } from 'react';
import useLocation from '../hooks/useLocation';

const features = [
  { icon: <FlaskConical className="w-8 h-8" />, title: 'Soil Analysis', desc: 'Complete soil health report — N, P, K, pH score', path: '/soil-input' },
  { icon: <Wheat className="w-8 h-8" />, title: 'Crop Recommendation', desc: 'AI-powered best crop suggestions for your soil', path: '/crops' },
  { icon: <Sprout className="w-8 h-8" />, title: 'Fertilizer Plan', desc: 'Precise dosage, timing, and fertilizer type', path: '/fertilizer' },
  { icon: <CloudSun className="w-8 h-8" />, title: 'Weather Advisory', desc: 'Weather-based farming advice and alerts', path: '/weather' },
  { icon: <BarChart3 className="w-8 h-8" />, title: 'Market Insights', desc: 'Mandi price prediction and sell advice', path: '/market' },
  { icon: <Landmark className="w-8 h-8" />, title: 'Govt Schemes', desc: 'Government schemes and how to apply', path: '/schemes' },
  { icon: <CalendarDays className="w-8 h-8" />, title: 'Farming Calendar', desc: 'Complete farming schedule — sowing to harvest', path: '/calendar' }
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
        {/* Background Farming Video */}
        <div className="absolute inset-0 overflow-hidden w-full h-full bg-[#0a1a0c]">
          {/* Fallback image shown instantly while video loads */}
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80" 
            alt="Farming" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&q=80"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            onLoadedData={(e) => { e.target.style.opacity = '0.7'; e.target.previousElementSibling.style.display = 'none'; }}
          >
            <source src="https://cdn.pixabay.com/video/2020/05/25/40060-424930080_large.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-br from-primary-950/80 via-primary-900/50 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 w-full mt-12 md:mt-20">
          <div className="max-w-4xl">
            {/* Ultra Premium Live Location Badge */}
            <div className={`inline-flex items-center gap-3 bg-black/30 backdrop-blur-xl px-5 py-2.5 rounded-full text-white text-sm md:text-base font-bold mb-8 border shadow-[0_4px_30px_rgba(0,0,0,0.3)] transition-all duration-700 ease-in-out ${locLoading ? 'border-primary-400/50 animate-pulse' : 'border-white/30 hover:border-white/50 hover:bg-black/40'}`}>
              <div className="relative flex h-3 w-3">
                {locLoading && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${locLoading ? 'bg-primary-500' : 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)]'}`}></span>
              </div>
              <MapPin className={`w-4 h-4 md:w-5 md:h-5 ${locLoading ? 'text-primary-300' : 'text-green-300 animate-bounce'}`} />
              {locLoading ? (
                <span className="tracking-wide text-primary-100">Detecting your farming location...</span>
              ) : (
                <span className="tracking-wide">Smart Farming in <span className="text-green-300 drop-shadow-md">{city}, {state}</span></span>
              )}
            </div>

            {/* Jaw-dropping Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black text-white leading-[1.05] mb-8 tracking-tight drop-shadow-2xl">
              Complex Soil Data ko
              <span className="block mt-2 bg-gradient-to-r from-green-300 via-primary-300 to-emerald-300 text-transparent bg-clip-text drop-shadow-lg filter pb-2">
                Simple Farming
              </span>
            </h1>

            {/* Elegant Subheadline */}
            <p className="text-xl md:text-2xl text-primary-50 mb-12 max-w-3xl leading-relaxed drop-shadow-xl font-medium border-l-4 border-green-500 pl-6 py-2 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-sm rounded-r-2xl">
              Based on {city}'s soil and weather data, AI instantly recommends the best crops, fertilizer plans, and profitable govt schemes.
            </p>

            {/* Premium CTA Buttons */}
            <div className="flex flex-wrap gap-5">
              <Link to="/soil-input" className="group bg-gradient-to-r from-green-500 to-primary-600 text-white px-8 py-4.5 rounded-2xl font-black text-lg hover:shadow-[0_0_40px_rgba(34,197,94,0.5)] transition-all duration-300 hover:-translate-y-1 active:scale-95 flex items-center gap-3 border border-green-400/50">
                <FlaskConical className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                <span className="tracking-wide">Start Free Analysis</span>
                <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" />
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
              <Tractor className="w-8 h-8 text-primary-600" /> Our Features
            </h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto font-medium text-lg">AI-powered tools to make farming easier in {city}</p>
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
                  Open Tool <ArrowRight className="w-4 h-4 ml-1" />
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
              <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Test Your Soil, <br/>Grow Better Crops <Sparkles className="inline w-8 h-8 text-yellow-400 mb-2" /></h2>
              <p className="text-primary-100/90 mb-10 text-lg font-medium">
                Just enter your soil data and AI will generate a complete farming plan. Completely free.
              </p>
              <Link to="/soil-input" className="inline-flex items-center gap-3 bg-white text-primary-950 px-10 py-5 rounded-2xl font-black text-lg hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-gray-50 transition-all active:scale-95">
                <FlaskConical className="w-6 h-6" /> Start Soil Analysis
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
