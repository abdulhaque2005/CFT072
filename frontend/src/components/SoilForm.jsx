import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FlaskConical, MapPin, Loader2, Sparkles } from 'lucide-react';

const soilSchema = z.object({
  nitrogen: z.coerce.number().min(0, 'Must be positive').max(1000),
  phosphorus: z.coerce.number().min(0, 'Must be positive').max(500),
  potassium: z.coerce.number().min(0, 'Must be positive').max(1000),
  ph: z.coerce.number().min(0).max(14, 'pH must be 0-14'),
  organicCarbon: z.coerce.number().min(0).max(10).optional(),
  location: z.string().min(2, 'Enter location').optional(),
  crop: z.string().optional()
});

export default function SoilForm({ onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(soilSchema),
    defaultValues: { nitrogen: '', phosphorus: '', potassium: '', ph: '', organicCarbon: '', location: '', crop: '' }
  });

  const fields = [
    { name: 'nitrogen', label: 'Nitrogen (N)', placeholder: 'e.g. 240 kg/ha', icon: '🟢' },
    { name: 'phosphorus', label: 'Phosphorus (P)', placeholder: 'e.g. 18 kg/ha', icon: '🔵' },
    { name: 'potassium', label: 'Potassium (K)', placeholder: 'e.g. 200 kg/ha', icon: '🟠' },
    { name: 'ph', label: 'pH Level', placeholder: 'e.g. 6.5', icon: '⚗️' },
    { name: 'organicCarbon', label: 'Organic Carbon (%)', placeholder: 'e.g. 0.65', icon: '🟤' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fields.map(field => (
          <div key={field.name}>
            <label className="label-text flex items-center gap-1.5">
              <span>{field.icon}</span> {field.label}
            </label>
            <input
              type="number"
              step="any"
              {...register(field.name)}
              placeholder={field.placeholder}
              className={`input-field ${errors[field.name] ? 'border-red-400 focus:border-red-500 focus:ring-red-100' : ''}`}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name].message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="label-text flex items-center gap-1.5">
            <MapPin className="w-4 h-4" /> Location
          </label>
          <input
            type="text"
            {...register('location')}
            placeholder="e.g. Ahmedabad, Gujarat"
            className="input-field"
          />
        </div>
        <div>
          <label className="label-text flex items-center gap-1.5">
            🌾 Crop (optional)
          </label>
          <input
            type="text"
            {...register('crop')}
            placeholder="e.g. Wheat, Rice"
            className="input-field"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-4">
        {loading ? (
          <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing...</>
        ) : (
          <><Sparkles className="w-5 h-5" /> Analyze Mitti — AI Analysis Shuru Karein</>
        )}
      </button>
    </form>
  );
}
