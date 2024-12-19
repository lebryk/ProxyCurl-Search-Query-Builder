"use client";
import { DetailedCandidateCard } from "@/components/features/DetailedCandidateCard";
import { useState } from "react";
import type { Candidate } from "@/types/candidate";
import { useToast } from "@/components/ui/use-toast";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { ShortlistChecklist } from "@/components/features/shortlist/ShortlistChecklist";
import { RemoveCandidateDialog } from "@/components/features/shortlist/RemoveCandidateDialog";
import { CandidateProfileDialog } from "@/components/features/CandidateProfileDialog";
import { useProject } from "@/contexts/ProjectContext";
import { useShortlistedCandidates } from "@/hooks/useShortlistedCandidates";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const Shortlist = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [candidateToRemove, setCandidateToRemove] = useState<{ id: string; name: string } | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const { toast } = useToast();
  const { activeProject } = useProject();
  const { data: shortlistedCandidates = [], invalidateShortlist } = useShortlistedCandidates();

  const handleRemoveCandidate = (id: string) => {
    const candidate = shortlistedCandidates.find(c => c.id === id);
    if (candidate) {
      setCandidateToRemove({ id: candidate.id, name: candidate.name });
    }
  };

  const confirmRemoveCandidate = async () => {
    if (!candidateToRemove) return;

    const { error } = await supabase
      .from('shortlisted_candidates')
      .delete()
      .eq('candidate_id', candidateToRemove.id)
      .eq('project_id', activeProject?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove candidate from shortlist.",
        variant: "destructive",
      });
      return;
    }

    // Invalidate queries
    await invalidateShortlist();
    
    toast({
      title: "Success",
      description: "Candidate removed from shortlist.",
    });

    setCandidateToRemove(null);
  };

  const handleCardClick = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
  };

  return (
    <>
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        <ResizablePanel defaultSize={65} minSize={30}>
          <main className="h-screen overflow-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold">Shortlisted Candidates ({shortlistedCandidates.length})</h1>
              </div>
              <div className="grid gap-4">
                {shortlistedCandidates.map((candidate) => (
                  <DetailedCandidateCard
                    key={candidate.id}
                    {...candidate}
                    isSelected={selectedCandidates.includes(candidate.id)}
                    onSelect={handleRemoveCandidate}
                    onClick={() => handleCardClick(candidate)}
                  />
                ))}
                {shortlistedCandidates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No candidates have been shortlisted yet
                  </div>
                )}
              </div>
            </div>
          </main>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={35} minSize={30}>
          <ShortlistChecklist candidates={shortlistedCandidates} />
        </ResizablePanel>
      </ResizablePanelGroup>

      <RemoveCandidateDialog
        isOpen={candidateToRemove !== null}
        onOpenChange={(open) => !open && setCandidateToRemove(null)}
        candidateName={candidateToRemove?.name || ''}
        onConfirm={confirmRemoveCandidate}
      />

      <CandidateProfileDialog
        candidate={selectedCandidate}
        isOpen={selectedCandidate !== null}
        onClose={() => setSelectedCandidate(null)}
      />
    </>
  );
};

export default Shortlist;
