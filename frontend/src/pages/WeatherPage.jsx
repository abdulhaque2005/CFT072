import { useState, useEffect } from 'react';
import { CloudSun, Droplets, Wind, AlertTriangle, CheckCircle2, MapPin, RefreshCw, Thermometer, Eye, Gauge, Sunrise, Sunset, Loader2 } from 'lucide-react';
import { getWeatherByCoords } from '../services/weatherApi';
import useLocation from '../hooks/useLocation';
import Loading from '../components/Loading';
import Error from '../components/Error';
import SpeakButton from '../components/SpeakButton';

const WEATHER_BACKGROUNDS = {
  clear: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=600&fit=crop',
  clouds: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1200&h=600&fit=crop',
  rain: 'https://images.unsplash.com/photo-1428592953211-077101b2021b?w=1200&h=600&fit=crop',
  storm: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=1200&h=600&fit=crop',
  default: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=600&fit=crop'
};

function getWeatherBg(description) {
  if (!description) return WEATHER_BACKGROUNDS.default;
  const d = description.toLowerCase();
  if (d.includes('rain') || d.includes('drizzle') || d.includes('baarish')) return WEATHER_BACKGROUNDS.rain;
  if (d.includes('cloud') || d.includes('badal') || d.includes('overcast')) return WEATHER_BACKGROUNDS.clouds;
  if (d.includes('storm') || d.includes('thunder')) return WEATHER_BACKGROUNDS.storm;
  if (d.includes('clear') || d.includes('sunny') || d.includes('saaf')) return WEATHER_BACKGROUNDS.clear;
  return WEATHER_BACKGROUNDS.default;
}

export default function WeatherPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { lat, lon, city, state, locationText, loading: locLoading, error: locError, refresh: refreshLocation } = useLocation();

  useEffect(() => {
    if (!locLoading && lat && lon) {
      loadWeather();
    }
  }, [locLoading, lat, lon]);

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getWeatherByCoords(lat, lon, locationText);
      // interceptor strips response.data → res = { success, data, message }
      const payload = res.data || res;
      setData(payload);
    } catch (err) {
      setError(err.message || 'Weather data fetch failed');
    } finally {
      setLoading(false);
    }
  };

  if (locLoading || loading) return <Loading text="Detecting your location and fetching weather data..." />;
  if (error) return <Error message={error} onRetry={loadWeather} />;
  if (!data) return null;

  const current = data.current;
  const forecast = data.forecast || [];
  const bgImage = getWeatherBg(current?.description);

  return (
    <div className="min-h-screen bg-[#f8faf8]">
      {/* Hero Weather Card with Background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={bgImage} alt="Weather background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/80 via-blue-800/60 to-[#f8faf8]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-20">
          {/* Location Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">{city || 'Detecting...'}</h2>
                <p className="text-blue-200 text-sm font-medium">{state}{locError ? ` • ${locError}` : ''}</p>
              </div>
            </div>
            <button onClick={() => { refreshLocation(); setTimeout(loadWeather, 2000); }} className="flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-white/25 transition-all border border-white/20">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>

          {/* Main Temperature Display */}
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-blue-200 text-sm font-bold uppercase tracking-wider mb-2">Current Weather</p>
              <div className="flex items-center gap-4 mb-4">
                {current?.icon && <img src={current.icon} alt="weather" className="w-24 h-24 drop-shadow-2xl" />}
                <div>
                  <span className="text-7xl font-extrabold text-white drop-shadow-md">{current?.temp || '--'}°</span>
                  <span className="text-2xl text-blue-200 ml-1">C</span>
                </div>
              </div>
              <p className="text-xl text-white capitalize font-semibold mb-1">{current?.description || 'Data loading...'}</p>
              {current?.feelsLike && (
                <p className="text-blue-200 text-sm font-medium">Feels like {current.feelsLike}°C</p>
              )}
            </div>

            {/* Weather Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Droplets, label: 'Humidity', value: `${current?.humidity || '--'}%`, color: 'text-cyan-300' },
                { icon: Wind, label: 'Wind', value: `${current?.wind || '--'} km/h`, color: 'text-emerald-300' },
                { icon: Gauge, label: 'Pressure', value: current?.pressure ? `${current.pressure} hPa` : '--', color: 'text-amber-300' },
                { icon: Eye, label: 'Visibility', value: current?.visibility ? `${current.visibility} km` : '--', color: 'text-purple-300' }
              ].map((stat, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15">
                  <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                  <p className="text-white/60 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-white font-extrabold text-lg">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5-Day Forecast Horizontal Scroll */}
      {forecast.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 mb-10">
          <h2 className="text-lg font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-blue-600" /> 5-Din ka Forecast
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
            {forecast.map((day, i) => (
              <div key={i} className="min-w-[160px] bg-white rounded-2xl p-5 shadow-lg border border-blue-50 flex-shrink-0 hover:shadow-xl transition-shadow hover:-translate-y-1 transform duration-200">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">{day.dayName}</p>
                <p className="text-[11px] text-gray-400 font-medium mb-3">{new Date(day.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                {day.icon && <img src={day.icon} alt={day.description} className="w-14 h-14 mx-auto mb-2" />}
                <div className="text-center mb-2">
                  <span className="text-2xl font-extrabold text-gray-900">{day.tempMax}°</span>
                  <span className="text-sm text-gray-400 ml-1">/ {day.tempMin}°</span>
                </div>
                <p className="text-xs text-gray-500 capitalize text-center font-medium truncate">{day.description}</p>
                <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between text-[11px] text-gray-400 font-semibold">
                  <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{day.humidity}%</span>
                  <span className="flex items-center gap-1"><Wind className="w-3 h-3" />{day.wind} km/h</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Advisory Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid lg:grid-cols-5 gap-8">
          {/* AI Advisory - Takes more space */}
          <div className="lg:col-span-3">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-primary-600" /> AI Farming Advisory
              </span>
              {data.advisory && <SpeakButton text={data.advisory} label="🔊 Listen" />}
            </h2>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-gray-700 leading-relaxed font-medium">
                {data.advisory || "No advisory available."}
              </div>
            </div>

            {(!data.advisory) && (
              <div className="mt-4 bg-green-50 text-green-800 p-6 border border-green-200 rounded-2xl flex items-center gap-3 shadow-sm">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                <span className="font-bold">Mausam bilkul saaf hai. Normal farming shuru rakhein.</span>
              </div>
            )}
          </div>

          {/* Crop Impact Sidebar */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
              🌾 Aaj ka Crop Impact
            </h2>
            <div className="bg-gradient-to-br from-primary-800 to-primary-900 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 opacity-10">
                <CloudSun className="w-32 h-32" />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-primary-200 text-xs font-bold uppercase mb-1">Temperature Impact</p>
                  <p className="text-sm font-medium">
                    {current?.temp > 40 ? '⚠️ Heat wave alert — ensure irrigation and use mulching' :
                      current?.temp > 35 ? '☀️ High temperature — irrigate early morning' :
                        current?.temp < 10 ? '❄️ Cold temperatures — use frost protection for crops' :
                          current?.temp < 20 ? '🌡️ Cool weather — ideal for Rabi crops' :
                            '✅ Temperature is perfect for farming'}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-primary-200 text-xs font-bold uppercase mb-1">Humidity Impact</p>
                  <p className="text-sm font-medium">
                    {current?.humidity > 85 ? '⚠️ Very high humidity — risk of fungal disease, apply preventive spray' :
                      current?.humidity > 70 ? '💧 Good humidity — reduce irrigation frequency' :
                        current?.humidity < 30 ? '🏜️ Dry air — increase irrigation' :
                          '✅ Humidity level is normal'}
                  </p>
                </div>
                <div className="bg-white/10 rounded-xl p-4 border border-white/10">
                  <p className="text-primary-200 text-xs font-bold uppercase mb-1">Best Action</p>
                  <p className="text-sm font-bold">
                    {current?.temp > 35 ? '💧 Best time for irrigation: 5-7 AM' :
                      '🌾 Continue normal farming routine'}
                  </p>
                </div>
              </div>
            </div>

            {/* Real Farming Image */}
            <div className="mt-6 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
              <img
                src="https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=600&h=300&fit=crop"
                alt="Indian farmer in field"
                className="w-full h-40 object-cover"
              />
              <div className="bg-white p-4">
                <p className="text-xs font-bold text-primary-700 uppercase">Location</p>
                <p className="text-sm font-semibold text-gray-700">{locationText}</p>
                <p className="text-[11px] text-gray-400 mt-1">Last updated: {data.timestamp ? new Date(data.timestamp).toLocaleString('en-IN') : 'Just now'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
