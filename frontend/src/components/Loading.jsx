export default function Loading({ text }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary-200" />
        <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin" />
        <span className="absolute inset-0 flex items-center justify-center text-2xl">🌱</span>
      </div>
      <p className="text-gray-600 font-medium text-sm">{text || 'loading...'}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card animate-pulse">
      <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-4" />
      <div className="h-3 bg-gray-200 rounded-full w-full mb-2" />
      <div className="h-3 bg-gray-200 rounded-full w-5/6 mb-2" />
      <div className="h-3 bg-gray-200 rounded-full w-2/3" />
    </div>
  );
}
