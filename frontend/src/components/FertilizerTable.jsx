export default function FertilizerTable({ quickReference }) {
  if (!quickReference || quickReference.length === 0) {
    return (
      <div className="card text-center py-8">
        <p className="text-4xl mb-2">✅</p>
        <p className="text-gray-600 font-medium">Sab nutrients balanced hain — extra fertilizer ki zaroorat nahi!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden p-0">
      <div className="gradient-bg px-6 py-4">
        <h3 className="text-white font-bold text-lg">🧪 Fertilizer Plan</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-50">
              <th className="text-left px-6 py-3 text-sm font-semibold text-primary-800">Nutrient</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-primary-800">Status</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-primary-800">Fertilizer</th>
              <th className="text-left px-6 py-3 text-sm font-semibold text-primary-800">Dose/Acre</th>
            </tr>
          </thead>
          <tbody>
            {quickReference.map((item, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-primary-50/30 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-800">{item.nutrient}</td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 font-semibold text-primary-800">{item.fertilizer}</td>
                <td className="px-6 py-4 text-gray-700">{item.dose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
