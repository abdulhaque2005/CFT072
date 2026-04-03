import { TrendingUp, Award, Droplets } from 'lucide-react';

const CROP_IMAGES = {
  wheat: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
  rice: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&w=800&q=80',
  maize: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80',
  cotton: 'https://images.unsplash.com/photo-1590483864197-0ec997a39833?auto=format&fit=crop&w=800&q=80',
  sugarcane: 'https://images.unsplash.com/photo-1596752718105-d326ccbc126f?auto=format&fit=crop&w=800&q=80',
  gram: 'https://images.unsplash.com/photo-1599557451369-0260afad9d19?auto=format&fit=crop&w=800&q=80',
  mustard: 'https://images.unsplash.com/photo-1616422329764-9dfcffc2bc4a?auto=format&fit=crop&w=800&q=80',
  soybean: 'https://images.unsplash.com/photo-1598284699564-9eb51e8adbc5?auto=format&fit=crop&w=800&q=80',
  bajra: 'https://images.unsplash.com/photo-1535405814088-7eecd04e4ecb?auto=format&fit=crop&w=800&q=80',
  jowar: 'https://images.unsplash.com/photo-1582239634952-b8d960f2bb97?auto=format&fit=crop&w=800&q=80',
  potato: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=800&q=80',
  tomato: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
  default: 'https://images.unsplash.com/photo-1599839619711-2eb2ce0ab0eb?auto=format&fit=crop&w=800&q=80'
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
