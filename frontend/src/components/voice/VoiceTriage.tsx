import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RiskBadge } from '@/components/RiskBadge';
import { LANGUAGES, Language, TranscriptEntry } from '@/types';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2,
  Signal,
  Clock,
  User,
  Bot,
  UserCog,
  ArrowRight
} from 'lucide-react';

export const VoiceTriage: React.FC = () => {
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('english');
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [transferTo, setTransferTo] = useState<'triage-officer' | 'clinical-officer' | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Simulated call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [transcript]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCall = () => {
    setIsCallActive(true);
    setCallDuration(0);
    setTranscript([]);
    setTransferTo(null);
    
    // Simulate initial AI greeting based on language
    const greetings: Record<Language, string> = {
      english: "Hello! Welcome to Eldocare health consultation. I'm your AI health assistant. Please describe your symptoms or health concerns.",
      kikuyu: "Ũhoro! Nĩ ndakũmukiria kũrĩ Eldocare. Ndĩ mũtaanĩri wa mũhĩrĩga. Taariria mathĩĩna maku ma mũhĩrĩga.",
      kalenjin: "Chamge! Missing ne ak Eldocare. Ani assistant ne konyei agenge. Imuche amwa ichek betit ne itinye.",
      luo: "Misawa! Oriti e Eldocare. An e jakony mar ngima maber. Nyisa chandruok ma in-go.",
      kisii: "Bwakire! Oywa Eldocare. Ndi omobambanyi omoreria bwo amagambane. Mbairia ekero oria nkoera.",
      luhya: "Mlembe! Okhwenya khula Eldocare. Ndi omukhanani wowu wamakhongo. Mbolela esisani shio shino.",
    };

    setTimeout(() => {
      setTranscript([{
        speaker: 'ai',
        text: greetings[language],
        timestamp: new Date().toISOString(),
      }]);
    }, 1000);

    // Simulate conversation flow
    simulateConversation();
  };

  const simulateConversation = () => {
    const responses = [
      { delay: 5000, speaker: 'patient' as const, text: "I have been experiencing severe headaches and fever for two days now." },
      { delay: 8000, speaker: 'ai' as const, text: "I understand you're experiencing headaches and fever. On a scale of 1-10, how would you rate your headache? And have you measured your temperature?" },
      { delay: 15000, speaker: 'patient' as const, text: "The headache is about 7 out of 10. My temperature was 38.5 degrees this morning." },
      { delay: 18000, speaker: 'ai' as const, text: "Thank you for that information. A fever of 38.5°C with severe headache requires attention. Are you experiencing any other symptoms like neck stiffness, sensitivity to light, or vomiting?" },
    ];

    responses.forEach(({ delay, speaker, text }) => {
      setTimeout(() => {
        if (isCallActive) {
          setTranscript(prev => [...prev, {
            speaker,
            text,
            timestamp: new Date().toISOString(),
          }]);
        }
      }, delay);
    });
  };

  const endCall = () => {
    setIsCallActive(false);
    // Add summary entry
    setTranscript(prev => [...prev, {
      speaker: 'ai',
      text: "Thank you for using Eldocare. Based on our conversation, I recommend seeking medical attention at your nearest health facility. Please take care and stay hydrated.",
      timestamp: new Date().toISOString(),
    }]);
  };

  const transferCall = (to: 'triage-officer' | 'clinical-officer') => {
    setTransferTo(to);
    setTranscript(prev => [...prev, {
      speaker: 'ai',
      text: `Transferring your call to the ${to === 'triage-officer' ? 'Triage Officer' : 'Clinical Officer'} on duty. Please hold...`,
      timestamp: new Date().toISOString(),
    }]);
    
    setTimeout(() => {
      setTranscript(prev => [...prev, {
        speaker: 'officer',
        text: `Hello, I'm the ${to === 'triage-officer' ? 'Triage Officer' : 'Clinical Officer'} on duty. I've reviewed your case. How can I help you further?`,
        timestamp: new Date().toISOString(),
      }]);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Voice Health Consultation</h1>
        <p className="text-muted-foreground mt-2">
          Speak with our AI health assistant in your preferred language
        </p>
      </div>

      {/* Phone UI Container */}
      <div className="bg-card rounded-[2.5rem] border-4 border-border shadow-xl overflow-hidden">
        {/* Status Bar */}
        <div className="bg-foreground/5 px-6 py-2 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Signal className="w-4 h-4 text-foreground" />
            <span className="text-foreground font-medium">Eldocare</span>
          </div>
          <div className="flex items-center gap-4">
            {isCallActive && (
              <span className="flex items-center gap-1 text-success">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                Connected
              </span>
            )}
            <span className="text-muted-foreground">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6">
          {!isCallActive ? (
            /* Pre-call UI */
            <div className="text-center space-y-8 py-8">
              <div className="w-32 h-32 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="w-16 h-16 text-primary" />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-foreground">Select Language</label>
                <Select value={language} onValueChange={(v) => setLanguage(v as Language)}>
                  <SelectTrigger className="w-full max-w-xs mx-auto h-12 rounded-2xl border-2">
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

              <Button 
                size="xl" 
                onClick={startCall}
                className="rounded-full px-12 shadow-health-lg"
              >
                <Phone className="w-6 h-6 mr-2" />
                Start Consultation
              </Button>

              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                You will be connected to our AI health assistant who will help assess your symptoms
              </p>
            </div>
          ) : (
            /* Active Call UI */
            <div className="space-y-6">
              {/* Call Info */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-success mb-2">
                  <span className="w-3 h-3 rounded-full bg-success animate-pulse" />
                  <span className="font-medium">Call Active</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-3xl font-mono text-foreground">
                  <Clock className="w-6 h-6" />
                  {formatDuration(callDuration)}
                </div>
                {transferTo && (
                  <div className="mt-2 text-sm text-primary font-medium">
                    Connected to {transferTo === 'triage-officer' ? 'Triage Officer' : 'Clinical Officer'}
                  </div>
                )}
              </div>

              {/* Transcript */}
              <div 
                ref={transcriptRef}
                className="h-64 overflow-y-auto bg-muted/30 rounded-2xl p-4 space-y-3"
              >
                {transcript.map((entry, i) => (
                  <div 
                    key={i}
                    className={`flex gap-3 ${entry.speaker === 'patient' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      entry.speaker === 'patient' 
                        ? 'bg-primary text-primary-foreground' 
                        : entry.speaker === 'officer'
                        ? 'bg-warning text-warning-foreground'
                        : 'bg-accent text-accent-foreground'
                    }`}>
                      {entry.speaker === 'patient' ? <User className="w-4 h-4" /> : 
                       entry.speaker === 'officer' ? <UserCog className="w-4 h-4" /> :
                       <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`max-w-[80%] p-3 rounded-2xl ${
                      entry.speaker === 'patient' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-card border border-border text-foreground'
                    }`}>
                      <p className="text-sm">{entry.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transfer Options */}
              {!transferTo && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => transferCall('triage-officer')}
                    className="flex-1 text-xs"
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Triage Officer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => transferCall('clinical-officer')}
                    className="flex-1 text-xs"
                  >
                    <ArrowRight className="w-4 h-4 mr-1" />
                    Clinical Officer
                  </Button>
                </div>
              )}

              {/* Call Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                </Button>
                
                <Button
                  variant="critical"
                  size="icon"
                  className="w-16 h-16 rounded-full"
                  onClick={endCall}
                >
                  <PhoneOff className="w-8 h-8" />
                </Button>
                
                <Button
                  variant="outline"
                  size="icon"
                  className="w-14 h-14 rounded-full"
                >
                  <Volume2 className="w-6 h-6" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="h-1 bg-foreground/20 mx-auto w-32 rounded-full mb-4" />
      </div>

      {/* Disclaimer */}
      <div className="mt-6 bg-warning/5 border border-warning/20 rounded-2xl p-4">
        <p className="text-sm text-foreground">
          <strong>Medical Disclaimer:</strong> This AI-powered consultation provides health guidance only 
          and does not replace professional medical advice. In case of emergency, please call emergency 
          services or visit your nearest health facility immediately.
        </p>
      </div>
    </div>
  );
};
