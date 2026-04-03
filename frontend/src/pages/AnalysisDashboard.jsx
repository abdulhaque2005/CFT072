import { useLocation, useNavigate } from 'react-router-dom';
import { Download, AlertTriangle, Cpu, Wheat, FlaskConical, Sprout } from 'lucide-react';
import SoilHealthCard from '../components/SoilHealthCard';
import CropCard from '../components/CropCard';
import FertilizerTable from '../components/FertilizerTable';
import SoilChart from '../components/SoilChart';

export default function AnalysisDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  if (!state || !state.soil) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Koi Data Nahi Mila</h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">Pahle apni mitti ka data upload karein ya manually enter karein analysis dekhne ke liye.</p>
        <button onClick={() => navigate('/soil-input')} className="bg-primary-900 text-white px-8 py-3 rounded-xl font-bold">
          Data Enter Karein
        </button>
      </div>
    );
  }

  const { soil: aiAnalysis, crops: cropData, fertilizer: fertData, inputData: originalData } = state;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-primary-700" /> AI Analysis Report
          </h1>
          <p className="text-gray-500 mt-2 font-medium">Aapki mitti ke data ka complete AI checkup</p>
        </div>
        <button className="bg-white border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-50 flex items-center gap-2 shadow-sm transition-all focus:ring-4 focus:ring-gray-100">
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-1 rounded-2xl shadow-sm border border-gray-100">
            <SoilHealthCard
              score={aiAnalysis?.score}
              soilType={aiAnalysis?.soilType}
              nutrients={aiAnalysis?.nutrientsStatus}
            />
          </div>
          
          <div className="mt-4">
            <SoilChart nutrients={{
              nitrogen: { value: originalData?.nitrogen || 0 },
              phosphorus: { value: originalData?.phosphorus || 0 },
              potassium: { value: originalData?.potassium || 0 },
              ph: { value: originalData?.ph || 0 }
            }} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Wheat className="w-6 h-6 text-primary-600" /> Best Crops
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {cropData?.topCrops?.length > 0 ? (
                cropData.topCrops.map((crop, i) => (
                  <CropCard key={i} rank={i + 1} name={crop.name} score={crop.score} reason={crop.reason} />
                ))
              ) : aiAnalysis?.suitableCrops?.length > 0 ? (
                aiAnalysis.suitableCrops.map((crop, i) => (
                  <CropCard key={i} rank={i + 1} name={crop.name} score={crop.score} reason={crop.reason} />
                ))
              ) : (
                <p className="text-gray-500 italic">No crop data generated.</p>
              )}
            </div>
            <div className="mt-6 text-right">
              <button onClick={() => navigate('/crops')} className="text-primary-700 font-bold text-sm hover:text-primary-800">
                View all crops →
              </button>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 flex items-center gap-2 pb-4 border-b border-gray-100">
              <Sprout className="w-6 h-6 text-primary-600" /> Quick Fertilizer Plan
            </h2>
            <FertilizerTable quickReference={fertData?.requirements || aiAnalysis?.fertilizerRecommendations} />
            <div className="mt-6 text-right">
              <button onClick={() => navigate('/fertilizer')} className="text-primary-700 font-bold text-sm hover:text-primary-800">
                View detailed plan →
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
