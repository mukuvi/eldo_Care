import { useEffect, useState } from 'react';
import hospitalApi from '../api/hospitalClient';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import LeadsTable from '../components/tables/LeadsTable';

// Color palette matching your scheme
const COLORS = ['#228B22', '#DC2626', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

export default function HospitalDashboard() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      setLoading(true);
      const res = await hospitalApi.get('/insights/hospital/leads');
      setLeads(res.data || []);
    } catch (err) {
      console.error('Failed to load leads', err);
      setError('Could not load hospital leads. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Prepare chart data
  const statusData = leads.reduce((acc, lead) => {
    const status = (lead.status || 'new').toLowerCase();
    const found = acc.find(item => item.name === status);
    if (found) found.value += 1;
    else acc.push({ name: status.charAt(0).toUpperCase() + status.slice(1), value: 1 });
    return acc;
  }, []);

  const riskData = leads.reduce((acc, lead) => {
    const risk = (lead.riskLevel || 'unknown').toLowerCase();
    const found = acc.find(item => item.risk === risk);
    if (found) found.count += 1;
    else acc.push({ risk: risk.charAt(0).toUpperCase() + risk.slice(1), count: 1 });
    return acc;
  }, []);

  // Key metrics
  const totalLeads = leads.length;
  const highRisk = leads.filter(l => ['high', 'critical'].includes(l.riskLevel?.toLowerCase())).length;
  const pending = leads.filter(l => ['pending', 'new'].includes(l.status?.toLowerCase())).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700">Loading Hospital Dashboard...</p>
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
            onClick={fetchLeads}
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
          <h1 className="text-3xl md:text-4xl font-bold text-green-800 tracking-tight">
            🏥 Hospital Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Monitor incoming patient leads, risk distribution, and trends in real time
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Leads</p>
            <p className="mt-3 text-4xl font-bold text-green-700">{totalLeads.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">High Risk Leads</p>
            <p className="mt-3 text-4xl font-bold text-red-600">{highRisk.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pending Leads</p>
            <p className="mt-3 text-4xl font-bold text-amber-600">{pending.toLocaleString()}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Pie Chart - Leads by Status */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-green-800 mb-6">Leads by Status</h3>
            {statusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} leads`} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No status data available yet
              </div>
            )}
          </div>

          {/* Bar Chart - Leads by Risk Level */}
          <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
            <h3 className="text-xl font-semibold text-green-800 mb-6">Leads by Risk Level</h3>
            {riskData.length > 0 ? (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={riskData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="risk" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#228B22" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No risk level data available yet
              </div>
            )}
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50">
            <h2 className="text-2xl font-semibold text-green-800">
              Patient Leads Overview ({leads.length})
            </h2>
          </div>
          <LeadsTable leads={leads} />
        </div>
      </div>
    </div>
  );
}