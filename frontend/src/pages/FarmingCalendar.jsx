import { useState, useEffect } from 'react';
import { CalendarDays, MapPin, Sprout, Sun, CloudRain, Snowflake, RefreshCw, Wheat } from 'lucide-react';
import { getCalendar } from '../services/calendarApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';

const CROP_OPTIONS = ['Wheat', 'Rice', 'Cotton', 'Maize', 'Soybean', 'Gram', 'Mustard', 'Bajra', 'Groundnut', 'Moong'];

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 6 && month <= 10) return { name: 'Kharif', icon: CloudRain, color: 'text-blue-600', bg: 'bg-blue-50', desc: 'Monsoon season crops', tips: ['Prepare seeds before the monsoon starts', 'Ensure proper drainage arrangements', 'Sow Soybean/Cotton in June', 'Avoid waterlogging — use raised beds'] };
  if (month >= 11 || month <= 3) return { name: 'Rabi', icon: Snowflake, color: 'text-cyan-600', bg: 'bg-cyan-50', desc: 'Winter season crops', tips: ['Complete wheat sowing by November', 'Use light irrigation to prevent frost damage', 'Spray for aphids in mustard crops', 'Watch for pod borer in gram'] };
  return { name: 'Zaid', icon: Sun, color: 'text-amber-600', bg: 'bg-amber-50', desc: 'Summer season crops', tips: ['Sow Moong/Urad in March-April', 'Manage water usage properly', 'Use mulching to preserve soil moisture', 'Select short-duration crops'] };
}

export default function FarmingCalendar() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const { city, state, locationText, loading: locLoading } = useLocation();

  const season = getCurrentSeason();
  const SeasonIcon = season.icon;
  const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!locLoading) loadCalendar();
  }, [locLoading]);

  const loadCalendar = async (crop) => {
    try {
      setLoading(true);
      setError('');
      const res = await getCalendar({ crop: crop || selectedCrop, season: season.name, location: locationText || 'India' });
      // interceptor strips response.data → res = { success, data, message }
      const payload = res.data || res;
      setData(payload);
    } catch (err) {
      setError(err.message || 'Calendar generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCropChange = (crop) => {
    setSelectedCrop(crop);
    loadCalendar(crop);
  };

  if (locLoading || loading) return <Loading text={`Building ${selectedCrop} farming calendar...`} />;
  if (error) return <Error message={error} onRetry={() => loadCalendar()} />;
  if (!data) return null;

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1592982537447-6f23fcf93eb9?auto=format&fit=crop&w=1200&h=400&q=80" alt="Farm Calendar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-900/85 via-primary-800/70 to-[#f8faf8]"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary-300" />
            <span className="text-primary-200 text-sm font-medium">{locationText}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 flex items-center gap-3">
            <CalendarDays className="w-9 h-9" /> Farming Calendar
          </h1>
          <p className="text-primary-200 text-lg font-medium mb-6">Complete farming schedule — sowing to harvest</p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-lg">
            <div className={`${season.bg} rounded-2xl p-4 border border-white/50`}>
              <div className="flex items-center gap-2 mb-1">
                <SeasonIcon className={`w-5 h-5 ${season.color}`} />
                <span className={`text-sm font-bold ${season.color}`}>{season.name} Season</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">{season.desc}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20">
              <p className="text-white font-bold text-sm">{todayStr}</p>
              <p className="text-primary-200 text-xs font-medium mt-1">Schedule based on today's date</p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Wheat className="w-4 h-4" /> Select a Crop — Calendar Will Update
          </p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
            {CROP_OPTIONS.map(crop => (
              <button key={crop} onClick={() => handleCropChange(crop)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all flex-shrink-0 ${selectedCrop === crop ? 'bg-primary-800 text-white shadow-lg shadow-primary-800/25' : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100'}`}>
                {crop}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                <Sprout className="w-6 h-6 text-primary-600" /> {selectedCrop} — Complete Calendar
              </h2>
              <button onClick={() => loadCalendar()} className="text-sm text-primary-600 font-bold flex items-center gap-1 hover:text-primary-800">
                <RefreshCw className="w-4 h-4" /> Refresh
              </button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed font-medium text-sm max-h-[600px] overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
                {typeof data.calendar === 'string' ? data.calendar : "Calendar generation failed. Please retry."}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 text-white">
              <h3 className="font-extrabold text-lg mb-4">Today's Action Plan</h3>
              <div className="space-y-3">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-primary-300 font-bold uppercase mb-1">Season</p>
                  <p className="text-sm font-medium">{season.name} — {season.desc}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-primary-300 font-bold uppercase mb-1">Selected Crop</p>
                  <p className="text-sm font-bold">{selectedCrop}</p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-xs text-primary-300 font-bold uppercase mb-1">Location</p>
                  <p className="text-sm font-medium">{locationText}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <h3 className="text-base font-extrabold text-gray-900 mb-4">🌾 {season.name} Season Tips</h3>
              <div className="space-y-3">
                {season.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-5 h-5 bg-primary-50 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-700 mt-0.5 flex-shrink-0">{i+1}</span>
                    <p className="text-gray-600 font-medium leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=250&fit=crop" alt="Farming activities" className="w-full h-36 object-cover" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
