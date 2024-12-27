"use client";
import { useQuery } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { createClient } from "@/utils/supabase/client";
import { SearchResult } from "@/types/PersonSearch";

const supabase = createClient();

export const CANDIDATES_QUERY_KEY = "candidates";

interface CandidateSearchResponse {
  results: SearchResult[];
}

export const useCandidateSearch = (profileIds?: string[] | null) => {
  const { activeProject } = useProject();

  return useQuery<CandidateSearchResponse>({
    queryKey: [CANDIDATES_QUERY_KEY, activeProject?.id, profileIds],
    queryFn: async () => {
      if (!activeProject?.id) {
        console.log("No active project found");
        throw new Error("No active project");
      }

      if (!profileIds?.length) {
        return { results: [] };
      }

      const { data, error } = await supabase
        .rpc('get_profile_json', {
          p_profile_ids: profileIds
        });

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      return {
        results: data || []
      };
    },
    enabled: !!activeProject?.id && !!profileIds?.length,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};