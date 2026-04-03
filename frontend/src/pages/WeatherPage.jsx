import { useState } from 'react';
import { useWeather } from '../hooks/useWeather';
import WeatherAlert from '../components/WeatherAlert';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Search, Thermometer, Droplets, Wind, Eye } from 'lucide-react';

export default function WeatherPage() {
  const [location, setLocation] = useState('');
  const [searchLoc, setSearchLoc] = useState('');
  const { weather, loading, error, fetchWeather } = useWeather(searchLoc);

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim()) setSearchLoc(location.trim());
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">🌧️ Weather Advisory</h1>
        <p className="text-gray-500 mt-2">Mausam ke hisaab se farming advice — AI powered</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location likhein — e.g. Ahmedabad, Jaipur, Lucknow"
            className="input-field pl-12"
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Loading...' : '🔍 Search'}
        </button>
      </form>

      {loading && <Loading text="Weather data la raha hoon..." />}
      {error && <Error message={error} onRetry={() => fetchWeather(searchLoc)} />}

      {weather && !loading && (
        <div className="space-y-6 animate-fade-in">
          {weather.current && (
            <div className="card gradient-bg text-white">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-primary-200 text-sm font-medium mb-1">📍 {weather.location}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl font-extrabold">{Math.round(weather.current.temp)}°</span>
                    <div>
                      <p className="text-lg font-semibold capitalize">{weather.current.description}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-primary-100">
                    <Droplets className="w-4 h-4" />
                    <span className="text-sm">{weather.current.humidity}% Humidity</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary-100">
                    <Wind className="w-4 h-4" />
                    <span className="text-sm">{weather.current.wind} m/s Wind</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {weather.forecast && weather.forecast.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-gray-800 mb-4">📅 Forecast</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {weather.forecast.slice(0, 8).map((f, i) => (
                  <div key={i} className="bg-primary-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-gray-500 mb-1">
                      {new Date(f.time).toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xl font-bold text-primary-800">{Math.round(f.temp)}°</p>
                    <p className="text-xs text-gray-600 capitalize">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">🤖 AI Farming Advisory</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {weather.advisory}
            </div>
          </div>
        </div>
      )}

      {!weather && !loading && !error && (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🌤️</p>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Location Search Karein</h3>
          <p className="text-gray-500">Apna city ya village name likhein — weather + farming advice milegi</p>
        </div>
      )}
    </div>
  );
}
