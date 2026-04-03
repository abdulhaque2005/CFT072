import { useState } from 'react';
import CropCard from '../components/CropCard';
import SoilForm from '../components/SoilForm';
import Loading from '../components/Loading';
import { useSoil } from '../hooks/useSoil';

export default function CropRecommendations() {
  const { cropResult, loading, getCrops } = useSoil();
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (data) => {
    await getCrops(data);
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">🌾 Crop Recommendations</h1>
        <p className="text-gray-500 mt-2">AI aapki mitti ke hisaab se best fasal batayega</p>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Soil Data Enter Karein</h3>
          <SoilForm onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {loading && <Loading text="Best crops dhundh raha hoon..." />}

      {cropResult && !loading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">AI Recommendations</h3>
              <p className="text-sm text-gray-500">Season: {cropResult.season} | Location: {cropResult.location}</p>
            </div>
            <button onClick={() => setShowForm(!showForm)} className="btn-secondary text-sm">
              {showForm ? 'Hide Form' : '🔄 Naya Analysis'}
            </button>
          </div>

          <div className="card">
            <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
              {cropResult.recommendation}
            </div>
          </div>
        </div>
      )}

      {!cropResult && !loading && !showForm && (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🌾</p>
          <p className="text-gray-500">Soil data daalein toh crop recommendation milegi</p>
        </div>
      )}
    </div>
  );
}
