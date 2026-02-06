export default function RevenueSection({ billing }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Total Revenue Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</p>
        <p className="mt-2 text-3xl font-bold text-green-600">
          ${billing.totalRevenue?.toLocaleString()}
        </p>
      </div>

      {/* Pending Payments Card */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Payments</p>
        <p className="mt-2 text-3xl font-bold text-amber-600">
          {billing.pendingPayments}
        </p>
      </div>
    </div>
  );
}