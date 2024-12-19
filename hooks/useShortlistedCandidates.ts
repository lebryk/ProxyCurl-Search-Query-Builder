import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import type { Candidate } from "@/types/candidate";
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
        const { data: candidatesData, error: candidatesError } = await supabase
          .from('candidates')
          .select('*')
          .in('id', candidateIds);

        if (candidatesError) {
          console.error('Error fetching candidates:', candidatesError);
          return [];
        }

        return candidatesData.map(candidate => ({
          id: candidate.id,
          first_name: candidate.first_name,
          last_name: candidate.last_name,
          name: `${candidate.first_name} ${candidate.last_name}`,
          title: candidate.current_position || 'Not specified',
          company: candidate.current_company || 'Not specified',
          location: candidate.location || 'Not specified',
          experience: `${candidate.experience_years || 0} years`,
          experience_years: candidate.experience_years || 0,
          skills: candidate.skills || [],
          education: (candidate.education || []).map((edu: any) => ({
            institution: edu?.institution || '',
            degree: edu?.degree || '',
            field: edu?.field || '',
            year: edu?.year || ''
          })),
          workHistory: (candidate.work_history || []).map((work: any) => ({
            company: work?.company || '',
            position: work?.position || '',
            duration: work?.duration || '',
            description: work?.description || ''
          })),
          languages: candidate.languages || [],
          certifications: candidate.certifications || [],
          summary: candidate.summary,
          score: Math.floor(Math.random() * 40) + 60,
          imageUrl: candidate.image_url || '/placeholder.svg',
          contactInfo: candidate.email ? {
            email: candidate.email
          } : undefined
        })) as Candidate[];
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
