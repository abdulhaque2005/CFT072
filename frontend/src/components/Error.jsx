import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function Error({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
      <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">Kuch galat ho gaya!</h3>
      <p className="text-sm text-gray-500 mb-4 text-center max-w-md">
        {message || 'Server se connection nahi ho pa raha. Please thodi der baad try karein.'}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary flex items-center gap-2">
          <RefreshCcw className="w-4 h-4" /> Phir se try karein
        </button>
      )}
    </div>
  );
}
