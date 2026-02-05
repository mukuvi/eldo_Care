import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Phone, 
  Shield, 
  Clock,
  Heart,
  MessageCircle,
  Languages
} from 'lucide-react';
import { LANGUAGES } from '@/types';

interface UserDashboardProps {
  onNavigate: (tab: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto">
        <div className="w-20 h-20 mx-auto mb-4 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Heart className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome to Eldocare, {user?.fullName?.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Get health guidance through our AI-powered voice consultation service
        </p>
      </div>

      {/* Main CTA */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl border border-primary/20 p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary flex items-center justify-center shadow-health-lg animate-pulse-ring">
          <Phone className="w-12 h-12 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Voice Health Consultation</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Speak with our AI health assistant in your preferred language. 
          Describe your symptoms and receive guidance.
        </p>
        <Button 
          size="xl" 
          onClick={() => onNavigate('voice')}
          className="shadow-health-lg"
        >
          <Phone className="w-6 h-6 mr-2" />
          Start Voice Consultation
        </Button>
      </div>

      {/* Supported Languages */}
      <div className="bg-card rounded-3xl border border-border p-6">
        <div className="flex items-center gap-3 mb-4">
          <Languages className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Supported Languages</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {LANGUAGES.map((lang) => (
            <div 
              key={lang.value}
              className="p-4 rounded-2xl bg-muted/50 text-center hover:bg-muted transition-colors"
            >
              <p className="font-semibold text-foreground">{lang.label}</p>
              <p className="text-sm text-muted-foreground">{lang.native}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-success/10 flex items-center justify-center">
            <Shield className="w-7 h-7 text-success" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Private & Secure</h3>
          <p className="text-sm text-muted-foreground">
            Your health information is kept confidential and secure
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Clock className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">24/7 Available</h3>
          <p className="text-sm text-muted-foreground">
            Get health guidance anytime, day or night
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border p-6 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-accent/10 flex items-center justify-center">
            <MessageCircle className="w-7 h-7 text-accent" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Expert Guidance</h3>
          <p className="text-sm text-muted-foreground">
            AI-powered triage with medical knowledge
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4">
        <p className="text-sm text-foreground">
          <strong>Medical Disclaimer:</strong> Eldocare provides health guidance only and does not 
          replace professional medical advice, diagnosis, or treatment. In case of emergency, 
          please contact emergency services or visit your nearest health facility immediately.
        </p>
      </div>
    </div>
  );
};
