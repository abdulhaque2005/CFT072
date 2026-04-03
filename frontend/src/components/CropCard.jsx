import { TrendingUp } from 'lucide-react';

export default function CropCard({ rank, name, score, reason, emoji }) {
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' };
  const bgColors = {
    1: 'from-primary-50 to-green-50 border-primary-200',
    2: 'from-blue-50 to-cyan-50 border-blue-200',
    3: 'from-amber-50 to-orange-50 border-amber-200'
  };

  return (
    <div className={`card bg-gradient-to-br ${bgColors[rank] || bgColors[3]} border-2 relative overflow-hidden`}>
      <div className="absolute top-3 right-3 text-3xl">{medals[rank] || '🌿'}</div>
      <div className="text-4xl mb-3">{emoji || '🌱'}</div>
      <h4 className="text-lg font-bold text-gray-800">{name}</h4>

      {score && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex-1 h-2.5 bg-white/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 rounded-full transition-all duration-700"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-sm font-bold text-primary-800">{score}%</span>
        </div>
      )}

      {reason && (
        <p className="mt-3 text-sm text-gray-600 leading-relaxed">{reason}</p>
      )}

      <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary-700">
        <TrendingUp className="w-3.5 h-3.5" /> Suitability Score
      </div>
    </div>
  );
}
