export default function SoilHealthCard({ score, soilType, nutrients }) {
  const getScoreColor = (s) => {
    if (s >= 75) return { color: '#22c55e', label: 'Excellent', bg: 'bg-green-50' };
    if (s >= 50) return { color: '#f59e0b', label: 'Average', bg: 'bg-yellow-50' };
    return { color: '#ef4444', label: 'Poor', bg: 'bg-red-50' };
  };

  const scoreInfo = getScoreColor(score || 0);
  const circumference = 2 * Math.PI * 52;
  const offset = circumference - ((score || 0) / 100) * circumference;

  return (
    <div className="card text-center">
      <h3 className="text-lg font-bold text-gray-800 mb-4">🌱 Soil Health Score</h3>

      <div className="relative w-36 h-36 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="10" />
          <circle
            cx="60" cy="60" r="52" fill="none"
            stroke={scoreInfo.color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color: scoreInfo.color }}>{score || 0}</span>
          <span className="text-xs text-gray-500 font-medium">/100</span>
        </div>
      </div>

      <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${scoreInfo.bg}`} style={{ color: scoreInfo.color }}>
        {scoreInfo.label}
      </div>

      {soilType && (
        <p className="mt-3 text-sm text-gray-600">
          Soil Type: <span className="font-semibold text-gray-800">{soilType}</span>
        </p>
      )}

      {nutrients && (
        <div className="mt-4 space-y-2">
          {Object.entries(nutrients).map(([key, data]) => (
            <div key={key} className="flex items-center justify-between text-sm px-2">
              <span className="text-gray-600 capitalize">{key}</span>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min((data.value / 400) * 100, 100)}%`,
                      backgroundColor: data.level === 'High' ? '#22c55e' : data.level === 'Medium' ? '#f59e0b' : '#ef4444'
                    }}
                  />
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  data.level === 'High' ? 'bg-green-100 text-green-700' :
                  data.level === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {data.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
