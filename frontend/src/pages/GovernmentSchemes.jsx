import { useState } from 'react';
import SchemeCard from '../components/SchemeCard';
import Loading from '../components/Loading';
import { findSchemes } from '../services/schemeApi';
import toast from 'react-hot-toast';

const defaultSchemes = [
  { name: 'PM-Kisan Samman Nidhi', benefit: '₹6000/year direct bank transfer', eligibility: 'Small & marginal farmers', url: 'https://pmkisan.gov.in', applySteps: ['Apne village ke patwari se milein', 'Aadhaar, bank passbook lekar jaayein', 'Form bharein ya pmkisan.gov.in pe online apply karein'] },
  { name: 'Soil Health Card Scheme', benefit: 'Free soil testing + health card', eligibility: 'All farmers', url: 'https://soilhealth.dac.gov.in', applySteps: ['Nearest KVK mein jaayein', 'Soil sample dein', '2-3 hafte mein card milega'] },
  { name: 'PM Fasal Bima Yojana', benefit: 'Crop insurance at low premium', eligibility: 'All farmers growing notified crops', url: 'https://pmfby.gov.in', applySteps: ['Bank branch mein jaayein', 'Crop details aur land papers dein', 'Premium pay karein (2% Kharif, 1.5% Rabi)'] },
  { name: 'Kisan Credit Card', benefit: 'Low-interest loan up to ₹3 lakh', eligibility: 'All farmers', url: 'https://www.nabard.org', applySteps: ['Bank mein application dein', 'Land papers + ID proof dein', '2-3 weeks mein card milega'] },
  { name: 'PM Krishi Sinchai Yojana', benefit: 'Drip/sprinkler irrigation subsidy', eligibility: 'Farmers with irrigation needs', url: 'https://pmksy.gov.in', applySteps: ['District agriculture office mein apply karein', 'Quotation aur land papers submit karein', '50-90% subsidy milegi'] },
  { name: 'e-NAM', benefit: 'Online mandi trading — better prices', eligibility: 'All farmers', url: 'https://enam.gov.in', applySteps: ['enam.gov.in pe register karein', 'Aadhaar + bank details dein', 'Online bidding start karein'] }
];

export default function GovernmentSchemes() {
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ location: '', crop: '' });

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!form.location) return;
    setLoading(true);
    try {
      const result = await findSchemes(form);
      setAiResult(result.data);
      toast.success('Eligible schemes mil gayi!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="section-title flex items-center gap-3">💰 Government Schemes</h1>
        <p className="text-gray-500 mt-2">Sarkari yojanayein jo har kisaan ko milni chahiye — check karein eligibility</p>
      </div>

      <div className="card mb-8">
        <h3 className="font-bold text-gray-800 mb-4">🔍 Check Your Eligibility</h3>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={form.location}
            onChange={(e) => setForm({...form, location: e.target.value})}
            placeholder="📍 Location — e.g. Gujarat, UP"
            className="input-field flex-1"
            required
          />
          <input
            type="text"
            value={form.crop}
            onChange={(e) => setForm({...form, crop: e.target.value})}
            placeholder="🌾 Crop (optional)"
            className="input-field flex-1"
          />
          <button type="submit" disabled={loading} className="btn-primary whitespace-nowrap">
            {loading ? 'Checking...' : '✅ Check Eligibility'}
          </button>
        </form>
      </div>

      {loading && <Loading text="Eligible schemes dhundh raha hoon..." />}

      {aiResult && !loading && (
        <div className="card mb-8 animate-fade-in">
          <h3 className="font-bold text-gray-800 mb-3">🤖 AI Recommendation</h3>
          <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
            {aiResult.recommendation}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 All Government Schemes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {defaultSchemes.map((scheme, i) => (
            <SchemeCard key={i} {...scheme} />
          ))}
        </div>
      </div>
    </div>
  );
}
