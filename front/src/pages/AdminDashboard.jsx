import { useEffect, useState } from 'react';
import adminApi from '../api/adminClient';
import StatsSection from '../components/StatsSection';
import RevenueSection from '../components/RevenueSection';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Color palette
const COLORS = ['#15803d', '#dc2626', '#f59e0b', '#3b82f6'];

export default function AdminDashboard() {
  const [overview, setOverview] = useState({
    totalCalls: 0,
    activeCases: 0,
    resolvedCases: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const overviewRes = await adminApi.get('/api/insights/overview');
        const data = overviewRes.data || {};

        // Use real data if available, otherwise keep defaults
        setOverview({
          totalCalls: Number(data.totalCalls) || 0,
          activeCases: Number(data.activeCases) || 0,
          resolvedCases: Number(data.resolvedCases) || 0
        });
      } catch (err) {
        console.error('Failed to load dashboard', err);
        setError('Failed to load dashboard data. Showing demo data instead.');
        // Keep demo data on error
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Demo / fallback data (used if API returns nothing or fails)
  const demoOverview = {
    totalCalls: 284,
    activeCases: 67,
    resolvedCases: 195
  };

  // Use demo data if real data is zero/empty
  const displayOverview = 
    overview.totalCalls === 0 && overview.activeCases === 0 && overview.resolvedCases === 0
      ? demoOverview
      : overview;

  // Chart data
  const chartData = [
    { name: 'Total Calls', value: displayOverview.totalCalls },
    { name: 'Active Cases', value: displayOverview.activeCases },
    { name: 'Resolved Cases', value: displayOverview.resolvedCases }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white p-10 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              adminApi.get('/api/insights/overview')
                .then(res => {
                  setOverview({
                    totalCalls: Number(res.data.totalCalls) || 0,
                    activeCases: Number(res.data.activeCases) || 0,
                    resolvedCases: Number(res.data.resolvedCases) || 0
                  });
                  setLoading(false);
                })
                .catch(() => setError('Retry failed. Check your connection.'));
            }}
            className="px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Monitor platform performance, call activity, and case resolution in real time
          </p>
          {overview.totalCalls === 0 && (
            <p className="mt-2 text-sm text-amber-600 font-medium">
              Showing demo data — connect real calls/cases to see live stats
            </p>
          )}
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <MetricCard
            title="Total Calls"
            value={displayOverview.totalCalls.toLocaleString()}
            color="green"
            description="All health consultations logged"
          />
          <MetricCard
            title="Active Cases"
            value={displayOverview.activeCases.toLocaleString()}
            color="amber"
            description="Cases pending review/action"
          />
          <MetricCard
            title="Resolved Cases"
            value={displayOverview.resolvedCases.toLocaleString()}
            color="green"
            description="Successfully handled & closed"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Platform Overview</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  dataKey="value"
                  label={({ name, percent }) => percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Calls vs Cases Comparison</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#15803d" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Stats */}
        <StatsSection overview={displayOverview} />

        {/* Revenue (uncomment when ready) */}
        {/* <RevenueSection billing={{ totalRevenue: 0, pendingPayments: 0 }} /> */}
      </div>
    </div>
  );
}

// Reusable Metric Card
function MetricCard({ title, value, color, description }) {
  const colorClasses = {
    green: 'text-green-700 bg-green-50 border-green-200',
    amber: 'text-amber-700 bg-amber-50 border-amber-200',
    red: 'text-red-700 bg-red-50 border-red-200'
  }[color] || 'text-gray-700 bg-gray-50 border-gray-200';

  return (
    <div className={`p-6 rounded-2xl shadow-md border ${colorClasses} hover:shadow-lg transition-shadow`}>
      <p className="text-sm font-medium uppercase tracking-wide">{title}</p>
      <p className="mt-3 text-4xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}