import { useState, useEffect } from 'react';
import { Landmark, MapPin, RefreshCw, ExternalLink, IndianRupee, Search, ChevronRight, ShieldCheck, FileText, Sparkles, Loader2 } from 'lucide-react';
import { findSchemes } from '../services/schemeApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CATEGORY_CONFIG = {
  'Direct Benefit': { color: '#22c55e', bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '₹' },
  'Insurance': { color: '#3b82f6', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', icon: '✦' },
  'Loan': { color: '#f59e0b', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '⊕' },
  'Subsidy': { color: '#8b5cf6', bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '◎' },
  'Market': { color: '#ec4899', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: '↗' },
  'Support': { color: '#06b6d4', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700', icon: '⊞' },
  'Pension': { color: '#f97316', bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: '◈' },
  'Innovation': { color: '#14b8a6', bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', icon: '▴' }
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

// Helper to generate application URLs for government schemes
function getSchemeApplyUrl(schemeName) {
  if (!schemeName) return 'https://www.india.gov.in/topics/agriculture';
  const name = schemeName.toLowerCase();
  if (name.includes('pm-kisan') || name.includes('pm kisan')) return 'https://pmkisan.gov.in/';
  if (name.includes('fasal bima') || name.includes('pmfby')) return 'https://pmfby.gov.in/';
  if (name.includes('kcc') || name.includes('kisan credit')) return 'https://www.pmjdy.gov.in/scheme';
  if (name.includes('soil health')) return 'https://soilhealth.dac.gov.in/';
  if (name.includes('e-nam') || name.includes('enam') || name.includes('national agriculture market')) return 'https://enam.gov.in/web/';
  if (name.includes('pension') || name.includes('maandhan')) return 'https://maandhan.in/';
  if (name.includes('krishi sinchayee') || name.includes('pmksy')) return 'https://pmksy.gov.in/';
  if (name.includes('paramparagat') || name.includes('organic')) return 'https://pgsindia-ncof.gov.in/';
  if (name.includes('nabard') || name.includes('rural development')) return 'https://www.nabard.org/';
  if (name.includes('nfsm') || name.includes('food security')) return 'https://nfsm.gov.in/';
  // Fallback — search on India.gov.in
  return `https://www.india.gov.in/search/site/${encodeURIComponent(schemeName)}`;
}

function getFallbackSchemes() {
  return {
    schemes: [
      { name: 'PM-KISAN Samman Nidhi', category: 'Direct Benefit', amount: '₹6,000 per year (₹2,000 every 4 months)', description: 'Direct income support to all landholding farmer families. Amount credited directly to bank account in 3 equal installments.', eligibility: 'All farmer families with cultivable land', documents: ['Aadhaar Card', 'Land Records', 'Bank Account'], url: 'https://pmkisan.gov.in/' },
      { name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)', category: 'Insurance', amount: 'Crop insurance at 1.5-5% premium (govt subsidizes rest)', description: 'Comprehensive crop insurance against natural calamities, pests and diseases. Covers pre-sowing to post-harvest losses.', eligibility: 'All farmers growing notified crops', documents: ['Land Records', 'Sowing Certificate', 'Bank Account', 'Aadhaar'], url: 'https://pmfby.gov.in/' },
      { name: 'Kisan Credit Card (KCC)', category: 'Loan', amount: 'Up to ₹3 Lakh at 4% interest rate', description: 'Short-term crop loans for farmers at subsidized interest rates. Timely repayment gives additional 3% interest subvention.', eligibility: 'All farmers, sharecroppers, tenant farmers', documents: ['ID Proof', 'Land Records', 'Passport Photo', 'Bank Statement'], url: 'https://www.pmjdy.gov.in/scheme' },
      { name: 'Soil Health Card Scheme', category: 'Support', amount: 'Free soil testing and analysis report', description: 'Government provides free soil testing every 2 years. Card shows nutrient status and recommends exact fertilizer doses to maximize yield.', eligibility: 'All farmers with agricultural land', documents: ['Land Record', 'Aadhaar Card'], url: 'https://soilhealth.dac.gov.in/' },
      { name: 'PM Kisan Maandhan Yojana', category: 'Pension', amount: '₹3,000/month pension after age 60', description: 'Voluntary pension scheme for small and marginal farmers. Government contributes equal amount. Monthly contribution: ₹55-200 based on age.', eligibility: 'Small/marginal farmers aged 18-40 years', documents: ['Aadhaar Card', 'Land Records', 'Bank Account', 'Age Proof'], url: 'https://maandhan.in/' },
      { name: 'e-NAM (National Agriculture Market)', category: 'Market', amount: 'Better market prices through transparent auction', description: 'Online trading platform connecting 1000+ mandis. Farmers can sell to buyers across India and get competitive prices through transparent bidding.', eligibility: 'All farmers and FPOs', documents: ['Aadhaar Card', 'Bank Account', 'Mandi Registration'], url: 'https://enam.gov.in/web/' },
      { name: 'Pradhan Mantri Krishi Sinchayee Yojana', category: 'Subsidy', amount: '55-75% subsidy on micro-irrigation systems', description: 'Subsidy for drip irrigation, sprinkler systems, and water harvesting. Saves 40-50% water while improving productivity by 20-40%.', eligibility: 'All farmers with verified land ownership', documents: ['Land Records', 'Aadhaar Card', 'Bank Account', 'Farm Layout'], url: 'https://pmksy.gov.in/' },
      { name: 'Paramparagat Krishi Vikas Yojana', category: 'Innovation', amount: '₹50,000 per hectare for 3 years', description: 'Financial support for organic farming transition. Covers organic inputs, testing, certification, and marketing assistance.', eligibility: 'Groups of 50+ farmers forming a cluster', documents: ['Group Registration', 'Land Records', 'Aadhaar', 'Bank Account'], url: 'https://pgsindia-ncof.gov.in/' },
      { name: 'National Food Security Mission (NFSM)', category: 'Subsidy', amount: '50-100% subsidy on seeds, equipment, and fertilizer', description: 'Subsidized distribution of high-yield seeds, farm tools, and plant protection chemicals. Focuses on rice, wheat, pulses, and coarse cereals.', eligibility: 'Farmers in NFSM-identified districts', documents: ['Aadhaar Card', 'Land Records'], url: 'https://nfsm.gov.in/' },
      { name: 'Agriculture Infrastructure Fund', category: 'Loan', amount: 'Up to ₹2 Crore at 3% interest subvention', description: 'Financing for post-harvest infrastructure: cold storage, warehouses, grading units, sorting facilities. CGTMSE credit guarantee.', eligibility: 'Farmers, FPOs, PACS, Agri-entrepreneurs', documents: ['Project Report', 'Land Records', 'Bank Account', 'GST Registration'], url: 'https://agriinfra.dac.gov.in/' },
    ],
    recommendation: 'Based on your profile, PM-KISAN and KCC are the most immediately beneficial. Apply for Soil Health Card first to optimize your fertilizer spending, then consider PMFBY for crop protection.',
    totalBenefitValue: '₹6K-5L+'
  };
}

export default function GovernmentSchemes() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { city, state, locationText, loading: locLoading } = useLocation();

  const [showWizard, setShowWizard] = useState(true);
  const [farmerProfile, setFarmerProfile] = useState({
    landSize: 'Less than 2 Hectares (Small)',
    income: 'Less than 2 Lakhs',
    category: 'General'
  });

  useEffect(() => {
    if (!locLoading) loadSchemes(true);
  }, [locLoading]);

  const loadSchemes = async (initialLoad = false) => {
    try {
      setLoading(true);
      setError('');
      const farmerDesc = `${farmerProfile.landSize} farmer, ${farmerProfile.category} category, ${farmerProfile.income} annual income`;
      const res = await findSchemes({
        location: locationText || 'India',
        crop: '',
        farmerType: initialLoad ? 'Small Farmer' : farmerDesc
      });
      const payload = res.data || res;
      if (payload?.schemes?.length) {
        setData(payload);
      } else {
        setData(getFallbackSchemes());
      }
      if (!initialLoad) setShowWizard(false);
    } catch (err) {
      console.warn('Schemes API failed, using local data:', err.message);
      setData(getFallbackSchemes());
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => {
    setFarmerProfile({ ...farmerProfile, [e.target.name]: e.target.value });
  };

  if (locLoading || loading) return <Loading text="Finding the best government schemes for you..." />;
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
            <Landmark className="w-9 h-9" /> Government Schemes
          </h1>
          <p className="text-primary-200 text-lg font-medium mb-6">{schemes.length}+ government benefits available for you</p>

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
              placeholder="Search schemes... (e.g. PM Kisan, KCC)"
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
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedCategory === cat
                      ? 'bg-primary-800 text-white shadow-md'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {config?.icon || '•'} {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Wizard / Profile Builder */}
        {showWizard ? (
          <div className="bg-gradient-to-br from-white to-green-50 rounded-[2rem] shadow-xl border border-green-100 p-8 mb-10 transition-all">
            <h2 className="text-2xl font-extrabold text-green-900 mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-500" /> AI Scheme Recommender
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Land Size</label>
                <select name="landSize" value={farmerProfile.landSize} onChange={handleProfileChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                  <option>Less than 2 Hectares (Small)</option>
                  <option>2 to 5 Hectares (Medium)</option>
                  <option>More than 5 Hectares (Large)</option>
                  <option>Landless / Tenant</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Annual Income</label>
                <select name="income" value={farmerProfile.income} onChange={handleProfileChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                  <option>Less than 1 Lakh</option>
                  <option>1 to 2 Lakhs</option>
                  <option>2 to 5 Lakhs</option>
                  <option>More than 5 Lakhs</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Social Category</label>
                <select name="category" value={farmerProfile.category} onChange={handleProfileChange} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none">
                  <option>General</option>
                  <option>SC / ST</option>
                  <option>OBC</option>
                  <option>Women Farmer</option>
                </select>
              </div>
            </div>
            <button onClick={() => loadSchemes(false)} className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-700 text-white font-black rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              <Search className="w-5 h-5" /> Find My Exact Eligibility
            </button>
          </div>
        ) : (
          <div className="text-right mb-6">
            <button onClick={() => setShowWizard(true)} className="text-sm font-bold text-green-600 hover:text-green-800 underline">
              Edit Profile for Better Matches
            </button>
          </div>
        )}

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
            
            // Generate application URL  
            const applyUrl = scheme.url || getSchemeApplyUrl(scheme.name);
            
            return (
              <div key={i} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
                {/* Card Image Header */}
                <div className="relative h-40 overflow-hidden">
                  <img 
                    src={img} 
                    alt={scheme.name || 'Government Scheme'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent"></div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm shadow-md ${config.text} border ${config.border}`}>
                      {config.icon} {scheme.category}
                    </span>
                  </div>
                  
                  {/* Scheme Name on Image */}
                  <h4 className="absolute bottom-3 left-4 right-4 text-base font-extrabold text-white drop-shadow-lg leading-snug">{scheme.name}</h4>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Amount - Prominent */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 bg-green-500 rounded-lg flex items-center justify-center">
                        <IndianRupee className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs font-black text-green-700 uppercase tracking-wider">Benefit Amount</span>
                    </div>
                    <p className="text-lg font-extrabold text-green-800">{scheme.amount}</p>
                  </div>

                  <p className="text-xs text-gray-500 font-medium mb-3 leading-relaxed flex-grow">{scheme.description}</p>

                  <div className="flex items-start gap-2 mb-3 bg-blue-50/50 rounded-lg p-2.5 border border-blue-50">
                    <ShieldCheck className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-[10px] text-blue-600 font-black uppercase tracking-wider">Eligibility</p>
                      <p className="text-xs text-gray-600 font-medium">{scheme.eligibility}</p>
                    </div>
                  </div>

                  {/* Documents */}
                  {scheme.documents && (
                    <div className="mb-4">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 flex items-center gap-1">
                        <FileText className="w-3 h-3" /> Documents Required
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {scheme.documents.slice(0, 3).map((doc, j) => (
                          <span key={j} className="bg-gray-50 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-gray-600 border border-gray-100">{doc}</span>
                        ))}
                        {scheme.documents.length > 3 && (
                          <span className="bg-gray-50 px-2.5 py-1 rounded-lg text-[10px] font-semibold text-gray-400 border border-gray-100">+{scheme.documents.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Apply Now Button - Prominent Green */}
                  <a
                    href={applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl text-sm font-black transition-all mt-auto shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
                  >
                    <ExternalLink className="w-4 h-4" /> Apply Now
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {filteredSchemes.length === 0 && (
          <div className="text-center py-16">
            <Landmark className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold text-lg">No schemes found for "{searchTerm}"</p>
            <p className="text-gray-300 text-sm mt-1">Try changing your search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
