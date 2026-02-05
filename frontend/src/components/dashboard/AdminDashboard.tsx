import React from 'react';
import { getDashboardStats, getCases } from '@/lib/storage';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { 
  ClipboardList, 
  AlertTriangle, 
  Users, 
  ArrowUpRight,
  Heart,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

export const AdminDashboard: React.FC = () => {
  const stats = getDashboardStats();
  const cases = getCases().slice(0, 10);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of system health and activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Cases" 
          value={stats.totalCases} 
          icon={ClipboardList}
          variant="primary"
        />
        <StatCard 
          title="Active Cases" 
          value={stats.activeCases} 
          icon={Activity}
          variant="warning"
        />
        <StatCard 
          title="Urgent Risks" 
          value={stats.urgentRisks} 
          icon={AlertTriangle}
          variant="critical"
        />
        <StatCard 
          title="CHV Count" 
          value={stats.chvCount} 
          icon={Heart}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatCard 
          title="Referrals Made" 
          value={stats.referralCount} 
          icon={ArrowUpRight}
        />
        <StatCard 
          title="Registered Users" 
          value={stats.userCount} 
          icon={Users}
        />
      </div>

      <div className="bg-card rounded-3xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Recent Cases</h2>
        {cases.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No cases recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Patient</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Risk Level</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Created By</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="py-3 px-4 text-foreground font-medium">{c.patientName}</td>
                    <td className="py-3 px-4">
                      <RiskBadge risk={c.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        c.status === 'resolved' ? 'bg-success/10 text-success' :
                        c.status === 'referred' ? 'bg-primary/10 text-primary' :
                        c.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">{c.createdByName}</td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {format(new Date(c.createdAt), 'MMM d, yyyy')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
