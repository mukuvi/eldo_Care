import { RiskLevel, HealthGuidance, SYMPTOM_OPTIONS } from '@/types';

interface TriageInput {
  ageRange: string;
  symptoms: string[];
  description: string;
}

// Critical symptom combinations that require immediate referral
const CRITICAL_RULES = [
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('difficulty-breathing'),
    guidance: {
      riskLevel: 'critical' as RiskLevel,
      referralFacility: 'Nearest Emergency Facility',
      immediateActions: [
        'Keep patient calm and seated upright',
        'Loosen any tight clothing',
        'Monitor breathing rate',
        'Prepare for emergency transport'
      ],
      possibilities: ['Respiratory distress', 'Asthma attack', 'Pneumonia', 'COVID-19'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('severe-bleeding'),
    guidance: {
      riskLevel: 'critical' as RiskLevel,
      referralFacility: 'Nearest Emergency Facility',
      immediateActions: [
        'Apply direct pressure to wound with clean cloth',
        'Elevate bleeding limb if possible',
        'Do not remove embedded objects',
        'Prepare for emergency transport'
      ],
      possibilities: ['Trauma', 'Internal bleeding', 'Hemorrhage'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('high-fever') && 
      (input.ageRange === 'infant' || input.ageRange === 'child'),
    guidance: {
      riskLevel: 'critical' as RiskLevel,
      referralFacility: 'Pediatric Emergency Unit',
      immediateActions: [
        'Cool the child with lukewarm water sponge bath',
        'Remove excess clothing',
        'Give oral rehydration if conscious',
        'Monitor for seizures',
        'Transport to facility immediately'
      ],
      possibilities: ['Malaria', 'Typhoid', 'Meningitis', 'Severe infection'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('unconscious'),
    guidance: {
      riskLevel: 'critical' as RiskLevel,
      referralFacility: 'Nearest Emergency Facility',
      immediateActions: [
        'Check airway, breathing, and pulse',
        'Place in recovery position if breathing',
        'Do not give anything by mouth',
        'Call for emergency transport immediately'
      ],
      possibilities: ['Head injury', 'Stroke', 'Diabetic emergency', 'Poisoning'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('chest-pain'),
    guidance: {
      riskLevel: 'critical' as RiskLevel,
      referralFacility: 'Cardiac Emergency Unit',
      immediateActions: [
        'Keep patient calm and still',
        'Loosen tight clothing',
        'If available, give aspirin (unless allergic)',
        'Monitor vital signs',
        'Prepare for emergency transport'
      ],
      possibilities: ['Heart attack', 'Angina', 'Pulmonary embolism'],
    }
  },
];

// High risk rules
const HIGH_RISK_RULES = [
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('high-fever') && input.symptoms.includes('severe-headache'),
    guidance: {
      riskLevel: 'high' as RiskLevel,
      referralFacility: 'District Hospital',
      immediateActions: [
        'Keep patient hydrated',
        'Monitor temperature regularly',
        'Look for signs of neck stiffness',
        'Seek medical attention within 2 hours'
      ],
      possibilities: ['Malaria', 'Meningitis', 'Typhoid fever'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('vomiting') && input.symptoms.includes('diarrhea') &&
      (input.ageRange === 'infant' || input.ageRange === 'child'),
    guidance: {
      riskLevel: 'high' as RiskLevel,
      referralFacility: 'Pediatric Unit',
      immediateActions: [
        'Start oral rehydration therapy immediately',
        'Give small, frequent sips of ORS',
        'Monitor for signs of dehydration',
        'Seek medical attention within 4 hours'
      ],
      possibilities: ['Gastroenteritis', 'Cholera', 'Food poisoning'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('abdominal-pain') && input.symptoms.includes('high-fever'),
    guidance: {
      riskLevel: 'high' as RiskLevel,
      referralFacility: 'District Hospital',
      immediateActions: [
        'Do not give food until evaluated',
        'Monitor pain location and intensity',
        'Check for abdominal rigidity',
        'Seek medical attention within 4 hours'
      ],
      possibilities: ['Appendicitis', 'Intestinal infection', 'Typhoid'],
    }
  },
];

// Medium risk rules
const MEDIUM_RISK_RULES = [
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('persistent-cough') && input.symptoms.length >= 2,
    guidance: {
      riskLevel: 'medium' as RiskLevel,
      referralFacility: 'Health Center',
      immediateActions: [
        'Ensure adequate rest',
        'Increase fluid intake',
        'Monitor for fever development',
        'Schedule clinic visit within 24-48 hours'
      ],
      possibilities: ['Upper respiratory infection', 'Bronchitis', 'Early pneumonia'],
    }
  },
  {
    condition: (input: TriageInput) => 
      input.symptoms.includes('high-fever') && input.ageRange !== 'infant' && input.ageRange !== 'child',
    guidance: {
      riskLevel: 'medium' as RiskLevel,
      referralFacility: 'Health Center',
      immediateActions: [
        'Give paracetamol for fever',
        'Ensure adequate hydration',
        'Monitor temperature every 4 hours',
        'Visit clinic within 24 hours if fever persists'
      ],
      possibilities: ['Viral infection', 'Malaria', 'Urinary tract infection'],
    }
  },
];

export const runTriageEngine = (input: TriageInput): HealthGuidance => {
  // Check critical rules first
  for (const rule of CRITICAL_RULES) {
    if (rule.condition(input)) {
      return {
        ...rule.guidance,
        chvGuidance: [
          'This is an EMERGENCY case requiring immediate referral',
          'Contact emergency services or arrange transport immediately',
          'Stay with the patient and monitor vital signs',
          'Document all observations for the receiving facility'
        ],
        disclaimer: 'IMPORTANT: This AI-powered guidance is for preliminary assessment only and does not constitute a medical diagnosis. Always seek professional medical care for proper evaluation and treatment.'
      };
    }
  }

  // Check high risk rules
  for (const rule of HIGH_RISK_RULES) {
    if (rule.condition(input)) {
      return {
        ...rule.guidance,
        chvGuidance: [
          'This case requires urgent medical attention',
          'Arrange transport to the recommended facility',
          'Provide first aid as indicated',
          'Monitor patient condition during transport'
        ],
        disclaimer: 'IMPORTANT: This AI-powered guidance is for preliminary assessment only and does not constitute a medical diagnosis. Always seek professional medical care for proper evaluation and treatment.'
      };
    }
  }

  // Check medium risk rules
  for (const rule of MEDIUM_RISK_RULES) {
    if (rule.condition(input)) {
      return {
        ...rule.guidance,
        chvGuidance: [
          'Monitor the patient closely over the next 24 hours',
          'Provide supportive care as indicated',
          'Arrange clinic visit if symptoms worsen',
          'Educate patient/family on warning signs'
        ],
        disclaimer: 'IMPORTANT: This AI-powered guidance is for preliminary assessment only and does not constitute a medical diagnosis. Always seek professional medical care for proper evaluation and treatment.'
      };
    }
  }

  // Default low risk assessment
  const symptomLabels = input.symptoms
    .map(s => SYMPTOM_OPTIONS.find(opt => opt.id === s)?.label)
    .filter(Boolean);

  return {
    riskLevel: 'low',
    possibilities: ['Minor ailment', 'Viral infection', 'Stress-related symptoms'],
    chvGuidance: [
      'Provide reassurance and basic health education',
      'Advise on home remedies and rest',
      'Schedule follow-up in 3-5 days if symptoms persist',
      'Educate on when to seek immediate care'
    ],
    referralFacility: null,
    immediateActions: [
      'Ensure adequate rest and hydration',
      'Monitor symptoms over the next few days',
      'Use over-the-counter remedies as appropriate',
      'Return if symptoms worsen or new symptoms develop'
    ],
    disclaimer: 'IMPORTANT: This AI-powered guidance is for preliminary assessment only and does not constitute a medical diagnosis. Always seek professional medical care for proper evaluation and treatment.'
  };
};

export const getRiskColor = (risk: RiskLevel): string => {
  switch (risk) {
    case 'low': return 'risk-badge-low';
    case 'medium': return 'risk-badge-medium';
    case 'high': return 'risk-badge-high';
    case 'critical': return 'risk-badge-critical';
    default: return 'risk-badge-low';
  }
};

export const getRiskLabel = (risk: RiskLevel): string => {
  switch (risk) {
    case 'low': return 'Low Risk';
    case 'medium': return 'Medium Risk';
    case 'high': return 'High Risk';
    case 'critical': return 'CRITICAL';
    default: return 'Unknown';
  }
};
