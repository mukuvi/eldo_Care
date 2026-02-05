import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Camera, 
  CheckCircle, 
  XCircle,
  User,
  Calendar,
  FileText,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';

interface ImageUploadRecord {
  id: string;
  patientName: string;
  patientPhone: string;
  conditionType: string;
  description: string;
  imageCount: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: string;
  status: string;
  doctorNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export const ImageReview: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState<ImageUploadRecord | null>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const imageUploads: ImageUploadRecord[] = JSON.parse(localStorage.getItem('eldocare_image_uploads') || '[]');
  const pendingUploads = imageUploads.filter(u => u.status === 'pending-review');
  const reviewedUploads = imageUploads.filter(u => u.status !== 'pending-review');

  const handleReview = async (status: 'approved' | 'needs-followup') => {
    if (!selectedRecord) return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const updatedRecords = imageUploads.map(record => 
      record.id === selectedRecord.id 
        ? {
            ...record,
            status,
            doctorNotes,
            reviewedBy: user?.id,
            reviewedAt: new Date().toISOString(),
          }
        : record
    );

    localStorage.setItem('eldocare_image_uploads', JSON.stringify(updatedRecords));

    toast({
      title: status === 'approved' ? 'Review Approved' : 'Follow-up Required',
      description: `Case for ${selectedRecord.patientName} has been reviewed.`,
    });

    setSelectedRecord(null);
    setDoctorNotes('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Image Review</h1>
        <p className="text-muted-foreground mt-2">
          Review medical images uploaded by CHVs
        </p>
      </div>

      {selectedRecord ? (
        <div className="bg-card rounded-3xl border border-border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Review Case</h2>
            <Button variant="ghost" onClick={() => setSelectedRecord(null)}>
              Back to List
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Patient</p>
                  <p className="font-medium text-foreground">{selectedRecord.patientName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Uploaded</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(selectedRecord.createdAt), 'MMM d, yyyy h:mm a')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Condition Type</p>
                  <p className="font-medium text-foreground">{selectedRecord.conditionType}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Images</p>
                  <p className="font-medium text-foreground">{selectedRecord.imageCount} image(s)</p>
                </div>
              </div>
            </div>
          </div>

          {selectedRecord.description && (
            <div className="p-4 rounded-2xl bg-muted/30 mb-6">
              <p className="text-sm text-muted-foreground mb-1">CHV Notes:</p>
              <p className="text-foreground">{selectedRecord.description}</p>
            </div>
          )}

          <div className="bg-muted/20 rounded-2xl p-6 mb-6 text-center">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Image preview would be displayed here in production
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              (Images are stored securely and require backend integration)
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-foreground font-medium">Doctor's Notes</label>
              <Textarea
                placeholder="Enter your assessment, recommendations, or follow-up instructions..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                rows={4}
                className="rounded-2xl"
              />
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={() => handleReview('approved')}
                className="flex-1 gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Approve & Close
              </Button>
              <Button 
                onClick={() => handleReview('needs-followup')}
                variant="outline"
                className="flex-1 gap-2 border-warning text-warning hover:bg-warning/10"
                disabled={isSubmitting}
              >
                <XCircle className="w-5 h-5" />
                Needs Follow-up
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Pending Reviews */}
          <div className="bg-card rounded-3xl border border-border p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Pending Reviews ({pendingUploads.length})
            </h2>
            {pendingUploads.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="text-muted-foreground">All caught up! No pending reviews.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingUploads.map((record) => (
                  <div 
                    key={record.id} 
                    onClick={() => setSelectedRecord(record)}
                    className="p-4 rounded-2xl bg-warning/10 border border-warning/20 hover:bg-warning/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{record.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.conditionType} • {record.imageCount} image(s) • Uploaded by {record.uploadedByName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(record.createdAt), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-1 rounded-full bg-warning/20 text-warning font-medium">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reviewed */}
          {reviewedUploads.length > 0 && (
            <div className="bg-card rounded-3xl border border-border p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Recently Reviewed
              </h2>
              <div className="space-y-3">
                {reviewedUploads.slice(0, 5).map((record) => (
                  <div 
                    key={record.id} 
                    className="p-4 rounded-2xl bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{record.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.conditionType} • {format(new Date(record.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        record.status === 'approved' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-warning/20 text-warning'
                      }`}>
                        {record.status === 'approved' ? 'Approved' : 'Follow-up'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
