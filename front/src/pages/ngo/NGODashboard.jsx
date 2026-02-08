import { useEffect, useState } from "react";
import { fetchSummary } from "../../api/ngo.api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { PhoneIcon, ExclamationTriangleIcon, BuildingOfficeIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";

// Color palette
const COLORS = ["#228B22", "#DC2626", "#F59E0B", "#3B82F6", "#8B5CF6"];

export default function NGODashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy location data for demo (replace with real CallSession.location)
  const callerLocations = [
    { id: 1, lat: -1.2921, lng: 36.8219, risk: "high", description: "Fever & cough" },
    { id: 2, lat: -1.2864, lng: 36.8172, risk: "medium", description: "Headache" },
    { id: 3, lat: -1.3000, lng: 36.7800, risk: "critical", description: "Chest pain" },
  ];

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetchSummary();
        setSummary(res.data);
      } catch (err) {
        console.error("Failed to load NGO data", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 mx-auto mb-6"></div>
          <p className="text-xl font-medium text-gray-700">Loading NGO Dashboard...</p>
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
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 transition shadow-md"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Chart data preparation
  const riskData = [
    { name: "Low", value: summary?.lowRisk || 0 },
    { name: "Medium", value: summary?.mediumRisk || 0 },
    { name: "High", value: summary?.highRiskCases || 0 },
    { name: "Critical", value: summary?.critical || 0 },
  ];

  const escalationData = [
    { name: "Escalated", value: summary?.escalations || 0 },
    { name: "Non-Escalated", value: (summary?.totalCalls || 0) - (summary?.escalations || 0) },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-green-800 tracking-tight">
            NGO / Government Dashboard
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Real-time overview of community health calls, escalations, and geographic impact
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <MetricCard
            icon={<PhoneIcon className="h-8 w-8 text-green-600" />}
            title="Total Calls"
            value={summary?.totalCalls?.toLocaleString() || "0"}
            color="green"
          />
          <MetricCard
            icon={<ExclamationTriangleIcon className="h-8 w-8 text-red-600" />}
            title="High Risk Cases"
            value={summary?.highRiskCases?.toLocaleString() || "0"}
            color="red"
          />
          <MetricCard
            icon={<BuildingOfficeIcon className="h-8 w-8 text-green-600" />}
            title="Escalations"
            value={summary?.escalations?.toLocaleString() || "0"}
            color="green"
          />
          <MetricCard
            icon={<ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />}
            title="Revenue Events"
            value={summary?.revenueEvents?.toLocaleString() || "0"}
            color="green"
          />
        </div>

        {/* GIS Map - Caller Locations */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-10">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-2xl font-semibold text-green-800">
              Caller Locations Across Kenya
            </h2>
          </div>
          <div className="h-96">
            <MapContainer center={[-1.286389, 36.817223]} zoom={7} className="h-full w-full">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {callerLocations.map((loc) => (
                <Marker key={loc.id} position={[loc.lat, loc.lng]}>
                  <Popup>
                    <strong>Risk:</strong> {loc.risk.toUpperCase()}<br />
                    <strong>Description:</strong> {loc.description}<br />
                    <strong>Location:</strong> {loc.lat.toFixed(4)}, {loc.lng.toFixed(4)}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Risk Level Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-green-800 mb-6">Risk Level Distribution</h3>
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Escalation Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-green-800 mb-6">Escalation Overview</h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={escalationData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#228B22" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ActionButton icon="📥" label="Export Report" color="green" />
            <ActionButton icon="🔔" label="View Alerts" color="red" badge="3" />
            <ActionButton icon="👥" label="Manage Teams" color="green" />
            <ActionButton icon="⚙️" label="Settings" color="gray" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function MetricCard({ icon, title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-center justify-between">
        <div className={`p-4 rounded-xl ${color === 'red' ? 'bg-red-50' : 'bg-green-50'}`}>
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-500">{title}</span>
      </div>
      <p className={`mt-4 text-4xl font-bold ${color === 'red' ? 'text-red-600' : 'text-green-700'}`}>
        {value}
      </p>
    </div>
  );
}

function ActionButton({ icon, label, color, badge }) {
  const bgColor = color === 'red' ? 'bg-red-50 hover:bg-red-100' : color === 'gray' ? 'bg-gray-50 hover:bg-gray-100' : 'bg-green-50 hover:bg-green-100';
  const textColor = color === 'red' ? 'text-red-700' : color === 'gray' ? 'text-gray-700' : 'text-green-700';

  return (
    <button
      className={`flex items-center justify-center gap-3 p-6 rounded-xl ${bgColor} ${textColor} font-medium text-lg transition-all hover:shadow-md relative`}
    >
      <span className="text-2xl">{icon}</span>
      {label}
      {badge && (
        <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
          {badge}
        </span>
      )}
    </button>
  );
}