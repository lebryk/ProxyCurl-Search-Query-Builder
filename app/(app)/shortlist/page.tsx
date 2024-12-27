"use client";
import { DetailedCandidateCard } from "@/components/features/DetailedCandidateCard";
import { useState } from "react";
import { SearchResult } from "@/types/PersonSearch";
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
  const [selectedCandidate, setSelectedCandidate] = useState<SearchResult | null>(null);
  const { toast } = useToast();
  const { activeProject } = useProject();
  const { data: shortlistedCandidates = [], invalidateShortlist } = useShortlistedCandidates();

  const handleRemoveCandidate = (public_identifier: string) => {
    const candidate = shortlistedCandidates.find(c => c.profile?.public_identifier === public_identifier);
    if (candidate?.profile) {
      setCandidateToRemove({ 
        id: public_identifier, 
        name: candidate.profile.full_name || `${candidate.profile.first_name || ''} ${candidate.profile.last_name || ''}`.trim() 
      });
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

  const handleCardClick = (candidate: SearchResult) => {
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
                {shortlistedCandidates.map((result) => {
                  if (!result.profile) return null;
                  const profile = result.profile;
                  const currentExperience = profile.experiences?.[0];
                  
                  return (
                    <DetailedCandidateCard
                      key={profile.public_identifier}
                      id={profile.public_identifier}
                      name={profile.full_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim()}
                      title={profile.headline || currentExperience?.title || 'Not specified'}
                      company={currentExperience?.company || 'Not specified'}
                      location={profile.city ? `${profile.city}, ${profile.country || ''}` : profile.country || 'Not specified'}
                      experience={currentExperience ? `${currentExperience.starts_at?.year || ''} - ${currentExperience.ends_at?.year || 'Present'}` : 'Not specified'}
                      skills={[]} // Skills are not available in the profile
                      summary={profile.summary || undefined}
                      imageUrl={profile.profile_pic_url || undefined}
                      isSelected={selectedCandidates.includes(profile.public_identifier)}
                      onSelect={handleRemoveCandidate}
                      onClick={() => handleCardClick(result)}
                    />
                  );
                })}
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
