import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { SearchResult } from "@/types/PersonSearch";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const SHORTLISTED_CANDIDATES_KEY = "shortlisted-candidates";

export const useShortlistedCandidates = () => {
  const { activeProject } = useProject();
  const queryClient = useQueryClient();

  return {
    ...useQuery({
      queryKey: [SHORTLISTED_CANDIDATES_KEY, activeProject?.id],
      queryFn: async () => {
        if (!activeProject?.id) return [];

        const { data: shortlistData } = await supabase
          .from('shortlisted_candidates')
          .select('candidate_id')
          .eq('project_id', activeProject.id);

        if (!shortlistData?.length) return [];

        const candidateIds = shortlistData.map(item => item.candidate_id);
        
        // Call the get_profile_json RPC function with the candidate IDs
        const { data: profilesData, error } = await supabase
          .rpc('get_profile_json', {
            p_profile_ids: candidateIds
          });

        if (error) {
          console.error('Error fetching profiles:', error);
          return [];
        }

        return profilesData.results as SearchResult[];
      },
      enabled: !!activeProject?.id,
      staleTime: Infinity, // Never mark data as stale automatically
      gcTime: Infinity, // Keep unused data in cache forever
      refetchOnMount: false, // Don't refetch when component mounts
      refetchOnWindowFocus: false, // Don't refetch when window gains focus
      refetchOnReconnect: false, // Don't refetch when reconnecting
    }),
    invalidateShortlist: () => queryClient.invalidateQueries({ 
      queryKey: [SHORTLISTED_CANDIDATES_KEY, activeProject?.id] 
    })
  };
};
