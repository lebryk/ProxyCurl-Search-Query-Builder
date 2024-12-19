"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Project } from "@/types/project";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_progress (*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match our Project type
      const projects = data?.map(project => ({
        ...project,
        project_progress: project.project_progress?.[0] || null
      })) || [];

      return projects as Project[];
    },
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProject: Pick<Project, "name" | "position">) => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error("User must be logged in to create a project");
      }

      // First create the project
      const { data: project, error: projectError } = await supabase
        .from("projects")
        .insert({
          name: newProject.name,
          position: newProject.position,
          user_id: session.user.id,
        })
        .select()
        .single();

      if (projectError) throw projectError;

      // Then create the progress tracking
      const { error: progressError } = await supabase
        .from("project_progress")
        .insert({
          project_id: project.id,
          query_builder: 0,
          candidate_search: 0,
          shortlist: 0,
          culture_fit: 0,
          comparison: 0,
          outreach: 0,
        });

      if (progressError) throw progressError;

      return project;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};