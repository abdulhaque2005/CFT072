import { ExternalLink, CheckCircle2 } from 'lucide-react';

export default function SchemeCard({ name, benefit, eligibility, url, applySteps }) {
  return (
    <div className="card hover:border-primary-300">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <span className="text-2xl">📋</span> {name}
        </h4>
      </div>

      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-green-500 mt-0.5">💰</span>
          <div>
            <p className="text-xs text-gray-500 font-medium">Benefit</p>
            <p className="text-sm font-semibold text-gray-800">{benefit}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <span className="text-blue-500 mt-0.5">✅</span>
          <div>
            <p className="text-xs text-gray-500 font-medium">Eligibility</p>
            <p className="text-sm text-gray-700">{eligibility}</p>
          </div>
        </div>

        {applySteps && applySteps.length > 0 && (
          <div className="mt-2 p-3 bg-primary-50 rounded-xl space-y-1.5">
            <p className="text-xs font-bold text-primary-800 mb-1">How to Apply:</p>
            {applySteps.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-primary-700">
                <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {url && (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-700 hover:text-primary-900 transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Website Visit Karein
        </a>
      )}
    </div>
  );
}
