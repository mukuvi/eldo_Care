import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { UserPlus } from 'lucide-react';

export const RegisterUser: React.FC = () => {
  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Register New User</h1>
        <p className="text-muted-foreground mt-2">
          Add a new Admin, CHV, or User to the system
        </p>
      </div>

      <div className="bg-card rounded-3xl border border-border p-8">
        <RegisterForm onSwitchToLogin={() => {}} adminMode={true} />
      </div>
    </div>
  );
};
