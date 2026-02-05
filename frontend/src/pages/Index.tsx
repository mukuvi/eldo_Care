import React, { useState } from 'react';
import { useAuth, AuthProvider } from '@/contexts/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { CHVDashboard } from '@/components/dashboard/CHVDashboard';
import { UserDashboard } from '@/components/dashboard/UserDashboard';
import { DoctorDashboard } from '@/components/dashboard/DoctorDashboard';
import { TriageForm } from '@/components/triage/TriageForm';
import { VoiceTriage } from '@/components/voice/VoiceTriage';
import { UserManagement } from '@/components/admin/UserManagement';
import { RegisterUser } from '@/components/admin/RegisterUser';
import { CasesList } from '@/components/admin/CasesList';
import { Analytics } from '@/components/admin/Analytics';
import { ImageUpload } from '@/components/chv/ImageUpload';
import { PatientRegistration } from '@/components/chv/PatientRegistration';
import { ImageReview } from '@/components/doctor/ImageReview';
import { Loader2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading Eldocare...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const renderContent = () => {
    switch (user.role) {
      case 'admin':
        switch (activeTab) {
          case 'dashboard': return <AdminDashboard />;
          case 'analytics': return <Analytics />;
          case 'users': return <UserManagement />;
          case 'register': return <RegisterUser />;
          case 'cases': return <CasesList />;
          default: return <AdminDashboard />;
        }
      case 'chv':
        switch (activeTab) {
          case 'dashboard': return <CHVDashboard onNavigate={setActiveTab} />;
          case 'triage': return <TriageForm onComplete={() => setActiveTab('cases')} />;
          case 'voice': return <VoiceTriage />;
          case 'image-upload': return <ImageUpload />;
          case 'register-patient': return <PatientRegistration />;
          case 'cases': return <CasesList filterByUser={user.id} />;
          default: return <CHVDashboard onNavigate={setActiveTab} />;
        }
      case 'doctor':
        switch (activeTab) {
          case 'dashboard': return <DoctorDashboard onNavigate={setActiveTab} />;
          case 'cases': return <CasesList />;
          case 'image-review': return <ImageReview />;
          default: return <DoctorDashboard onNavigate={setActiveTab} />;
        }
      case 'user':
        switch (activeTab) {
          case 'dashboard': return <UserDashboard onNavigate={setActiveTab} />;
          case 'voice': return <VoiceTriage />;
          case 'history': return <CasesList filterByUser={user.id} />;
          default: return <UserDashboard onNavigate={setActiveTab} />;
        }
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 pt-20 lg:pt-6 max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

const Index: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default Index;
