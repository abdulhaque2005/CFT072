import { Link } from 'react-router-dom';
import { Sprout, FlaskConical, Wheat, CloudSun, BarChart3, BookOpen, CalendarDays, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  { icon: <FlaskConical className="w-7 h-7" />, title: 'Soil Analysis', desc: 'Mitti ki poori report — N, P, K, pH score', path: '/soil-input', emoji: '🧪' },
  { icon: <Wheat className="w-7 h-7" />, title: 'Crop Recommendation', desc: 'Best fasal suggest karega AI', path: '/crops', emoji: '🌾' },
  { icon: <Sprout className="w-7 h-7" />, title: 'Fertilizer Plan', desc: 'Kitna, kab, kaunsa fertilizer daalein', path: '/fertilizer', emoji: '🌱' },
  { icon: <CloudSun className="w-7 h-7" />, title: 'Weather Advisory', desc: 'Mausam ke hisaab se farming advice', path: '/weather', emoji: '🌧️' },
  { icon: <BarChart3 className="w-7 h-7" />, title: 'Market Insights', desc: 'Mandi price prediction aur sell advice', path: '/market', emoji: '📊' },
  { icon: <BookOpen className="w-7 h-7" />, title: 'Govt Schemes', desc: 'Sarkari yojanayein aur kaise apply karein', path: '/schemes', emoji: '💰' },
  { icon: <CalendarDays className="w-7 h-7" />, title: 'Farming Calendar', desc: 'Poora farming schedule — buwai se katai tak', path: '/calendar', emoji: '📅' }
];

const stats = [
  { value: '11+', label: 'AI Modules' },
  { value: '50+', label: 'Crops Supported' },
  { value: '7+', label: 'Govt Schemes' },
  { value: '24/7', label: 'AI Available' }
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      <section className="relative gradient-bg min-h-[85vh] flex items-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-8xl animate-bounce-slow">🌾</div>
          <div className="absolute top-40 right-20 text-6xl animate-pulse-slow">🌿</div>
          <div className="absolute bottom-20 left-1/4 text-7xl animate-bounce-slow" style={{ animationDelay: '0.5s' }}>🌱</div>
          <div className="absolute bottom-40 right-1/3 text-5xl animate-pulse-slow" style={{ animationDelay: '1s' }}>☀️</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Smart Farming Assistant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Complex Soil Data ko
              <span className="block text-primary-200">Simple Farming</span>
              <span className="block">Decisions mein Badlo</span>
            </h1>

            <p className="text-lg text-primary-100 mb-8 max-w-xl leading-relaxed">
              Soil report upload karo ya data dalo — AI turant batayega best crop, fertilizer plan, weather advisory aur government schemes.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/soil-input" className="bg-white text-primary-800 px-8 py-4 rounded-xl font-bold text-base hover:bg-primary-50 transition-all hover:shadow-xl hover:shadow-white/20 active:scale-95 flex items-center gap-2">
                <FlaskConical className="w-5 h-5" /> Mitti ka Analysis Karein
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/schemes" className="border-2 border-white/40 text-white px-8 py-4 rounded-xl font-bold text-base hover:bg-white/10 transition-all flex items-center gap-2">
                💰 Sarkari Schemes Dekhein
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#f8faf8] to-transparent" />
      </section>

      <section className="py-16 bg-[#f8faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-20 relative z-20">
            {stats.map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl font-extrabold text-primary-800">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f8faf8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">🌾 Hamari Services</h2>
            <p className="text-gray-500 mt-2 max-w-xl mx-auto">AI-powered tools jo farming ko easy aur profitable banayein</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <Link
                key={i}
                to={f.path}
                className="card group hover:border-primary-300"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 group-hover:bg-primary-800 group-hover:text-white transition-all duration-300 mb-4">
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-bg rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">Abhi Shuru Karein — Free Hai! 🚀</h2>
            <p className="text-primary-100 mb-6 max-w-lg mx-auto">
              Bas apni mitti ka data daalein aur AI complete farming plan de dega
            </p>
            <Link to="/soil-input" className="inline-flex items-center gap-2 bg-white text-primary-800 px-8 py-4 rounded-xl font-bold hover:shadow-xl transition-all active:scale-95">
              <FlaskConical className="w-5 h-5" /> Start Soil Analysis
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-primary-950 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="w-6 h-6 text-primary-300" />
              <span className="font-bold text-lg">AgriSaar — Smart Farming AI</span>
            </div>
            <p className="text-sm text-primary-300">© 2026 AgriSaar. Kisaan ka Saathi. Made with 💚</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
