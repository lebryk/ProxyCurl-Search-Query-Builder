"use client";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { SearchResultsList } from "@/components/features/search/SearchResultsList";
import { SearchAIChat } from "@/components/features/SearchAIChat";
import { SearchQueryDisplay } from "@/components/features/chat/SearchQueryDisplay";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CandidateProfileDialog } from "@/components/features/CandidateProfileDialog";
import { useCandidateSearch } from "@/hooks/useCandidateSearch";
import { useProject } from "@/contexts/ProjectContext";
import { Upload } from "lucide-react";
import { importCandidateImages } from "@/utils/importCandidateImages";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useShortlistedCandidates } from "@/hooks/useShortlistedCandidates";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/types/PersonSearch";

const supabase = createClient();

const SearchResults = () => {
  const router = useRouter();
  const [selectedProfile, setSelectedProfile] = useState<SearchResult | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const { activeProject } = useProject();
  const queryClient = useQueryClient();
  
  // Get search results from React Query cache
  const { data: searchResults } = useQuery({
    queryKey: ['searchResults'],
    queryFn: () => queryClient.getQueryData(['searchResults']),
    enabled: true,
    staleTime: Infinity, // Keep the data fresh indefinitely
  });

  useEffect(() => {
    // If no search results are found, redirect back to search page
    if (!searchResults) {
      toast({
        title: "No search results found",
        description: "Please perform a search first",
        variant: "destructive",
      });
      router.push('/search');
    }
  }, [searchResults, router, toast]);

  const { data: candidates, isLoading, error } = useCandidateSearch(
    searchResults.results?.candidateIds
  );
  const { data: shortlistedCandidates = [], invalidateShortlist } = useShortlistedCandidates();
  const selectedCandidateIds = shortlistedCandidates.map(c => c.profile?.public_identifier).filter(Boolean);

  console.log("SearchResults render - Active Project:", activeProject);
  console.log("SearchResults render - Candidates:", candidates?.results);
  console.log("SearchResults render - Shortlisted:", shortlistedCandidates);
  console.log("SearchResults render - Selected IDs:", selectedCandidateIds);

  const handleImportImages = async () => {
    try {
      setIsImporting(true);
      const result = await importCandidateImages();
      toast({
        title: "Images imported successfully",
        description: `Processed ${result.results.length} candidate images`,
      });
    } catch (error) {
      toast({
        title: "Error importing images",
        description: "Failed to import candidate images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleCandidateSelect = async (id: string) => {
    if (!activeProject?.id) return;

    const isSelected = selectedCandidateIds.includes(id);
    
    try {
      if (isSelected) {
        // Remove from shortlist
        const { error } = await supabase
          .from('shortlisted_candidates')
          .delete()
          .eq('project_id', activeProject.id)
          .eq('candidate_id', id);

        if (error) throw error;

        toast({
          title: "Removed from shortlist",
          description: "Candidate removed from shortlist",
          action: <ToastAction altText="Go to shortlist" onClick={() => router.push("/shortlist")}>
            Go to Shortlist
          </ToastAction>,
        });
      } else {
        // Add to shortlist
        const { error } = await supabase
          .from('shortlisted_candidates')
          .insert({
            project_id: activeProject.id,
            candidate_id: id
          });

        if (error) throw error;

        toast({
          title: "Added to shortlist",
          description: "Candidate added to shortlist",
          action: <ToastAction altText="Go to shortlist" onClick={() => router.push("/shortlist")}>
            Go to Shortlist
          </ToastAction>,
        });
      }

      // Invalidate queries
      await invalidateShortlist();
    } catch (error) {
      console.error('Error managing shortlist:', error);
      toast({
        title: "Error",
        description: "Failed to update shortlist. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleProfileClick = (public_identifier: string) => {
    console.log("Profile clicked:", public_identifier);
    console.log("Candidates data:", candidates);
    const candidate = candidates.results.find(c => {
      console.log("Checking candidate:", c);
      return c.profile?.public_identifier === public_identifier;
    });
    console.log("Found candidate:", candidate);
    if (candidate) {
      setSelectedProfile(candidate);
    }
  };

  if (!activeProject) {
    console.log("No active project found in SearchResults");
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Please select a project to continue</p>
      </div>
    );
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={65} minSize={30}>
        <main className="h-screen overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold">Search Results</h1>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleImportImages}
                  disabled={isImporting}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {isImporting ? "Importing..." : "Import Images"}
                </Button>
                <Button
                  variant="outline"
                  className="h-8"
                  onClick={() => router.push("/search")}
                >
                  Edit Query
                </Button>
                <Button
                  variant="default"
                  className="h-8"
                  onClick={() => router.push("/shortlist")}
                >
                  Go to Shortlist
                </Button>
              </div>
            </div>
            <SearchQueryDisplay />
            {error ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-red-500">Error loading candidates: {error.message}</p>
              </div>
            ) : isLoading ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Loading candidates...</p>
              </div>
            ) : !candidates || candidates.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">No candidates found</p>
              </div>
            ) : (
              <SearchResultsList 
                selectedCandidates={selectedCandidateIds}
                onCandidateSelect={handleCandidateSelect}
                onProfileClick={handleProfileClick}
                candidates={candidates.results}
              />
            )}
          </div>
        </main>
      </ResizablePanel>
      
      <ResizableHandle withHandle />
      
      <ResizablePanel defaultSize={35} minSize={20} className="h-screen">
        <SearchAIChat />
      </ResizablePanel>

      <CandidateProfileDialog
        candidate={selectedProfile}
        isOpen={selectedProfile !== null}
        onClose={() => setSelectedProfile(null)}
      />
    </ResizablePanelGroup>
  );
};

export default SearchResults;