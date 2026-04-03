import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function MarketCard({ crop, price, trend, recommendation }) {
  const trendConfig = {
    up: { icon: <TrendingUp className="w-5 h-5" />, color: 'text-green-600', bg: 'bg-green-50', label: '📈 Price Badhega' },
    down: { icon: <TrendingDown className="w-5 h-5" />, color: 'text-red-600', bg: 'bg-red-50', label: '📉 Price Girega' },
    stable: { icon: <Minus className="w-5 h-5" />, color: 'text-yellow-600', bg: 'bg-yellow-50', label: '➡️ Stable' }
  };

  const t = trendConfig[trend] || trendConfig.stable;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-lg font-bold text-gray-800">🌾 {crop}</h4>
        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${t.bg} ${t.color}`}>
          {t.icon} {t.label}
        </span>
      </div>

      {price && (
        <div className="mb-3">
          <span className="text-3xl font-extrabold text-primary-800">₹{price}</span>
          <span className="text-sm text-gray-500 ml-1">/quintal</span>
        </div>
      )}

      {recommendation && (
        <div className="mt-3 p-3 bg-primary-50 rounded-xl">
          <p className="text-sm font-medium text-primary-800">💡 {recommendation}</p>
        </div>
      )}
    </div>
  );
}
