import { useState, useEffect } from 'react';
import { Landmark, MapPin, RefreshCw, ExternalLink, IndianRupee, Search, ChevronRight, ShieldCheck, FileText, Sparkles, Loader2 } from 'lucide-react';
import { findSchemes } from '../services/schemeApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CATEGORY_CONFIG = {
  'Direct Benefit': { color: '#22c55e', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '💰' },
  'Insurance': { color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '🛡️' },
  'Loan': { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '🏦' },
  'Subsidy': { color: '#8b5cf6', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '🎯' },
  'Market': { color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: '📊' },
  'Support': { color: '#06b6d4', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: '🤝' },
  'Pension': { color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: '👴' },
  'Innovation': { color: '#14b8a6', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: '🚀' }
};

const SCHEME_IMAGES = [
  'https://images.unsplash.com/photo-1589923188900-85dae523342b?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1536054953990-725eb1a3189f?w=400&h=200&fit=crop',
  'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=200&fit=crop'
];

export default function GovernmentSchemes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { city, state, locationText, loading: locLoading } = useLocation();

  useEffect(() => {
    if (!locLoading) loadSchemes();
  }, [locLoading]);

  const loadSchemes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await findSchemes({ location: locationText || 'India', crop: '', farmerType: 'Small Farmer' });
      // interceptor strips response.data → res = { success, data, message }
      const payload = res.data || res;
      setData(payload);
    } catch (err) {
      setError(err.message || 'Schemes fetch failed');
    } finally {
      setLoading(false);
    }
  };

  if (locLoading || loading) return <Loading text="📍 Aapke liye best sarkari yojanayein dhundh rahe hain..." />;
  if (error) return <Error message={error} onRetry={loadSchemes} />;
  if (!data) return null;

  const schemes = data.schemes || [];
  const categories = ['All', ...new Set(schemes.map(s => s.category).filter(Boolean))];
  
  const filteredSchemes = schemes.filter(s => {
    const matchSearch = searchTerm === '' || 
      (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.benefit || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === 'All' || s.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-12">
        <div className="absolute inset-0 opacity-10">
          <img src="https://images.unsplash.com/photo-1589923188900-85dae523342b?w=1200&h=400&fit=crop" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <MapPin className="w-5 h-5 text-primary-300" />
            <span className="text-primary-200 font-medium text-sm">{locationText || 'India'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 flex items-center gap-3">
            <Landmark className="w-9 h-9" /> Sarkari Yojanayein
          </h1>
          <p className="text-primary-200 text-lg font-medium mb-6">Aapke liye {schemes.length}+ sarkari faayde available hain</p>
          
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
              <p className="text-3xl font-extrabold text-white">{schemes.length}+</p>
              <p className="text-primary-200 text-sm font-bold">Total Schemes</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
              <p className="text-3xl font-extrabold text-white">{data.totalBenefitValue || '₹6K-5L+'}</p>
              <p className="text-primary-200 text-sm font-bold">Benefit Range</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/15">
              <p className="text-3xl font-extrabold text-white">{categories.length - 1}</p>
              <p className="text-primary-200 text-sm font-bold">Categories</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Scheme search karein... (e.g. PM Kisan, KCC)"
              className="w-full bg-transparent outline-none text-sm font-medium text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'thin' }}>
            {categories.map(cat => {
              const config = CATEGORY_CONFIG[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {config?.icon || '📋'} {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Recommendation */}
        {data.recommendation && (
          <div className="bg-gradient-to-r from-primary-50 to-green-50 rounded-2xl p-6 border border-primary-100 mb-8">
            <h3 className="text-lg font-extrabold text-primary-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" /> AI Recommendation — {city || 'Your Area'}
            </h3>
            <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-medium max-h-60 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
              {data.recommendation}
            </div>
          </div>
        )}

        {/* Scheme Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme, i) => {
            const config = CATEGORY_CONFIG[scheme.category] || CATEGORY_CONFIG['Support'];
            const img = SCHEME_IMAGES[i % SCHEME_IMAGES.length];
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                {/* Card Header styling with Gradient */}
                <div className={`relative h-24 ${config.bg} flex items-center justify-center border-b border-gray-100 overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20 flex items-center justify-center">
                    <span className="text-6xl">{config.icon}</span>
                  </div>
                  <div className={`absolute bottom-0 w-full h-1/2 bg-gradient-to-t from-white to-transparent`}></div>
                  <div className="absolute top-3 left-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.bg} ${config.text} ${config.border} border bg-white/80 backdrop-blur-sm shadow-sm`}>
                      {config.icon} {scheme.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug group-hover:text-primary-800 transition-colors">{scheme.name}</h4>
                  
                  {/* Amount - Prominent */}
                  <div className="bg-green-50 rounded-xl p-3 mb-3 border border-green-100">
                    <div className="flex items-center gap-2 mb-1">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-bold text-green-700 uppercase">Amount / Benefit</span>
                    </div>
                    <p className="text-sm font-extrabold text-green-800">{scheme.amount}</p>
                  </div>

                  <p className="text-xs text-gray-500 font-medium mb-3 leading-relaxed flex-grow">{scheme.description}</p>

                  <div className="flex items-start gap-2 mb-3">
                    <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-blue-600 font-bold uppercase">Eligibility</p>
                      <p className="text-xs text-gray-600 font-medium">{scheme.eligibility}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  {scheme.documents && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Documents Needed
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {scheme.documents.slice(0, 3).map((doc, j) => (
                          <span key={j} className="bg-gray-50 px-2 py-1 rounded-lg text-[10px] font-semibold text-gray-600 border border-gray-100">{doc}</span>
                        ))}
                        {scheme.documents.length > 3 && (
                          <span className="bg-gray-50 px-2 py-1 rounded-lg text-[10px] font-semibold text-gray-400 border border-gray-100">+{scheme.documents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {scheme.url && (
                    <a
                      href={scheme.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 rounded-xl text-sm font-bold transition-colors mt-auto"
                    >
                      <ExternalLink className="w-4 h-4" /> Apply Now
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <Landmark className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-lg">Koi scheme nahi mili "{searchTerm}"</p>
            <p className="text-gray-300 text-sm mt-1">Search term change karke try karein</p>
          </div>
        )}
      </div>
    </div>
  );
}
