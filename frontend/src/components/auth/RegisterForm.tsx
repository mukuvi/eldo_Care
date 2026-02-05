import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole, HEALTH_STATIONS } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Lock, MapPin, Phone, Loader2, Shield, Users, Heart, Stethoscope, IdCard } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  adminMode?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin, adminMode = false }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [healthStation, setHealthStation] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [chvIdNumber, setChvIdNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await register({
      email,
      password,
      fullName,
      role,
      healthStation: role === 'chv' || role === 'admin' || role === 'doctor' ? healthStation : undefined,
      phone,
      licenseNumber: role === 'doctor' ? licenseNumber : undefined,
      chvIdNumber: role === 'chv' ? chvIdNumber : undefined,
    });
    if (success && !adminMode) {
      // Form will be cleared by navigation
    } else if (success && adminMode) {
      // Clear form for next registration
      setFullName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setHealthStation('');
      setLicenseNumber('');
      setChvIdNumber('');
    }
    setIsLoading(false);
  };

  const roleIcons = {
    admin: Shield,
    chv: Heart,
    user: Users,
    doctor: Stethoscope,
  };

  const roleLabels = {
    admin: 'Admin',
    chv: 'CHV',
    user: 'User',
    doctor: 'Doctor',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label className="text-foreground font-medium">Register As</Label>
        <Select value={role} onValueChange={(value: UserRole) => setRole(value)}>
          <SelectTrigger className="h-12 rounded-2xl border-2">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent className="bg-card border border-border z-50">
            {(['user', 'doctor', 'chv', 'admin'] as UserRole[]).map((r) => {
              const Icon = roleIcons[r];
              return (
                <SelectItem key={r} value={r} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{roleLabels[r]}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {adminMode && (
        <div className="space-y-2">
          <Label className="text-foreground font-medium">User Role</Label>
          <div className="grid grid-cols-4 gap-3">
            {(['admin', 'chv', 'user', 'doctor'] as UserRole[]).map((r) => {
              const Icon = roleIcons[r];
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    role === r
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50 text-muted-foreground'
                  }`}
                >
                  <Icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="block text-sm font-medium">{roleLabels[r]}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground font-medium">Full Name</Label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="pl-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground font-medium">Phone Number</Label>
        <div className="relative">
          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="+254 7XX XXX XXX"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-12"
          />
        </div>
      </div>

      {role === 'doctor' && (
        <div className="space-y-2">
          <Label htmlFor="licenseNumber" className="text-foreground font-medium">Medical License Number</Label>
          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="licenseNumber"
              type="text"
              placeholder="e.g., KE-DOC-12345"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="pl-12"
              required
            />
          </div>
        </div>
      )}

      {role === 'chv' && (
        <div className="space-y-2">
          <Label htmlFor="chvIdNumber" className="text-foreground font-medium">CHV Identification Number</Label>
          <div className="relative">
            <IdCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="chvIdNumber"
              type="text"
              placeholder="e.g., CHV-2024-001"
              value={chvIdNumber}
              onChange={(e) => setChvIdNumber(e.target.value)}
              className="pl-12"
              required
            />
          </div>
        </div>
      )}

      {(role === 'chv' || role === 'admin' || role === 'doctor') && (
        <div className="space-y-2">
          <Label htmlFor="healthStation" className="text-foreground font-medium">Health Station</Label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Select value={healthStation} onValueChange={setHealthStation}>
              <SelectTrigger className="pl-12 h-12 rounded-2xl border-2">
                <SelectValue placeholder="Select health station" />
              </SelectTrigger>
              <SelectContent className="bg-card border border-border z-50">
                {HEALTH_STATIONS.map((station) => (
                  <SelectItem key={station} value={station}>
                    {station}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-12"
            required
            minLength={6}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {adminMode ? 'Registering User...' : 'Creating Account...'}
          </>
        ) : (
          adminMode ? `Register ${roleLabels[role]}` : 'Create Account'
        )}
      </Button>

      {!adminMode && (
        <p className="text-center text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
};
