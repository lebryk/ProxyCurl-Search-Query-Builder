"use client";
import { useQuery } from "@tanstack/react-query";
import { useProject } from "@/contexts/ProjectContext";
import type { Candidate, Education, WorkHistory } from "@/types/candidate";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const CANDIDATES_QUERY_KEY = "candidates";

export const useCandidateSearch = () => {
  const { activeProject } = useProject();

  return useQuery({
    queryKey: [CANDIDATES_QUERY_KEY, activeProject?.id],
    queryFn: async () => {
      console.log("Fetching candidates for project:", activeProject?.id);
      
      if (!activeProject?.id) {
        console.log("No active project found");
        throw new Error("No active project");
      }

      const { data: searchQuery } = await supabase
        .from("search_queries")
        .select("*")
        .eq("project_id", activeProject.id)
        .single();

      console.log("Search query:", searchQuery);

      const query = supabase
        .from("candidates")
        .select(`
          *,
          shortlisted_candidates(id)
        `)
        .eq("project_id", activeProject.id);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching candidates:", error);
        throw error;
      }

      console.log("Raw candidates data:", data);

      const transformedData = data?.map(candidate => ({
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
        education: (candidate.education || []).map((edu: any): Education => ({
          institution: edu?.institution || '',
          degree: edu?.degree || '',
          field: edu?.field || '',
          year: edu?.year || ''
        })),
        workHistory: (candidate.work_history || []).map((work: any): WorkHistory => ({
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
        isShortlisted: candidate.shortlisted_candidates?.length > 0,
        contactInfo: candidate.email ? {
          email: candidate.email
        } : undefined
      })) as Candidate[];

      console.log("Transformed candidates data:", transformedData);
      return transformedData;
    },
    enabled: !!activeProject?.id,
    staleTime: Infinity, // Never mark data as stale automatically
    gcTime: Infinity, // Keep unused data in cache forever
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch when window gains focus
    refetchOnReconnect: false, // Don't refetch when reconnecting
  });
};