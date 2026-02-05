import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskBadge } from '@/components/RiskBadge';
import { SYMPTOM_OPTIONS, AGE_RANGES, LANGUAGES, Language, PatientCase, HealthGuidance } from '@/types';
import { runTriageEngine } from '@/lib/triage-engine';
import { addCase } from '@/lib/storage';
import { 
  User, 
  CalendarDays, 
  Stethoscope, 
  FileText, 
  AlertTriangle,
  CheckCircle,
  Loader2,
  MapPin,
  Languages as LanguagesIcon
} from 'lucide-react';

interface TriageFormProps {
  onComplete?: () => void;
}

export const TriageForm: React.FC<TriageFormProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<HealthGuidance | null>(null);
  
  const [formData, setFormData] = useState({
    patientName: '',
    ageRange: '',
    symptoms: [] as string[],
    description: '',
    language: 'english' as Language,
  });

  const handleSymptomToggle = (symptomId: string) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptomId)
        ? prev.symptoms.filter(s => s !== symptomId)
        : [...prev.symptoms, symptomId]
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const guidance = runTriageEngine({
      ageRange: formData.ageRange,
      symptoms: formData.symptoms,
      description: formData.description,
    });
    
    setResult(guidance);
    
    // Save the case
    addCase({
      patientName: formData.patientName,
      ageRange: formData.ageRange,
      symptoms: formData.symptoms,
      description: formData.description,
      riskLevel: guidance.riskLevel,
      aiGuidance: guidance,
      createdBy: user?.id || '',
      createdByName: user?.fullName || '',
      status: guidance.referralFacility ? 'referred' : 'pending',
      referralFacility: guidance.referralFacility || undefined,
      language: formData.language,
    });
    
    setIsLoading(false);
    setStep(4);
  };

  const resetForm = () => {
    setFormData({
      patientName: '',
      ageRange: '',
      symptoms: [],
      description: '',
      language: 'english',
    });
    setResult(null);
    setStep(1);
  };

  const steps = [
    { number: 1, title: 'Patient Info' },
    { number: 2, title: 'Symptoms' },
    { number: 3, title: 'Details' },
    { number: 4, title: 'Results' },
  ];

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, i) => (
          <React.Fragment key={s.number}>
            <div className="flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step >= s.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {step > s.number ? <CheckCircle className="w-5 h-5" /> : s.number}
              </div>
              <span className={`text-xs mt-1 ${step >= s.number ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-2 rounded ${step > s.number ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-card rounded-3xl border border-border p-8">
        {/* Step 1: Patient Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <User className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold text-foreground">Patient Information</h2>
              <p className="text-muted-foreground">Enter the patient's basic details</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-foreground font-medium">Patient Name</Label>
                <Input
                  placeholder="Enter patient's full name"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-foreground font-medium">Age Range</Label>
                <Select 
                  value={formData.ageRange} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, ageRange: v }))}
                >
                  <SelectTrigger className="mt-2 h-12 rounded-2xl border-2">
                    <SelectValue placeholder="Select age range" />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_RANGES.map((age) => (
                      <SelectItem key={age.value} value={age.value}>
                        {age.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground font-medium">Preferred Language</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(v) => setFormData(prev => ({ ...prev, language: v as Language }))}
                >
                  <SelectTrigger className="mt-2 h-12 rounded-2xl border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label} ({lang.native})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              className="w-full" 
              size="lg"
              disabled={!formData.patientName || !formData.ageRange}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Symptoms */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Stethoscope className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold text-foreground">Symptoms</h2>
              <p className="text-muted-foreground">Select all symptoms the patient is experiencing</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SYMPTOM_OPTIONS.map((symptom) => (
                <label
                  key={symptom.id}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.symptoms.includes(symptom.id)
                      ? symptom.critical 
                        ? 'border-critical bg-critical/5' 
                        : 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Checkbox
                    checked={formData.symptoms.includes(symptom.id)}
                    onCheckedChange={() => handleSymptomToggle(symptom.id)}
                  />
                  <span className="flex-1 text-foreground font-medium">{symptom.label}</span>
                  {symptom.critical && (
                    <AlertTriangle className="w-5 h-5 text-critical" />
                  )}
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1" 
                disabled={formData.symptoms.length === 0}
                onClick={() => setStep(3)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <FileText className="w-12 h-12 mx-auto text-primary mb-3" />
              <h2 className="text-2xl font-bold text-foreground">Additional Details</h2>
              <p className="text-muted-foreground">Describe the symptoms in more detail</p>
            </div>

            <div>
              <Label className="text-foreground font-medium">Description</Label>
              <Textarea
                placeholder="Describe how the patient feels, when symptoms started, any relevant medical history..."
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="mt-2 min-h-[150px] rounded-2xl border-2"
              />
            </div>

            <div className="bg-muted/50 rounded-2xl p-4">
              <h3 className="font-medium text-foreground mb-2">Summary</h3>
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Patient:</span> {formData.patientName}</p>
                <p><span className="text-muted-foreground">Age:</span> {AGE_RANGES.find(a => a.value === formData.ageRange)?.label}</p>
                <p><span className="text-muted-foreground">Symptoms:</span> {formData.symptoms.length} selected</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Get Triage Result'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && result && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Triage Complete</h2>
              <div className="mt-3">
                <RiskBadge risk={result.riskLevel} size="lg" />
              </div>
            </div>

            {result.referralFacility && (
              <div className="bg-critical/5 border border-critical/20 rounded-2xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-critical" />
                  <span className="font-semibold text-foreground">Immediate Referral Required</span>
                </div>
                <p className="text-foreground">{result.referralFacility}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Possible Conditions</h3>
                <div className="flex flex-wrap gap-2">
                  {result.possibilities.map((p, i) => (
                    <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Immediate Actions</h3>
                <ul className="space-y-2">
                  {result.immediateActions.map((action, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <CheckCircle className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">CHV Guidance</h3>
                <ul className="space-y-2">
                  {result.chvGuidance.map((guide, i) => (
                    <li key={i} className="flex items-start gap-2 text-foreground">
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {guide}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-warning/5 border border-warning/20 rounded-2xl p-4">
              <p className="text-sm text-foreground">{result.disclaimer}</p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={resetForm} className="flex-1">
                New Triage
              </Button>
              <Button onClick={onComplete} className="flex-1">
                View Cases
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
