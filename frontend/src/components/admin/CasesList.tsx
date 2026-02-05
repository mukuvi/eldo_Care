import React, { useState } from 'react';
import { getCases, updateCase } from '@/lib/storage';
import { PatientCase, RiskLevel } from '@/types';
import { RiskBadge } from '@/components/RiskBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter,
  Calendar,
  Eye,
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface CasesListProps {
  filterByUser?: string;
}

export const CasesList: React.FC<CasesListProps> = ({ filterByUser }) => {
  const [cases, setCases] = useState(getCases());
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all');
  const [selectedCase, setSelectedCase] = useState<PatientCase | null>(null);

  const refreshCases = () => setCases(getCases());

  const filteredCases = cases
    .filter(c => !filterByUser || c.createdBy === filterByUser)
    .filter(c => {
      const matchesSearch = c.patientName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
      return matchesSearch && matchesRisk;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleResolve = (caseId: string) => {
    updateCase(caseId, { status: 'resolved' });
    refreshCases();
    setSelectedCase(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {filterByUser ? 'My Cases' : 'All Cases'}
        </h1>
        <p className="text-muted-foreground mt-1">
          {filteredCases.length} case{filteredCases.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>
        <Select value={riskFilter} onValueChange={(v) => setRiskFilter(v as RiskLevel | 'all')}>
          <SelectTrigger className="w-full sm:w-48 h-12 rounded-2xl border-2">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cases Grid */}
      {filteredCases.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border p-12 text-center">
          <p className="text-muted-foreground">No cases found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredCases.map((c) => (
            <div 
              key={c.id}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-foreground text-lg">{c.patientName}</h3>
                    <RiskBadge risk={c.riskLevel} size="sm" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(c.createdAt), 'MMM d, yyyy h:mm a')}
                    </span>
                    <span>By: {c.createdByName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      c.status === 'resolved' ? 'bg-success/10 text-success' :
                      c.status === 'referred' ? 'bg-primary/10 text-primary' :
                      c.status === 'in-progress' ? 'bg-warning/10 text-warning' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCase(c)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Details Modal */}
      <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Case Details</DialogTitle>
          </DialogHeader>
          
          {selectedCase && (
            <div className="space-y-6 mt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{selectedCase.patientName}</h3>
                  <p className="text-muted-foreground">{selectedCase.ageRange}</p>
                </div>
                <RiskBadge risk={selectedCase.riskLevel} size="lg" />
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Symptoms</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCase.symptoms.map((s, i) => (
                    <span key={i} className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedCase.description && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">Description</h4>
                  <p className="text-muted-foreground">{selectedCase.description}</p>
                </div>
              )}

              {selectedCase.aiGuidance && (
                <>
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Possible Conditions</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.aiGuidance.possibilities.map((p, i) => (
                        <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-2">Immediate Actions</h4>
                    <ul className="space-y-1">
                      {selectedCase.aiGuidance.immediateActions.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-primary mt-1 shrink-0" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {selectedCase.referralFacility && (
                    <div className="bg-critical/5 border border-critical/20 rounded-2xl p-4">
                      <h4 className="font-medium text-foreground mb-1">Referral</h4>
                      <p className="text-foreground">{selectedCase.referralFacility}</p>
                    </div>
                  )}
                </>
              )}

              {selectedCase.status !== 'resolved' && (
                <Button 
                  className="w-full" 
                  onClick={() => handleResolve(selectedCase.id)}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Mark as Resolved
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
