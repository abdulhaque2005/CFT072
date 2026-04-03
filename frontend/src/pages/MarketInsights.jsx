import { useState, useEffect } from 'react';
import { BarChart3, Store, MapPin, RefreshCw, TrendingUp, TrendingDown, Minus, Search, Loader2, Sparkles } from 'lucide-react';
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

      if (marketRes.status === 'fulfilled') setMarketData(marketRes.value?.data || marketRes.value);
      if (mandiRes.status === 'fulfilled') setMandiData(mandiRes.value?.data || mandiRes.value);
      if (nearbyRes.status === 'fulfilled') setNearbyInfo(nearbyRes.value?.data || nearbyRes.value);
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

  if (locLoading || loading) return <Loading text="📍 Aapke paas ki mandiyaan dhundh rahe hain..." />;
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
        {/* Crop Selector - Horizontal Scroll */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Apni fasal select karein:</p>
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
            <Search className="w-4 h-4" /> {selectedCrop} ka Rate Check Karein
          </button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* AI Market Prediction */}
            {marketData?.prediction && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary-600" /> AI Price Prediction — {selectedCrop}
                </h2>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium text-sm">
                    {marketData.prediction}
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
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium text-sm">
                    {mandiData.comparison}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nearby Farming Info */}
            {nearbyInfo?.info && (
              <div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" /> Nearby Advisory ({city})
                </h3>
                <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 text-white">
                  <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium max-h-80 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                    {nearbyInfo.info}
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/15">
                    <p className="text-[10px] text-primary-300 font-bold uppercase">Season: {nearbyInfo.season}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">💡 Quick Market Tips</h3>
              <div className="space-y-3">
                {[
                  { tip: 'e-NAM portal pe online price compare karein', url: 'https://enam.gov.in' },
                  { tip: 'MSP se neeche mat bechein — sarkar guarantee deti hai', url: null },
                  { tip: 'Storage available hai toh 2-3 hafte wait karo, price badhega', url: null },
                  { tip: 'Group mein bech kar better rate milta hai — FPO join karein', url: null }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-700 mt-0.5 flex-shrink-0">{i+1}</span>
                    <p className="text-gray-600 font-medium leading-relaxed">
                      {item.tip}
                      {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 ml-1 font-bold">→</a>}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Real Image */}
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1595855759920-86582396756a?w=600&h=250&fit=crop" 
                alt="Indian crop market" 
                className="w-full h-36 object-cover"
              />
              <div className="bg-white p-4">
                <p className="text-xs font-bold text-primary-700">🏪 Mandi rates change daily</p>
                <p className="text-[11px] text-gray-400 mt-1">Har roz subah 8 baje check karein for best prices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
