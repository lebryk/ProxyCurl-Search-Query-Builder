import { Pencil, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { Project } from "@/types/project";

interface ProjectListProps {
  projects: Project[];
  activeProject: Project | null;
  editingProject: Project | null;
  newProjectName: string;
  onProjectSelect: (project: Project) => void;
  onProjectEdit: (project: Project) => void;
  onProjectDelete: (project: Project) => void;
  onProjectSave: () => void;
  onProjectNameChange: (name: string) => void;
}

export function ProjectList({
  projects,
  activeProject,
  editingProject,
  newProjectName,
  onProjectSelect,
  onProjectEdit,
  onProjectDelete,
  onProjectSave,
  onProjectNameChange,
}: ProjectListProps) {
  return (
    <div className="space-y-1">
      {projects?.map((project) => (
        <div key={project.id} className="flex items-center gap-1 group">
          {editingProject?.id === project.id ? (
            <div className="flex-1 flex gap-1">
              <Input
                value={newProjectName}
                onChange={(e) => onProjectNameChange(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') onProjectSave();
                  if (e.key === 'Escape') {
                    onProjectNameChange("");
                    onProjectEdit(null as any);
                  }
                }}
              />
              <div 
                role="button"
                tabIndex={0}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent"
                onClick={onProjectSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onProjectSave();
                  }
                }}
              >
                Save
              </div>
            </div>
          ) : (
            <>
              <div 
                role="button"
                tabIndex={0}
                className={`flex-1 justify-start text-sm p-2 rounded-md ${
                  activeProject?.id === project.id 
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400" 
                    : "hover:bg-accent"
                }`}
                onClick={() => onProjectSelect(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onProjectSelect(project);
                  }
                }}
              >
                {project.name}
              </div>
              <div 
                role="button"
                tabIndex={0}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onProjectEdit(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onProjectEdit(project);
                  }
                }}
              >
                <Pencil className="h-4 w-4" />
              </div>
              <div 
                role="button"
                tabIndex={0}
                className="h-8 w-8 inline-flex items-center justify-center rounded-md text-destructive hover:bg-accent opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onProjectDelete(project)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onProjectDelete(project);
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}