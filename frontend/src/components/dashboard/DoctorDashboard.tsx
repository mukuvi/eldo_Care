import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getCases } from '@/lib/storage';
import { StatCard } from '@/components/StatCard';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  AlertTriangle, 
  Camera,
  CheckCircle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface DoctorDashboardProps {
  onNavigate: (tab: string) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const allCases = getCases();
  const imageUploads = JSON.parse(localStorage.getItem('eldocare_image_uploads') || '[]');
  
  const stats = {
    totalCases: allCases.length,
    pendingReview: imageUploads.filter((u: any) => u.status === 'pending-review').length,
    urgentCases: allCases.filter(c => c.riskLevel === 'high' || c.riskLevel === 'critical').length,
    resolvedCases: allCases.filter(c => c.status === 'resolved').length,
  };

  const recentCases = allCases.slice(0, 5);
  const pendingImages = imageUploads.filter((u: any) => u.status === 'pending-review').slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Welcome, Dr. {user?.fullName?.split(' ')[1] || user?.fullName?.split(' ')[0]}</h1>
          <p className="text-muted-foreground mt-1">{user?.healthStation}</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => onNavigate('cases')} className="gap-2">
            <ClipboardList className="w-5 h-5" />
            View Cases
          </Button>
          <Button variant="outline" onClick={() => onNavigate('image-review')} className="gap-2">
            <Camera className="w-5 h-5" />
            Review Images
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Cases" 
          value={stats.totalCases} 
          icon={ClipboardList}
          variant="primary"
        />
        <StatCard 
          title="Pending Review" 
          value={stats.pendingReview} 
          icon={Eye}
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
          <h2 className="text-xl font-semibold text-foreground mb-4">Pending Image Reviews</h2>
          {pendingImages.length === 0 ? (
            <div className="text-center py-8">
              <Camera className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No pending images</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingImages.map((img: any) => (
                <div 
                  key={img.id} 
                  className="p-4 rounded-2xl bg-warning/10 border border-warning/20 hover:bg-warning/20 transition-colors cursor-pointer"
                  onClick={() => onNavigate('image-review')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{img.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {img.conditionType} • {img.imageCount} image(s)
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning font-medium">
                      Pending
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
