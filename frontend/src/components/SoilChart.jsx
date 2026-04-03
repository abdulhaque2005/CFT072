import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function SoilChart({ nutrients }) {
  if (!nutrients) return null;

  const data = [
    { name: 'Nitrogen (N)', value: nutrients.nitrogen?.value || 0, fill: '#3b82f6', max: 400 },
    { name: 'Phosphorus (P)', value: nutrients.phosphorus?.value || 0, fill: '#8b5cf6', max: 100 },
    { name: 'Potassium (K)', value: nutrients.potassium?.value || 0, fill: '#f59e0b', max: 400 },
    { name: 'pH Level', value: nutrients.ph?.value || 0, fill: '#ec4899', max: 14 }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-100 scale-105">
          <p className="font-extrabold text-gray-900 mb-1">{label}</p>
          <p style={{ color: payload[0].fill }} className="font-bold text-lg">
            {payload[0].value} {label === 'pH Level' ? '' : 'kg/ha'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
      <h3 className="text-xl font-extrabold text-gray-900 mb-4 tracking-wide uppercase text-center">
        Soil Nutrient Levels
      </h3>
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12, fontWeight: 700 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(232, 245, 233, 0.5)' }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={50} animationDuration={1500}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-center text-xs text-gray-400 font-bold tracking-widest mt-2 uppercase">
        Visual Data Representation Built for Farmers
      </p>
    </div>
  );
}
