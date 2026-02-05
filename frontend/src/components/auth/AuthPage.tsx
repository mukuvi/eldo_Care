import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Shield, Heart, Users } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 flex flex-col justify-between p-12 text-primary-foreground">
          <div>
            <Logo size="lg" />
          </div>
          
          <div className="space-y-8">
            <h1 className="text-4xl font-bold leading-tight">
              Bridging Healthcare<br />
              to Every Community
            </h1>
            <p className="text-lg text-primary-foreground/80 max-w-md">
              Empowering Community Health Volunteers with AI-powered triage 
              to deliver quality healthcare guidance to rural Kenya.
            </p>
            
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <Shield className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium">Secure</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <Heart className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium">Caring</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-primary-foreground/20 flex items-center justify-center">
                  <Users className="w-7 h-7" />
                </div>
                <p className="text-sm font-medium">Accessible</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-primary-foreground/60">
            © 2024 Eldocare. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="lg:hidden flex justify-center mb-8">
            <Logo size="md" />
          </div>
          
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="mt-2 text-muted-foreground">
              {isLogin 
                ? 'Sign in to access your health portal' 
                : 'Join Eldocare to access health services'}
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-lg border border-border p-8">
            {isLogin ? (
              <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
