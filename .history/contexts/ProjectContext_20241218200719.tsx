import { createContext, useContext, ReactNode } from "react";
import { Project } from "@/types/project";
import { useProjectOperations } from "@/hooks/useProjectOperations";

interface ProjectContextType {
  projects: Project[] | null;
  isLoading: boolean;
  activeProject: Project | null;
  editingProject: Project | null;
  newProjectName: string;
  handleProjectAdd: (name: string) => void;
  handleProjectSelect: (project: Project) => void;
  handleProjectEdit: (project: Project) => void;
  handleProjectSave: () => void;
  handleProjectDelete: (project: Project) => Promise<void>;
  setNewProjectName: (name: string) => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const projectOperations = useProjectOperations();

  return (
    <ProjectContext.Provider value={projectOperations}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
}