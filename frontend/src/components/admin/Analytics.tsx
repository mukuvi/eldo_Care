import React from 'react';
import { getCases, getUsers } from '@/lib/storage';
import { StatCard } from '@/components/StatCard';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export const Analytics: React.FC = () => {
  const cases = getCases();
  const users = getUsers();

  const riskDistribution = {
    low: cases.filter(c => c.riskLevel === 'low').length,
    medium: cases.filter(c => c.riskLevel === 'medium').length,
    high: cases.filter(c => c.riskLevel === 'high').length,
    critical: cases.filter(c => c.riskLevel === 'critical').length,
  };

  const statusDistribution = {
    pending: cases.filter(c => c.status === 'pending').length,
    inProgress: cases.filter(c => c.status === 'in-progress').length,
    referred: cases.filter(c => c.status === 'referred').length,
    resolved: cases.filter(c => c.status === 'resolved').length,
  };

  const totalRisks = Object.values(riskDistribution).reduce((a, b) => a + b, 0);

  // Pie chart data for risk distribution
  const riskPieData = [
    { name: 'Low Risk', value: riskDistribution.low, color: 'hsl(var(--risk-low))' },
    { name: 'Medium Risk', value: riskDistribution.medium, color: 'hsl(var(--risk-medium))' },
    { name: 'High Risk', value: riskDistribution.high, color: 'hsl(var(--risk-high))' },
    { name: 'Critical', value: riskDistribution.critical, color: 'hsl(var(--risk-critical))' },
  ].filter(item => item.value > 0);

  // Pie chart data for status distribution
  const statusPieData = [
    { name: 'Pending', value: statusDistribution.pending, color: 'hsl(var(--muted-foreground))' },
    { name: 'In Progress', value: statusDistribution.inProgress, color: 'hsl(var(--warning))' },
    { name: 'Referred', value: statusDistribution.referred, color: 'hsl(var(--primary))' },
    { name: 'Resolved', value: statusDistribution.resolved, color: 'hsl(var(--success))' },
  ].filter(item => item.value > 0);

  // User distribution pie data
  const userPieData = [
    { name: 'Administrators', value: users.filter(u => u.role === 'admin').length, color: 'hsl(var(--critical))' },
    { name: 'Doctors', value: users.filter(u => u.role === 'doctor').length, color: 'hsl(var(--primary))' },
    { name: 'CHVs', value: users.filter(u => u.role === 'chv').length, color: 'hsl(var(--accent))' },
    { name: 'Users', value: users.filter(u => u.role === 'user').length, color: 'hsl(var(--warning))' },
  ].filter(item => item.value > 0);

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className="text-xs font-medium">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">System performance and health metrics</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Cases" 
          value={cases.length} 
          icon={BarChart3}
          variant="primary"
        />
        <StatCard 
          title="Active Users" 
          value={users.filter(u => u.isActive).length} 
          icon={Users}
        />
        <StatCard 
          title="Resolution Rate" 
          value={`${cases.length > 0 ? Math.round((statusDistribution.resolved / cases.length) * 100) : 0}%`} 
          icon={TrendingUp}
          variant="success"
        />
        <StatCard 
          title="Urgent Cases" 
          value={riskDistribution.high + riskDistribution.critical} 
          icon={AlertTriangle}
          variant="critical"
        />
      </div>

      {/* Risk Distribution Bar */}
      <div className="bg-card rounded-3xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">Risk Level Distribution</h2>
        <div className="space-y-4">
          {([
            { key: 'low', label: 'Low Risk', color: 'bg-risk-low' },
            { key: 'medium', label: 'Medium Risk', color: 'bg-risk-medium' },
            { key: 'high', label: 'High Risk', color: 'bg-risk-high' },
            { key: 'critical', label: 'Critical', color: 'bg-risk-critical' },
          ] as const).map(({ key, label, color }) => {
            const count = riskDistribution[key];
            const percentage = totalRisks > 0 ? (count / totalRisks) * 100 : 0;
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">{label}</span>
                  <span className="text-muted-foreground">{count} ({percentage.toFixed(1)}%)</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${color} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Distribution Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <Clock className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-3xl font-bold text-foreground">{statusDistribution.pending}</p>
          <p className="text-sm text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <Activity className="w-8 h-8 mx-auto text-warning mb-2" />
          <p className="text-3xl font-bold text-foreground">{statusDistribution.inProgress}</p>
          <p className="text-sm text-muted-foreground">In Progress</p>
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto text-primary mb-2" />
          <p className="text-3xl font-bold text-foreground">{statusDistribution.referred}</p>
          <p className="text-sm text-muted-foreground">Referred</p>
        </div>
        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <CheckCircle className="w-8 h-8 mx-auto text-success mb-2" />
          <p className="text-3xl font-bold text-foreground">{statusDistribution.resolved}</p>
          <p className="text-sm text-muted-foreground">Resolved</p>
        </div>
      </div>

      {/* Pie Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Pie Chart */}
        <div className="bg-card rounded-3xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">Risk Distribution</h2>
          {riskPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={riskPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {riskPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No case data available
            </div>
          )}
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="bg-card rounded-3xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">Case Status</h2>
          {statusPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={statusPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No case data available
            </div>
          )}
        </div>

        {/* User Distribution Pie Chart */}
        <div className="bg-card rounded-3xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">User Distribution</h2>
          {userPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={userPieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userPieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[250px] flex items-center justify-center text-muted-foreground">
              No user data available
            </div>
          )}
        </div>
      </div>

      {/* User Distribution Cards */}
      <div className="bg-card rounded-3xl border border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-6">User Breakdown</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-2xl bg-critical/5">
            <p className="text-4xl font-bold text-critical">{users.filter(u => u.role === 'admin').length}</p>
            <p className="text-sm text-muted-foreground mt-1">Administrators</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-primary/5">
            <p className="text-4xl font-bold text-primary">{users.filter(u => u.role === 'doctor').length}</p>
            <p className="text-sm text-muted-foreground mt-1">Doctors</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-accent/5">
            <p className="text-4xl font-bold text-accent">{users.filter(u => u.role === 'chv').length}</p>
            <p className="text-sm text-muted-foreground mt-1">CHVs</p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-warning/5">
            <p className="text-4xl font-bold text-warning">{users.filter(u => u.role === 'user').length}</p>
            <p className="text-sm text-muted-foreground mt-1">Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};
