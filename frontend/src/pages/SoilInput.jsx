import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SoilForm from '../components/SoilForm';
import UploadBox from '../components/UploadBox';
import VoiceButton from '../components/VoiceButton';
import { useSoil } from '../hooks/useSoil';

export default function SoilInput() {
  const [activeTab, setActiveTab] = useState('manual');
  const navigate = useNavigate();
  const { loading, analyze, getCrops, getFertilizer } = useSoil();

  const handleSubmit = async (data) => {
    const soilResult = await analyze(data);
    if (soilResult) {
      const cropResult = await getCrops(data);
      const fertResult = await getFertilizer({ ...data, crop: data.crop || 'General' });
      navigate('/analysis', {
        state: {
          soil: soilResult,
          crops: cropResult,
          fertilizer: fertResult,
          inputData: data
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          🧪 Soil Analysis
        </h1>
        <p className="text-gray-500 mt-2">Apni mitti ka data daalein ya report upload karein — AI analysis karega</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setActiveTab('manual')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'manual' ? 'bg-primary-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          ✍️ Manual Entry
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'upload' ? 'bg-primary-800 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          📤 Upload Report
        </button>
        <div className="ml-auto">
          <VoiceButton onResult={(text) => console.log('Voice:', text)} />
        </div>
      </div>

      <div className="card">
        {activeTab === 'manual' ? (
          <SoilForm onSubmit={handleSubmit} loading={loading} />
        ) : (
          <div className="space-y-6">
            <UploadBox onFileSelect={(file) => console.log('File:', file)} />
            <p className="text-center text-sm text-gray-500">
              PDF ya Image upload karein — AI automatically data extract karega (OCR)
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 card bg-primary-50 border-primary-200">
        <h3 className="font-bold text-primary-800 mb-3">💡 Soil Report Kahan Se Milega?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>📋 Nearest Krishi Vigyan Kendra (KVK) se free testing</li>
          <li>📋 Soil Health Card Portal — soilhealth.dac.gov.in</li>
          <li>📋 Agriculture office mein sample submit karein</li>
          <li>📋 Private labs — ₹200-500 mein full report</li>
        </ul>
      </div>
    </div>
  );
}
