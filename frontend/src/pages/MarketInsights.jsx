import { useState } from 'react';
import { useMarket } from '../hooks/useMarket';
import MarketCard from '../components/MarketCard';
import Loading from '../components/Loading';
import { Search } from 'lucide-react';

export default function MarketInsights() {
  const [form, setForm] = useState({ crop: '', location: '', currentPrice: '' });
  const { prediction, loading, predictPrice } = useMarket();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.crop && form.location) {
      predictPrice(form);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">📊 Market Insights</h1>
        <p className="text-gray-500 mt-2">Mandi price prediction — sell karein ya wait karein, AI batayega</p>
      </div>

      <div className="card mb-8">
        <h3 className="font-bold text-gray-800 mb-4">Crop & Location Daalein</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="label-text">🌾 Crop</label>
            <input
              type="text"
              value={form.crop}
              onChange={(e) => setForm({...form, crop: e.target.value})}
              placeholder="e.g. Wheat, Rice"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-text">📍 Location</label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({...form, location: e.target.value})}
              placeholder="e.g. Ahmedabad"
              className="input-field"
              required
            />
          </div>
          <div>
            <label className="label-text">💰 Current Price (₹/quintal)</label>
            <input
              type="number"
              value={form.currentPrice}
              onChange={(e) => setForm({...form, currentPrice: e.target.value})}
              placeholder="e.g. 2500"
              className="input-field"
            />
          </div>
          <div className="sm:col-span-3">
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
              {loading ? 'Predicting...' : '🔍 Get Market Prediction'}
            </button>
          </div>
        </form>
      </div>

      {loading && <Loading text="Market analysis kar raha hoon..." />}

      {prediction && !loading && (
        <div className="space-y-6 animate-fade-in">
          <div className="card">
            <h3 className="font-bold text-gray-800 mb-3">🤖 AI Market Analysis</h3>
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {prediction.prediction}
            </div>
          </div>

          <div className="card bg-primary-50 border-primary-200">
            <h3 className="font-bold text-primary-800 mb-2">💡 Quick Tips</h3>
            <ul className="text-sm text-primary-700 space-y-1">
              <li>• e-NAM portal pe online mandi prices check karein — enam.gov.in</li>
              <li>• MSP (Minimum Support Price) se neeche mat bechein</li>
              <li>• 2-3 mandis ka rate compare karein</li>
              <li>• Storage ho toh peak season avoid karein</li>
            </ul>
          </div>
        </div>
      )}

      {!prediction && !loading && (
        <div className="text-center py-16">
          <p className="text-6xl mb-4">📈</p>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Market Data Enter Karein</h3>
          <p className="text-gray-500">Crop aur location daalein — AI price prediction dega</p>
        </div>
      )}
    </div>
  );
}
