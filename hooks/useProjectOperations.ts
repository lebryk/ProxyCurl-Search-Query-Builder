import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import type { Project } from "@/types/project";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

const ACTIVE_PROJECT_KEY = 'activeProjectId';

export const useProjectOperations = () => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  // Set active project when projects are loaded
  useEffect(() => {
    if (!projects || activeProject) return;

    const storedProjectId = localStorage.getItem(ACTIVE_PROJECT_KEY);
    if (storedProjectId) {
      const storedProject = projects.find(p => p.id === storedProjectId);
      if (storedProject) {
        setActiveProject(storedProject);
        return;
      }
    }

    // Only set first project if no stored project was found
    if (projects.length > 0) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject]);

  const createProject = useMutation({
    mutationFn: async (name: string) => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user?.id) {
        throw new Error("User must be logged in to create a project");
      }

      const { data, error } = await supabase
        .from("projects")
        .insert({
          name: name,
          position: "New Position",
          user_id: session.user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setActiveProject(newProject);
      localStorage.setItem(ACTIVE_PROJECT_KEY, newProject.id);
      toast({
        title: "Project added",
        description: `${newProject.name} has been created`
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error creating project",
        description: error.message
      });
    }
  });

  const handleProjectAdd = (name: string) => {
    createProject.mutate(name);
  };

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    localStorage.setItem(ACTIVE_PROJECT_KEY, project.id);
    toast({
      title: "Project selected",
      description: `Switched to ${project.name}`
    });
  };

  const handleProjectEdit = (project: Project) => {
    setEditingProject(project);
    setNewProjectName(project.name);
  };

  const handleProjectSave = async () => {
    if (!editingProject || !newProjectName.trim()) return;

    try {
      const { error } = await supabase
        .from('projects')
        .update({ name: newProjectName.trim() })
        .eq('id', editingProject.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["projects"] });

      if (activeProject?.id === editingProject.id) {
        setActiveProject({ ...activeProject, name: newProjectName.trim() });
      }

      setEditingProject(null);
      setNewProjectName("");

      toast({
        title: "Project updated",
        description: `Project has been renamed to ${newProjectName.trim()}`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error updating project",
        description: error.message
      });
    }
  };

  const handleProjectDelete = async (project: Project) => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ["projects"] });

      if (activeProject?.id === project.id && projects && projects.length > 0) {
        // Set the first available project as active after deletion
        const remainingProjects = projects.filter(p => p.id !== project.id);
        if (remainingProjects.length > 0) {
          setActiveProject(remainingProjects[0]);
          localStorage.setItem(ACTIVE_PROJECT_KEY, remainingProjects[0].id);
        } else {
          setActiveProject(null);
          localStorage.removeItem(ACTIVE_PROJECT_KEY);
        }
      }

      toast({
        title: "Project deleted",
        description: `${project.name} has been deleted`
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error deleting project",
        description: error.message
      });
    }
  };

  return {
    projects,
    isLoading,
    activeProject,
    editingProject,
    newProjectName,
    handleProjectAdd,
    handleProjectSelect,
    handleProjectEdit,
    handleProjectSave,
    handleProjectDelete,
    setNewProjectName,
  };
};