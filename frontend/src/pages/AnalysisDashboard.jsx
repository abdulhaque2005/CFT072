import { useLocation, Link } from 'react-router-dom';
import SoilHealthCard from '../components/SoilHealthCard';
import FertilizerTable from '../components/FertilizerTable';
import { ArrowRight, FileText } from 'lucide-react';

export default function AnalysisDashboard() {
  const location = useLocation();
  const { soil, crops, fertilizer, inputData } = location.state || {};

  if (!soil) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🧪</p>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Pehle Soil Analysis Karein</h2>
        <p className="text-gray-500 mb-6">Mitti ka data daalein, phir yahan result dikhega</p>
        <Link to="/soil-input" className="btn-primary inline-flex">
          Go to Soil Input <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">📊 Analysis Dashboard</h1>
        <p className="text-gray-500 mt-2">Aapki mitti ka complete AI analysis</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1">
          <SoilHealthCard
            score={soil.healthScore}
            soilType={soil.soilType}
            nutrients={soil.nutrients}
          />
        </div>

        <div className="lg:col-span-2 card">
          <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-600" /> AI Analysis
          </h3>
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {soil.analysis}
          </div>
        </div>
      </div>

      {fertilizer && (
        <div className="mb-8">
          <FertilizerTable quickReference={fertilizer.quickReference} />
          {fertilizer.plan && (
            <div className="card mt-4">
              <h3 className="font-bold text-gray-800 mb-3">🧪 Detailed Fertilizer Plan</h3>
              <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{fertilizer.plan}</div>
            </div>
          )}
        </div>
      )}

      {crops && (
        <div className="card mb-8">
          <h3 className="font-bold text-gray-800 mb-3">🌾 Crop Recommendations</h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{crops.recommendation}</div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/weather" className="card text-center hover:border-primary-400 group">
          <span className="text-3xl">🌧️</span>
          <p className="font-bold text-gray-800 mt-2 group-hover:text-primary-800">Weather Advisory</p>
        </Link>
        <Link to="/market" className="card text-center hover:border-primary-400 group">
          <span className="text-3xl">📊</span>
          <p className="font-bold text-gray-800 mt-2 group-hover:text-primary-800">Market Insights</p>
        </Link>
        <Link to="/schemes" className="card text-center hover:border-primary-400 group">
          <span className="text-3xl">💰</span>
          <p className="font-bold text-gray-800 mt-2 group-hover:text-primary-800">Govt Schemes</p>
        </Link>
      </div>
    </div>
  );
}
