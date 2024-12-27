"use client";
import { useQuery } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import type { Candidate, Education, WorkHistory } from "@/types/candidate";
import { createClient } from "@/utils/supabase/client";
import { PeopleSearchResponse } from "@/types/PersonSearch";

const supabase = createClient();

export const CANDIDATES_QUERY_KEY = "candidates";

export const useCandidateSearch = (profileIds: string[]) => {
  const { activeProject } = useProject();

  return useQuery({
    queryKey: [CANDIDATES_QUERY_KEY, activeProject?.id, profileIds],
    queryFn: async () => {
      if (!activeProject?.id) {
        console.log("No active project found");
        throw new Error("No active project");
      }

      if (!profileIds || profileIds.length === 0) {
        throw new Error("No profile IDs provided");
      }

      const { data: searchQueryAndProfiles } = await supabase
      .from('user_queries_history')
      .select(
       `
       *,
       ...global_query_versions(
        candidate_ids
      )
      `
      )
      .eq('project_id', activeProject.id)
      .order('executed_at', {
        ascending: false,
      })
      .limit(1).single();

      console.log("searchQueryAndProfiles:", searchQueryAndProfiles);
      console.log("Profile IDs:", profileIds);

      const { data, error } = await supabase
        .rpc('get_profile_json', {
          p_profile_ids: searchQueryAndProfiles.candidate_ids
        });

      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }

      console.log("Raw candidates data:", data);

      return data;
    },
    enabled: !!activeProject?.id && profileIds.length > 0,
    staleTime: Infinity, // Never mark data as stale automatically
    gcTime: Infinity, // Keep unused data in cache forever
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
};