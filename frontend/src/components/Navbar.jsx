import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, FlaskConical, Wheat, Leaf, CloudSun, BarChart3, Landmark, CalendarDays, Home as HomeIcon, ShieldCheck, LifeBuoy, Trees, Store, Droplet, Globe, ChevronDown } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', Icon: HomeIcon },
  { path: '/soil-input', label: 'Soil', Icon: FlaskConical },
  { path: '/crops', label: 'Crops', Icon: Wheat },
  { path: '/recovery', label: 'Loss Recovery', Icon: LifeBuoy },
  { path: '/bio-inputs', label: 'Bio-Fertilizer', Icon: Droplet },
  { path: '/agroforestry', label: 'Profit Trees', Icon: Trees },
  { path: '/b2b', label: 'Direct Market', Icon: Store },
  { path: '/market', label: 'Mandi Rates', Icon: BarChart3 },
  { path: '/schemes', label: 'Schemes', Icon: Landmark }
];

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी (Hindi)' },
  { code: 'mr', label: 'मराठी (Marathi)' },
  { code: 'ta', label: 'தமிழ் (Tamil)' },
  { code: 'te', label: 'తెలుగు (Telugu)' },
  { code: 'bn', label: 'বাংলা (Bengali)' },
  { code: 'gu', label: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', label: 'മലയാളം (Malayalam)' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ (Punjabi)' },
];

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);

  const getCurrentLang = () => {
    const match = document.cookie.match(/googtrans=\/en\/([a-z]{2})/);
    return match ? match[1] : 'en';
  };

  const changeLanguage = (langCode) => {
    document.cookie = `googtrans=/en/${langCode}; path=/;`;
    if(window.location.hostname !== 'localhost') {
        document.cookie = `googtrans=/en/${langCode}; domain=.${window.location.hostname}; path=/;`;
    }
    window.location.reload();
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-50 to-green-50 text-primary-800 hover:from-primary-100 hover:to-green-100 border border-primary-100/50 transition-all duration-300 font-bold text-sm shadow-[0_2px_10px_rgba(22,163,74,0.1)] hover:shadow-[0_4px_15px_rgba(22,163,74,0.15)] hover:-translate-y-0.5"
      >
        <Globe className="w-4 h-4 text-primary-600" />
        <span className="hidden sm:block">{languages.find(l => l.code === getCurrentLang())?.label || 'English'}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-primary-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-[60vh] overflow-y-auto">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors border-b border-gray-50 last:border-0
                  ${getCurrentLang() === lang.code ? 'text-primary-800 bg-primary-50' : 'text-gray-600 hover:bg-primary-50'}
                `}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-xl shadow-[0_4px_40px_rgb(22,163,74,0.12)] border-b-2 border-primary-100">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-700 via-primary-600 to-primary-500 flex items-center justify-center shadow-lg shadow-primary-500/40 group-hover:-translate-y-1 group-hover:shadow-primary-500/60 transition-all duration-300">
              <Sprout className="w-7 h-7 text-white drop-shadow-md" />
            </div>
            <div>
              <span className="text-[26px] font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">Agri<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-400">Saar</span></span>
              <span className="text-[10px] block text-primary-600 -mt-1.5 font-extrabold uppercase tracking-[0.2em]">Smart Farming AI</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map(({ path, label, Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`relative px-3 py-2 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group
                    ${isActive
                      ? 'text-primary-700 bg-primary-50/50'
                      : 'text-gray-500 hover:text-primary-700 hover:bg-primary-50/30'
                    }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-primary-600 drop-shadow-md' : 'text-gray-400 group-hover:text-primary-500 group-hover:drop-shadow-sm'}`} />
                  {label}
                  {isActive && (
                    <span className="absolute inset-x-2 -bottom-[24px] h-1.5 bg-gradient-to-r from-primary-600 to-primary-400 rounded-t-full shadow-[0_-3px_12px_rgba(22,163,74,0.6)]"></span>
                  )}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <div id="google_translate_element" className="hidden"></div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-600 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-primary-100 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-bold transition-all
                  ${location.pathname === path
                    ? 'bg-primary-800 text-white'
                    : 'text-gray-600 hover:bg-primary-50'
                  }`}
              >
                <div className={`p-2 rounded-lg ${location.pathname === path ? 'bg-white/20' : 'bg-primary-100'} `}>
                  <Icon className={`w-5 h-5 ${location.pathname === path ? 'text-white' : 'text-primary-700'}`} />
                </div>
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
