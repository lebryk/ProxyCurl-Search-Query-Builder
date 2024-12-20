import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";
import type { Tag } from "@/types/common";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export type SearchQueryData = {
  jobTitles: Tag[];
  industries: Tag[];
  locations: Tag[];
  experienceRange: [number, number];
  skills: Tag[];
  languages: Tag[];
  nationalities: Tag[];
  companies: Tag[];
  excludedCompanies: Tag[];
  currentEmployer: Tag[];
  previousEmployer: Tag[];
  educationDegrees: Tag[];
  educationMajors: Tag[];
  gender: string;
};

const convertTagsToLabels = (tags: Tag[]) => tags.map(tag => tag.label);

export const useSearchQuery = (projectId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: searchQuery, isLoading } = useQuery({
    queryKey: ["searchQuery", projectId],
    queryFn: async () => {
      if (!projectId) return null;

      const { data, error } = await supabase
        .from("search_queries")
        .select("*")
        .eq("project_id", projectId)
        .single();

      if (error) {
        console.log("Error fetching search query:", error);
        return null;
      }

      // Convert DB format to app format
      return {
        jobTitles: data?.job_titles?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        industries: data?.industries?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        locations: data?.locations?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        experienceRange: [data?.min_experience || 0, data?.max_experience || 20],
        skills: data?.skills?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        languages: data?.languages?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        nationalities: data?.nationalities?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        companies: data?.companies?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        excludedCompanies: data?.excluded_companies?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        currentEmployer: data?.current_employer?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        previousEmployer: data?.previous_employer?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        educationDegrees: data?.education_degrees?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        educationMajors: data?.education_majors?.map((label: string) => ({ label, id: crypto.randomUUID() })) || [],
        gender: data?.gender || "both",
      } as SearchQueryData;
    },
    gcTime: 0, // Don't cache the data (replaces cacheTime)
    staleTime: 0, // Always consider data stale
    refetchOnMount: "always", // Refetch when component mounts (now takes string literal)
    enabled: !!projectId, // Only run query if we have a projectId
  }); 

  const saveSearchQuery = useMutation({
    mutationFn: async (data: SearchQueryData) => {
      if (!projectId) throw new Error("No project ID provided");

      const { error } = await supabase
        .from("search_queries")
        .upsert({
          project_id: projectId,
          job_titles: convertTagsToLabels(data.jobTitles),
          industries: convertTagsToLabels(data.industries),
          locations: convertTagsToLabels(data.locations),
          min_experience: data.experienceRange[0],
          max_experience: data.experienceRange[1],
          skills: convertTagsToLabels(data.skills),
          languages: convertTagsToLabels(data.languages),
          nationalities: convertTagsToLabels(data.nationalities),
          companies: convertTagsToLabels(data.companies),
          excluded_companies: convertTagsToLabels(data.excludedCompanies),
          current_employer: convertTagsToLabels(data.currentEmployer),
          previous_employer: convertTagsToLabels(data.previousEmployer),
          education_degrees: convertTagsToLabels(data.educationDegrees),
          education_majors: convertTagsToLabels(data.educationMajors),
          gender: data.gender
        }, {
          onConflict: 'project_id'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["searchQuery", projectId], data);
      toast({ title: "Changes saved" });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error saving changes",
        description: error.message
      });
    }
  });

  return {
    searchQuery,
    isLoading,
    saveSearchQuery,
  };
};