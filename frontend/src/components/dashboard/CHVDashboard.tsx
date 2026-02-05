import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCases } from '@/lib/storage';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  AlertTriangle, 
  Phone,
  Plus,
  CheckCircle,
  Camera,
  UserPlus
} from 'lucide-react';
import { format } from 'date-fns';

interface CHVDashboardProps {
  onNavigate: (tab: string) => void;
}

export const CHVDashboard: React.FC<CHVDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const allCases = getCases();
  const myCases = allCases.filter(c => c.createdBy === user?.id);
  
  const stats = {
    totalCases: myCases.length,
    activeCases: myCases.filter(c => c.status === 'pending' || c.status === 'in-progress').length,
    urgentCases: myCases.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length,
    resolvedCases: myCases.filter(c => c.status === 'resolved').length,
  };

  const recentCases = myCases.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, {user?.fullName?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">{user?.healthStation}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => onNavigate('triage')} className="gap-2">
            <Plus className="w-5 h-5" />
            New Triage
          </Button>
          <Button variant="outline" onClick={() => onNavigate('voice')} className="gap-2">
            <Phone className="w-5 h-5" />
            Voice Call
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="My Cases" 
          value={stats.totalCases} 
          icon={ClipboardList}
          variant="primary"
        />
        <StatCard 
          title="Active" 
          value={stats.activeCases} 
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard 
          title="Urgent" 
          value={stats.urgentCases} 
          icon={AlertTriangle}
          variant="critical"
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolvedCases} 
          icon={CheckCircle}
          variant="success"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-3xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Cases</h2>
          {recentCases.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No cases yet</p>
              <Button className="mt-4" onClick={() => onNavigate('triage')}>
                Start First Triage
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCases.map((c) => (
                <div 
                  key={c.id} 
                  className="p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{c.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(c.createdAt), 'MMM d, h:mm a')}
                      </p>
                    </div>
                    <RiskBadge risk={c.riskLevel} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-3xl border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => onNavigate('triage')}
              className="w-full p-4 rounded-2xl bg-primary/5 border-2 border-primary/20 hover:border-primary/50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <ClipboardList className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">New Patient Triage</p>
                  <p className="text-sm text-muted-foreground">Assess symptoms and get guidance</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('voice')}
              className="w-full p-4 rounded-2xl bg-accent/5 border-2 border-accent/20 hover:border-accent/50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Phone className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Voice Consultation</p>
                  <p className="text-sm text-muted-foreground">Speak with AI health assistant</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('image-upload')}
              className="w-full p-4 rounded-2xl bg-warning/5 border-2 border-warning/20 hover:border-warning/50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors">
                  <Camera className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Upload Medical Images</p>
                  <p className="text-sm text-muted-foreground">Send skin condition photos to doctor</p>
                </div>
              </div>
            </button>

            <button 
              onClick={() => onNavigate('register-patient')}
              className="w-full p-4 rounded-2xl bg-success/5 border-2 border-success/20 hover:border-success/50 transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <UserPlus className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">Register New Patient</p>
                  <p className="text-sm text-muted-foreground">Add patient to the health system</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
