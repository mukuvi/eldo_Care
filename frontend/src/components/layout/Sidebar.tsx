import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Phone, 
  Users, 
  UserPlus,
  Settings, 
  LogOut,
  BarChart3,
  Shield,
  Heart,
  Camera,
  Stethoscope
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout } = useAuth();

  const adminLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'register', label: 'Register User', icon: UserPlus },
    { id: 'cases', label: 'All Cases', icon: ClipboardList },
  ];

  const chvLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'triage', label: 'New Triage', icon: ClipboardList },
    { id: 'voice', label: 'Voice Triage', icon: Phone },
    { id: 'image-upload', label: 'Upload Images', icon: Camera },
    { id: 'register-patient', label: 'Register Patient', icon: UserPlus },
    { id: 'cases', label: 'My Cases', icon: Heart },
  ];

  const doctorLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cases', label: 'All Cases', icon: ClipboardList },
    { id: 'image-review', label: 'Image Review', icon: Camera },
  ];

  const userLinks = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'voice', label: 'Voice Consultation', icon: Phone },
    { id: 'history', label: 'My History', icon: ClipboardList },
  ];

  const links = user?.role === 'admin' 
    ? adminLinks 
    : user?.role === 'chv' 
    ? chvLinks 
    : user?.role === 'doctor'
    ? doctorLinks
    : userLinks;

  const roleColors = {
    admin: 'bg-critical/10 text-critical',
    chv: 'bg-primary/10 text-primary',
    user: 'bg-accent/10 text-accent',
    doctor: 'bg-warning/10 text-warning',
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50">
      <div className="p-6 border-b border-sidebar-border">
        <Logo size="sm" />
      </div>

      <div className="p-4">
        <div className={`p-3 rounded-2xl ${roleColors[user?.role || 'user']}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-current/20 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground truncate">{user?.fullName}</p>
              <p className="text-xs uppercase tracking-wide opacity-80">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`nav-link w-full ${isActive ? 'nav-link-active' : ''}`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-2">
        <button className="nav-link w-full">
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-critical"
          onClick={logout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
};
