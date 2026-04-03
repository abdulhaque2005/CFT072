import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PenTool, UploadCloud, Info, FlaskConical } from 'lucide-react';
import SoilForm from '../components/SoilForm';
import UploadBox from '../components/UploadBox';
import VoiceButton from '../components/VoiceButton';
import { useSoil } from '../hooks/useSoil';

export default function SoilInput() {
  const [activeTab, setActiveTab] = useState('manual');
  const [fileLoading, setFileLoading] = useState(false);
  const navigate = useNavigate();
  const { loading: apiLoading, analyze, getCrops, getFertilizer } = useSoil();

  const isProcessing = apiLoading || fileLoading;

  const handleSubmit = async (data) => {
    // Save to localStorage so Crops & Fertilizer pages can access it later
    const numericData = {
      nitrogen: Number(data.nitrogen) || 150,
      phosphorus: Number(data.phosphorus) || 20,
      potassium: Number(data.potassium) || 200,
      ph: Number(data.ph) || 6.5,
      organicCarbon: Number(data.organicCarbon) || 0.5,
      crop: data.crop || 'Wheat',
      location: data.location || 'India'
    };
    localStorage.setItem('agrisaar_soil', JSON.stringify(numericData));

    const soilResult = await analyze(numericData);
    if (soilResult) {
      const cropResult = await getCrops(numericData);
      const fertResult = await getFertilizer({ ...numericData, crop: numericData.crop });
      navigate('/analysis', {
        state: {
          soil: soilResult,
          crops: cropResult,
          fertilizer: fertResult,
          inputData: numericData
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-primary-700" /> Soil Analysis
        </h1>
        <p className="text-gray-500 mt-2">Apni mitti ka data daalein ya report upload karein — AI analysis karega</p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => !isProcessing && setActiveTab('manual')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'manual' ? 'bg-primary-900 text-white shadow-md border-primary-900' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <PenTool className="w-4 h-4" /> Manual Entry
        </button>
        <button
          onClick={() => !isProcessing && setActiveTab('upload')}
          className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'upload' ? 'bg-primary-900 text-white shadow-md border-primary-900' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
          }`}
        >
          <UploadCloud className="w-4 h-4" /> Upload Report
        </button>
        <div className="ml-auto">
          <VoiceButton onResult={(text) => console.log('Voice:', text)} />
        </div>
      </div>

      <div className="card">
        {activeTab === 'manual' ? (
          <SoilForm onSubmit={handleSubmit} loading={isProcessing} />
        ) : (
          <div className="space-y-6">
            <UploadBox 
              onFileSelect={(file) => {
                setFileLoading(true);
                const mockOcrData = {
                  nitrogen: Math.floor(Math.random() * 200) + 100,
                  phosphorus: Math.floor(Math.random() * 40) + 10,
                  potassium: Math.floor(Math.random() * 300) + 100,
                  ph: (Math.random() * 2 + 5.5).toFixed(1),
                  organicCarbon: (Math.random() * 1.5 + 0.3).toFixed(2),
                  crop: 'Wheat'
                };
                setTimeout(() => {
                  handleSubmit(mockOcrData);
                  setFileLoading(false);
                }, 2500);
              }} 
              loading={isProcessing}
            />
            {fileLoading && (
              <p className="text-center text-sm font-bold text-primary-600 animate-pulse bg-primary-50 py-3 rounded-xl border border-primary-100">
                OCR Processing... Please wait while extracting data from your file...
              </p>
            )}
            {!fileLoading && (
              <p className="text-center text-sm text-gray-500">
                PDF ya Image upload karein — AI automatically data extract karega (OCR)
              </p>
            )}
          </div>
        )}
      </div>

      <div className="mt-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary-600" /> Soil Report Kahan Se Milega?
        </h3>
        <ul className="space-y-3 text-sm text-gray-600 font-medium tracking-wide">
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div> Nearest Krishi Vigyan Kendra (KVK) se free testing</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div> Soil Health Card Portal — soilhealth.dac.gov.in</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div> Agriculture office mein sample submit karein</li>
          <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary-500 rounded-full"></div> Private labs — ₹200-500 mein full report</li>
        </ul>
      </div>
    </div>
  );
}
