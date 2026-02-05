import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AGE_RANGES, LANGUAGES, Language } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  UserPlus, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Heart,
  FileText,
  Loader2,
  CheckCircle
} from 'lucide-react';

interface PatientRecord {
  id: string;
  fullName: string;
  phone: string;
  nationalId: string;
  ageRange: string;
  gender: string;
  location: string;
  preferredLanguage: Language;
  emergencyContact: string;
  emergencyPhone: string;
  medicalHistory: string;
  allergies: string;
  registeredBy: string;
  registeredByName: string;
  createdAt: string;
}

const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

export const PatientRegistration: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [gender, setGender] = useState('');
  const [location, setLocation] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('english');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [allergies, setAllergies] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const patients = JSON.parse(localStorage.getItem('eldocare_patients') || '[]');
    const newPatient: PatientRecord = {
      id: `patient-${Date.now()}`,
      fullName,
      phone,
      nationalId,
      ageRange,
      gender,
      location,
      preferredLanguage,
      emergencyContact,
      emergencyPhone,
      medicalHistory,
      allergies,
      registeredBy: user?.id || '',
      registeredByName: user?.fullName || '',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem('eldocare_patients', JSON.stringify([...patients, newPatient]));

    toast({
      title: 'Patient Registered',
      description: `${fullName} has been successfully registered.`,
    });

    // Reset form
    setFullName('');
    setPhone('');
    setNationalId('');
    setAgeRange('');
    setGender('');
    setLocation('');
    setPreferredLanguage('english');
    setEmergencyContact('');
    setEmergencyPhone('');
    setMedicalHistory('');
    setAllergies('');
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Register New Patient</h1>
        <p className="text-muted-foreground mt-2">
          Add a new patient to the Eldocare health system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-8 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID</Label>
              <Input
                id="nationalId"
                placeholder="12345678"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+254 7XX XXX XXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Gender *</Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border z-50">
                  {GENDERS.map((g) => (
                    <SelectItem key={g.value} value={g.value}>
                      {g.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Age Range *</Label>
              <Select value={ageRange} onValueChange={setAgeRange} required>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue placeholder="Select age range" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border z-50">
                  {AGE_RANGES.map((age) => (
                    <SelectItem key={age.value} value={age.value}>
                      {age.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Preferred Language *</Label>
              <Select value={preferredLanguage} onValueChange={(v: Language) => setPreferredLanguage(v)} required>
                <SelectTrigger className="h-12 rounded-2xl">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border z-50">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label} ({lang.native})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/Village *</Label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Village, Sub-county, County"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-12"
                required
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Heart className="w-5 h-5 text-critical" />
            Emergency Contact
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contact Name</Label>
              <Input
                id="emergencyContact"
                placeholder="Emergency contact name"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Contact Phone</Label>
              <Input
                id="emergencyPhone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Medical History */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Medical History
          </h2>
          
          <div className="space-y-2">
            <Label htmlFor="medicalHistory">Known Conditions</Label>
            <Textarea
              id="medicalHistory"
              placeholder="List any known medical conditions (diabetes, hypertension, etc.)"
              value={medicalHistory}
              onChange={(e) => setMedicalHistory(e.target.value)}
              rows={3}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies</Label>
            <Textarea
              id="allergies"
              placeholder="List any known allergies (medications, food, etc.)"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              rows={2}
              className="rounded-2xl"
            />
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Registering...
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              Register Patient
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
