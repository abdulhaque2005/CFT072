import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Sprout, FlaskConical, Wheat, Leaf, CloudSun, BarChart3, Landmark, CalendarDays, Home as HomeIcon, ShieldCheck, LifeBuoy, Trees, Store, Droplet } from 'lucide-react';

const navLinks = [
  { path: '/', label: 'Home', Icon: HomeIcon },
  { path: '/soil-input', label: 'Soil', Icon: FlaskConical },
  { path: '/crops', label: 'Crops', Icon: Wheat },
  { path: '/recovery', label: 'Loss Recovery', Icon: LifeBuoy },
  { path: '/bio-inputs', label: 'Bio-Fertilizer', Icon: Droplet },
  { path: '/agroforestry', label: 'Profit Trees', Icon: Trees },
  { path: '/b2b', label: 'Direct Market', Icon: Store },
  { path: '/market', label: 'Mandi Rates', Icon: BarChart3 },
  { path: '/schemes', label: 'Schemes', Icon: Landmark },
  { path: '/subsidy-tracker', label: 'Transparency', Icon: ShieldCheck }
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-primary-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center shadow-lg shadow-primary-800/20 group-hover:scale-110 transition-transform">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-primary-800">AgriSaar</span>
              <span className="text-[10px] block text-primary-600 -mt-1 font-medium">Smart Farming AI</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ path, label, Icon }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center gap-2
                  ${location.pathname === path
                    ? 'bg-primary-800 text-white shadow-md shadow-primary-800/20'
                    : 'text-gray-600 hover:bg-primary-50 hover:text-primary-800'
                  }`}
              >
                <Icon className={`w-5 h-5 ${location.pathname === path ? 'text-white' : 'text-primary-600'}`} />
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6 text-gray-700" /> : <Menu className="w-6 h-6 text-gray-700" />}
          </button>
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
