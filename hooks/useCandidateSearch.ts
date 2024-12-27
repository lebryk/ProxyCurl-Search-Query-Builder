"use client";
import { useQuery } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import { createClient } from "@/utils/supabase/client";
import { PeopleSearchResponse } from "@/types/PersonSearch";

const supabase = createClient();

export const CANDIDATES_QUERY_KEY = "candidates";

export const useCandidateSearch = (profileIds: string[]) => {
  const { activeProject } = useProject();

  const { data: searchQueryAndProfiles } = useQuery({
    queryKey: ['searchQueryHistory', activeProject?.id],
    queryFn: async () => {
      if (!activeProject?.id) {
        return { global_query_versions: { candidate_ids: [] } };
      }
      if (profileIds && profileIds.length > 0) {
        return { global_query_versions: { candidate_ids: [] } };
      }

      const { data } = await supabase
        .from('user_queries_history')
        .select(
          `
          *,
          global_query_versions!inner (
            candidate_ids
          )
          `
        )
        .eq('project_id', activeProject.id)
        .order('executed_at', {
          ascending: false,
        })
        .limit(1)
        .single();

      return data || { global_query_versions: { candidate_ids: [] } };
    },
    enabled: !!activeProject?.id && (!profileIds || profileIds.length === 0),
  });

  const candidateIds = profileIds?.length > 0 
    ? profileIds 
    : (searchQueryAndProfiles?.global_query_versions?.candidate_ids || []);

  return useQuery({
    queryKey: [CANDIDATES_QUERY_KEY, activeProject?.id, candidateIds],
    queryFn: async () => {
      if (!activeProject?.id) {
        throw new Error("No active project");
      }

      if (!candidateIds || candidateIds.length === 0) {
        return []; 
      }

      const { data, error } = await supabase
        .rpc('get_profile_json', {
          p_profile_ids: candidateIds
        });

      if (error) {
        throw error;
      }

      return data || []; 
    },
    enabled: !!activeProject?.id && candidateIds.length > 0,
    staleTime: Infinity, // Never mark data as stale automatically
    gcTime: Infinity, // Keep unused data in cache forever
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
};