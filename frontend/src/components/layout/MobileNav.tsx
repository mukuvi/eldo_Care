import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  X,
  LayoutDashboard, 
  ClipboardList, 
  Phone, 
  Users, 
  UserPlus,
  LogOut,
  BarChart3,
  Heart,
  Camera,
  Stethoscope
} from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
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

  const handleNavClick = (tab: string) => {
    onTabChange(tab);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 z-50">
        <Logo size="sm" />
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-card shadow-xl animate-slide-up">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <span className="font-semibold text-foreground">{user?.fullName}</span>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <nav className="p-4 space-y-1">
              {links.map((link) => {
                const Icon = link.icon;
                const isActive = activeTab === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`nav-link w-full ${isActive ? 'nav-link-active' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{link.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-muted-foreground hover:text-critical"
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
