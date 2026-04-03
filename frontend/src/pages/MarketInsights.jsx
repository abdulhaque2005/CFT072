import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { BarChart3, Store, MapPin, RefreshCw, TrendingUp, TrendingDown, Minus, Search, Loader2, Sparkles, PhoneCall, ShieldCheck } from 'lucide-react';
import { getMarketPredictions, getMandiPrices } from '../services/marketApi';
import { getNearbyInfo } from '../services/schemeApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CROP_OPTIONS = ['Wheat', 'Rice', 'Cotton', 'Soybean', 'Maize', 'Gram', 'Mustard', 'Bajra', 'Groundnut', 'Sugarcane'];

export default function MarketInsights() {
  const [marketData, setMarketData] = useState(null);
  const [mandiData, setMandiData] = useState(null);
  const [nearbyInfo, setNearbyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const { lat, lon, city, state, locationText, loading: locLoading } = useLocation();

  useEffect(() => {
    if (!locLoading) loadData();
  }, [locLoading]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [marketRes, mandiRes, nearbyRes] = await Promise.allSettled([
        getMarketPredictions({ crop: selectedCrop, location: locationText || 'Gujarat' }),
        getMandiPrices({ crop: selectedCrop, location: locationText || 'Gujarat' }),
        getNearbyInfo({ lat, lon, location: locationText })
      ]);

      // interceptor strips response.data → each value = { success, data, message }
      if (marketRes.status === 'fulfilled') {
        const raw = marketRes.value;
        setMarketData(raw?.data || raw);
      }
      if (mandiRes.status === 'fulfilled') {
        const raw = mandiRes.value;
        setMandiData(raw?.data || raw);
      }
      if (nearbyRes.status === 'fulfilled') {
        const raw = nearbyRes.value;
        setNearbyInfo(raw?.data || raw);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
  };

  const searchCrop = () => {
    loadData();
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
          <p className="text-gray-500 text-xs font-bold uppercase mb-1">{label}</p>
          <p className="text-primary-700 font-extrabold text-lg">₹{payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  if (locLoading || loading) return <Loading text="Finding nearby markets and prices..." />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&h=400&fit=crop" alt="Market" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/85 via-primary-800/70 to-[#f8faf8]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary-300" />
            <span className="text-primary-200 text-sm font-medium">{locationText || 'Detecting...'}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 flex items-center gap-3">
            <BarChart3 className="w-9 h-9" /> Market Insights
          </h1>
          <p className="text-primary-200 text-lg font-medium">Mandi rates, price prediction aur sell advice — sab ek jagah</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Crop Selector */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Select your crop:</p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {CROP_OPTIONS.map(crop => (
              <button
                key={crop}
                onClick={() => handleCropChange(crop)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                  selectedCrop === crop
                    ? 'bg-primary-800 text-white shadow-lg shadow-primary-800/25'
                    : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100'
                }`}
              >
                {crop}
              </button>
            ))}
          </div>
          <button onClick={searchCrop} className="mt-4 bg-primary-800 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-primary-900 transition-colors flex items-center gap-2">
            <Search className="w-4 h-4" /> Check {selectedCrop} Prices
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* AI Market Prediction Graph & Details */}
            {marketData && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary-600" /> AI Price Prediction — {selectedCrop}
                </h2>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  {marketData.trendData && marketData.trendData.length > 0 && (
                    <div className="h-[250px] w-full mb-8 mt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={marketData.trendData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dx={-10} domain={['auto', 'auto']} />
                          <Tooltip content={<CustomTooltip />} />
                          <Line type="monotone" dataKey="price" stroke="#059669" strokeWidth={4} dot={{r: 6, fill: '#059669', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8, strokeWidth: 0}} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                      <p className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Trend Analysis</p>
                      <p className="text-gray-800 font-medium leading-relaxed">{marketData.analysis || marketData.prediction || 'Analysis loading...'}</p>
                    </div>
                    {marketData.recommendation && (
                      <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
                        <p className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Recommendation</p>
                        <p className="text-gray-900 font-extrabold leading-relaxed text-lg">{marketData.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Mandi Comparison */}
            {mandiData?.comparison && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  <Store className="w-6 h-6 text-primary-600" /> Nearby Mandi Comparison
                </h2>
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium text-sm">
                    {mandiData.comparison}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Government Helpline Banner */}
            <div className="bg-gradient-to-br from-white to-green-50 rounded-3xl p-6 shadow-lg border border-green-200 relative overflow-hidden group hover:shadow-xl transition-all">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-200 rounded-full blur-2xl opacity-50 group-hover:bg-green-300 transition-colors"></div>
              <h3 className="text-lg font-black text-gray-900 mb-2 flex items-center gap-2 relative z-10">
                <ShieldCheck className="w-6 h-6 text-green-600" /> Kisaan Call Center
              </h3>
              <p className="text-sm text-gray-600 font-medium mb-6 relative z-10">
                Talk directly with an agriculture expert for free via the government toll-free number.
              </p>
              <a href="tel:18001801551" className="bg-green-600 text-white w-full rounded-2xl py-4 font-black flex items-center justify-center gap-3 hover:bg-green-700 hover:shadow-lg transition-all drop-shadow-sm active:scale-95 text-lg relative z-10">
                <PhoneCall className="w-6 h-6 animate-pulse" /> 1800-180-1551
              </a>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 mb-5">💡 Quick Market Tips</h3>
              <div className="space-y-4">
                {[
                  { tip: 'Compare prices online on the e-NAM portal', url: 'https://enam.gov.in' },
                  { tip: 'MSP se neeche mat bechein — sarkar guarantee deti hai', url: null },
                  { tip: 'Storage available hai toh 2-3 hafte wait karo, price badhega', url: null },
                  { tip: 'Sell in groups for better rates — join an FPO', url: null }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="w-6 h-6 bg-primary-50 rounded-full flex items-center justify-center text-xs font-bold text-primary-700 flex-shrink-0 mt-0.5">{i+1}</span>
                    <p className="text-gray-600 font-medium leading-relaxed mt-0.5">
                      {item.tip}
                      {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 ml-1 font-bold underline decoration-primary-200 underline-offset-2">→ Visit</a>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Image */}
            <div className="rounded-3xl overflow-hidden shadow-sm border border-gray-100 group">
              <div className="overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=250&fit=crop" 
                  alt="Indian crop market" 
                  className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-white p-4">
                <p className="text-sm font-extrabold text-primary-800">🏪 Mandi rates change daily</p>
                <p className="text-xs text-gray-500 mt-1 font-medium">Check every morning at 8 AM for best prices</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
