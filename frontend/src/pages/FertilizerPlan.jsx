import { useState } from 'react';
import FertilizerTable from '../components/FertilizerTable';
import SoilForm from '../components/SoilForm';
import Loading from '../components/Loading';
import { useSoil } from '../hooks/useSoil';

export default function FertilizerPlan() {
  const { fertilizerResult, loading, getFertilizer } = useSoil();
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (data) => {
    await getFertilizer({ ...data, crop: data.crop || 'Wheat' });
    setShowForm(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">🌱 Fertilizer Plan</h1>
        <p className="text-gray-500 mt-2">AI batayega — kaunsa fertilizer, kitna, aur kab daalein</p>
      </div>

      {showForm && (
        <div className="card mb-8">
          <h3 className="font-bold text-gray-800 mb-4">Soil Data + Crop Name Daalein</h3>
          <SoilForm onSubmit={handleSubmit} loading={loading} />
        </div>
      )}

      {loading && <Loading text="Fertilizer plan bana raha hoon..." />}

      {fertilizerResult && !loading && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800">📋 Your Fertilizer Plan</h3>
            <button onClick={() => setShowForm(!showForm)} className="btn-secondary text-sm">
              {showForm ? 'Hide Form' : '🔄 Naya Plan'}
            </button>
          </div>

          <FertilizerTable quickReference={fertilizerResult.quickReference} />

          {fertilizerResult.plan && (
            <div className="card mt-6">
              <h3 className="font-bold text-gray-800 mb-3">🤖 AI Detailed Plan</h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {fertilizerResult.plan}
              </div>
            </div>
          )}

          <div className="card mt-6 bg-amber-50 border-amber-200">
            <h3 className="font-bold text-amber-800 mb-2">⚠️ Safety Reminders</h3>
            <ul className="text-sm text-amber-700 space-y-1">
              <li>• Zyada fertilizer mat daalein — soil damage hoga</li>
              <li>• Baarish mein fertilizer mat do — wash ho jayega</li>
              <li>• Split doses mein daalein (2-3 parts)</li>
              <li>• Organic khad bhi zaroor mix karein</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
