import { useEffect, useState } from 'react';
import adminApi from '../api/adminClient';
import StatsSection from '../components/StatsSection';
import RevenueSection from '../components/RevenueSection';

export default function AdminDashboard() {
  const [overview, setOverview] = useState([]);
  const [billing, setBilling] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const overviewRes = await adminApi.get('/insights/overview');
        const billingRes = await adminApi.get('/billing/summary');
        setOverview(overviewRes.data);
        setBilling(billingRes.data);
      } catch (err) {
        console.error('Failed to load dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg font-medium text-gray-500 animate-pulse">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-gray-500">Monitor your platform performance and revenue.</p>
        </header>
        
        <div className="space-y-8">
          <RevenueSection billing={billing} />
          <StatsSection overview={overview} />
        </div>
      </div>
    </div>
  );
}