export default function StatsSection({ overview }) {
  const totalCalls = overview.reduce((sum, e) => sum + e.total, 0);

  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Call Overview</h2>
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
          Total: {totalCalls}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
              <th className="px-6 py-4">Event Type</th>
              <th className="px-6 py-4 text-right">Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {overview.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-700">{item._id}</td>
                <td className="px-6 py-4 text-right text-gray-600">{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}