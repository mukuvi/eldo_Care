export type UserRole = 'admin' | 'chv' | 'user' | 'doctor';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type Language = 'english' | 'kikuyu' | 'kalenjin' | 'luo' | 'kisii' | 'luhya';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  healthStation?: string;
  phone?: string;
  licenseNumber?: string; // For doctors
  chvIdNumber?: string; // For CHVs
  createdAt: string;
  isActive: boolean;
}

export interface PatientCase {
  id: string;
  patientName: string;
  ageRange: string;
  symptoms: string[];
  description: string;
  riskLevel: RiskLevel;
  aiGuidance: HealthGuidance | null;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'referred' | 'resolved';
  referralFacility?: string;
  language: Language;
}

export interface HealthGuidance {
  riskLevel: RiskLevel;
  possibilities: string[];
  chvGuidance: string[];
  referralFacility: string | null;
  immediateActions: string[];
  disclaimer: string;
}

export interface VoiceSession {
  id: string;
  patientId?: string;
  language: Language;
  startTime: string;
  endTime?: string;
  transcript: TranscriptEntry[];
  summary?: HealthGuidance;
  status: 'active' | 'completed' | 'transferred';
  transferredTo?: 'triage-officer' | 'clinical-officer';
}

export interface TranscriptEntry {
  speaker: 'patient' | 'ai' | 'officer';
  text: string;
  timestamp: string;
}

export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  urgentRisks: number;
  referralCount: number;
  chvCount: number;
  userCount: number;
}

export const SYMPTOM_OPTIONS = [
  { id: 'difficulty-breathing', label: 'Difficulty Breathing', critical: true },
  { id: 'severe-bleeding', label: 'Severe Bleeding', critical: true },
  { id: 'chest-pain', label: 'Chest Pain', critical: true },
  { id: 'unconscious', label: 'Loss of Consciousness', critical: true },
  { id: 'high-fever', label: 'High Fever', critical: false },
  { id: 'persistent-cough', label: 'Persistent Cough', critical: false },
  { id: 'severe-headache', label: 'Severe Headache', critical: false },
  { id: 'vomiting', label: 'Vomiting/Nausea', critical: false },
  { id: 'diarrhea', label: 'Diarrhea', critical: false },
  { id: 'abdominal-pain', label: 'Abdominal Pain', critical: false },
  { id: 'skin-rash', label: 'Skin Rash', critical: false },
  { id: 'joint-pain', label: 'Joint/Muscle Pain', critical: false },
  { id: 'fatigue', label: 'Extreme Fatigue', critical: false },
  { id: 'swelling', label: 'Swelling', critical: false },
];

export const AGE_RANGES = [
  { value: 'infant', label: 'Infant (0-1 years)' },
  { value: 'child', label: 'Child (1-5 years)' },
  { value: 'youth', label: 'Youth (5-18 years)' },
  { value: 'adult', label: 'Adult (18-45 years)' },
  { value: 'middle-age', label: 'Middle Age (45-65 years)' },
  { value: 'elderly', label: 'Elderly (65+ years)' },
];

export const LANGUAGES: { value: Language; label: string; native: string }[] = [
  { value: 'english', label: 'English', native: 'English' },
  { value: 'kikuyu', label: 'Kikuyu', native: 'Gĩkũyũ' },
  { value: 'kalenjin', label: 'Kalenjin', native: 'Kalenjin' },
  { value: 'luo', label: 'Luo', native: 'Dholuo' },
  { value: 'kisii', label: 'Kisii', native: 'Ekegusii' },
  { value: 'luhya', label: 'Luhya', native: 'Oluluhya' },
];

export const HEALTH_STATIONS = [
  'Nairobi Central Health Center',
  'Kisumu County Hospital',
  'Eldoret Referral Hospital',
  'Mombasa District Hospital',
  'Nakuru Level 5 Hospital',
  'Nyeri Provincial Hospital',
  'Machakos Level 5 Hospital',
  'Kakamega County Hospital',
  'Kitale District Hospital',
  'Meru Teaching Hospital',
];
