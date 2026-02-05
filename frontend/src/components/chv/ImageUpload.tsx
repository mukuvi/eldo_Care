import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  Upload, 
  X, 
  Image as ImageIcon,
  Send,
  User,
  FileImage,
  Loader2
} from 'lucide-react';

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  description: string;
}

const SKIN_CONDITIONS = [
  'Rash',
  'Wound/Laceration',
  'Burns',
  'Skin Infection',
  'Swelling',
  'Discoloration',
  'Ulcer',
  'Allergic Reaction',
  'Other',
];

export const ImageUpload: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [conditionType, setConditionType] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File',
          description: 'Please select only image files',
          variant: 'destructive',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const newImage: UploadedImage = {
          id: `img-${Date.now()}-${Math.random()}`,
          file,
          preview: reader.result as string,
          description: '',
        };
        setImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (images.length === 0) {
      toast({
        title: 'No Images',
        description: 'Please upload at least one image',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate upload - in production this would send to a server
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Store in localStorage for demo
    const imageRecords = JSON.parse(localStorage.getItem('eldocare_image_uploads') || '[]');
    const newRecord = {
      id: `upload-${Date.now()}`,
      patientName,
      patientPhone,
      conditionType,
      description,
      imageCount: images.length,
      uploadedBy: user?.id,
      uploadedByName: user?.fullName,
      createdAt: new Date().toISOString(),
      status: 'pending-review',
    };
    localStorage.setItem('eldocare_image_uploads', JSON.stringify([...imageRecords, newRecord]));

    toast({
      title: 'Images Uploaded Successfully',
      description: 'The medical images have been sent to the doctor for review.',
    });

    // Reset form
    setPatientName('');
    setPatientPhone('');
    setConditionType('');
    setDescription('');
    setImages([]);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Upload Medical Images</h1>
        <p className="text-muted-foreground mt-2">
          Capture and upload images of skin conditions for doctor review
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border p-8 space-y-6">
        {/* Patient Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Patient Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientName">Patient Name</Label>
              <Input
                id="patientName"
                placeholder="Full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientPhone">Phone Number</Label>
              <Input
                id="patientPhone"
                type="tel"
                placeholder="+254 7XX XXX XXX"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Condition Type */}
        <div className="space-y-2">
          <Label>Condition Type</Label>
          <Select value={conditionType} onValueChange={setConditionType} required>
            <SelectTrigger className="h-12 rounded-2xl">
              <SelectValue placeholder="Select condition type" />
            </SelectTrigger>
            <SelectContent className="bg-card border border-border z-50">
              {SKIN_CONDITIONS.map((condition) => (
                <SelectItem key={condition} value={condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Image Upload Area */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileImage className="w-5 h-5 text-primary" />
            Medical Images
          </h2>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div 
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
          >
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-foreground font-medium">Click to upload images</p>
            <p className="text-sm text-muted-foreground mt-1">or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 10MB each</p>
          </div>

          {/* Image Previews */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.preview}
                    alt="Upload preview"
                    className="w-full h-32 object-cover rounded-xl border border-border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(img.id)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Additional Notes</Label>
          <Textarea
            id="description"
            placeholder="Describe the condition, when it started, any symptoms..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="rounded-2xl"
          />
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          size="lg" 
          disabled={isSubmitting || images.length === 0}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Send to Doctor
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
