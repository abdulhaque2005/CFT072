import { CloudRain, Wind, Thermometer, Droplets, AlertTriangle } from 'lucide-react';

export default function WeatherAlert({ advisory, type }) {
  const typeStyles = {
    rain: { icon: <CloudRain className="w-5 h-5" />, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800' },
    heat: { icon: <Thermometer className="w-5 h-5" />, bg: 'bg-red-50 border-red-200', text: 'text-red-800' },
    storm: { icon: <Wind className="w-5 h-5" />, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800' },
    warning: { icon: <AlertTriangle className="w-5 h-5" />, bg: 'bg-orange-50 border-orange-200', text: 'text-orange-800' },
    default: { icon: <Droplets className="w-5 h-5" />, bg: 'bg-primary-50 border-primary-200', text: 'text-primary-800' }
  };

  const style = typeStyles[type] || typeStyles.default;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-xl border-2 ${style.bg} animate-fade-in`}>
      <div className={`mt-0.5 ${style.text}`}>{style.icon}</div>
      <p className={`text-sm font-medium leading-relaxed ${style.text}`}>{advisory}</p>
    </div>
  );
}
