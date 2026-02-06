import { useEffect, useState } from "react";
import { fetchSummary } from "../../api/ngo.api";

export default function NGODashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetchSummary();
        setSummary(res.data);
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Failed to load NGO dashboard data");
      } finally {
        setLoading(false);
      }
    }

    loadSummary();
  }, []);

  // =======================
  // Loading State
  // =======================
  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px" }}>
        <h3>Loading NGO Dashboard…</h3>
      </div>
    );
  }

  // =======================
  // Error State
  // =======================
  if (error) {
    return (
      <div style={{ textAlign: "center", padding: "100px", color: "red" }}>
        <h3>{error}</h3>
      </div>
    );
  }

  // =======================
  // Render Dashboard
  // =======================
  return (
    <div style={{ padding: 30 }}>
      <h1>NGO / Government Dashboard</h1>

      <div style={{ display: "flex", gap: 20 }}>
        <Metric label="Total Calls" value={summary.totalCalls} />
        <Metric label="High Risk Cases" value={summary.highRiskCases} />
        <Metric label="Escalations" value={summary.escalations} />
        <Metric label="Revenue Events" value={summary.revenueEvents} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div style={{
      padding: 20,
      border: "1px solid #ccc",
      borderRadius: 8,
      width: 200
    }}>
      <h2>{value}</h2>
      <p>{label}</p>
    </div>
  );
}
