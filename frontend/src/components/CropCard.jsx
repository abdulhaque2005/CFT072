import { TrendingUp, Award, Droplets } from 'lucide-react';

const CROP_IMAGES = {
  wheat: 'https://images.pexels.com/photos/158827/field-corn-air-uh-158827.jpeg?auto=compress&cs=tinysrgb&w=600',
  rice: 'https://images.pexels.com/photos/1687063/pexels-photo-1687063.jpeg?auto=compress&cs=tinysrgb&w=600',
  maize: 'https://images.pexels.com/photos/1112048/pexels-photo-1112048.jpeg?auto=compress&cs=tinysrgb&w=600',
  cotton: 'https://images.pexels.com/photos/2568600/pexels-photo-2568600.jpeg?auto=compress&cs=tinysrgb&w=600',
  sugarcane: 'https://images.pexels.com/photos/3305597/pexels-photo-3305597.jpeg?auto=compress&cs=tinysrgb&w=600',
  gram: 'https://images.pexels.com/photos/30045/pexels-photo-30045.jpg?auto=compress&cs=tinysrgb&w=600',
  mustard: 'https://images.pexels.com/photos/3800049/pexels-photo-3800049.jpeg?auto=compress&cs=tinysrgb&w=600',
  soybean: 'https://images.pexels.com/photos/1120352/pexels-photo-1120352.jpeg?auto=compress&cs=tinysrgb&w=600',
  bajra: 'https://images.pexels.com/photos/1359336/pexels-photo-1359336.jpeg?auto=compress&cs=tinysrgb&w=600',
  jowar: 'https://images.pexels.com/photos/1321742/pexels-photo-1321742.jpeg?auto=compress&cs=tinysrgb&w=600',
  default: 'https://images.pexels.com/photos/2165688/pexels-photo-2165688.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const getCropImage = (name) => {
  if (!name) return CROP_IMAGES.default;
  const lowerName = name.toLowerCase();
  for (const [key, url] of Object.entries(CROP_IMAGES)) {
    if (lowerName.includes(key)) return url;
  }
  return CROP_IMAGES.default;
};

export default function CropCard({ rank, name, score, reason }) {
  const isTop = rank === 1;
  const bgColors = {
    1: 'bg-primary-50 border-primary-200',
    2: 'bg-blue-50 border-blue-200',
    3: 'bg-amber-50 border-amber-200'
  };

  const textColors = {
    1: 'text-primary-700',
    2: 'text-blue-700',
    3: 'text-amber-700'
  };

  const imageUrl = getCropImage(name);

  return (
    <div className={`bg-white rounded-2xl shadow-sm border-2 relative overflow-hidden transition-all hover:shadow-xl group flex flex-col ${bgColors[rank] || bgColors[3]}`}>
      <div className="h-40 w-full relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {isTop && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-primary-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <Award className="w-4 h-4 text-primary-600" /> Top Match
          </div>
        )}
        <h4 className="absolute bottom-3 left-4 text-2xl font-extrabold text-white drop-shadow-md">{name}</h4>
      </div>

      <div className="p-5 flex-grow flex flex-col">
        {score && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm font-bold mb-1.5">
              <span className={textColors[rank] || textColors[3]}>Suitability Score</span>
              <span className="text-gray-900 bg-white/50 px-2 py-0.5 rounded-md">{score}%</span>
            </div>
            <div className="h-2.5 bg-white/60 rounded-full overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-700 ${rank === 1 ? 'bg-primary-500' : rank === 2 ? 'bg-blue-500' : 'bg-amber-500'}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        )}

        {reason && (
          <p className="text-sm text-gray-700 leading-relaxed font-medium bg-white/60 p-3 rounded-xl border border-white/80 mt-auto shadow-sm">
            {reason}
          </p>
        )}
      </div>
    </div>
  );
}
