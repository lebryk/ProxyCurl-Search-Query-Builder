import { Plus, Folder, FolderOpen, ChevronDown } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { ProjectList } from "./ProjectList";
import { useProjectOperations } from "@/hooks/useProjectOperations";
import type { Project } from "@/types/project";

interface ProjectManagementProps {
  projects: Project[];
  activeProject: Project | null;
  editingProject: Project | null;
  newProjectName: string;
  onProjectSelect: (project: Project) => void;
  onProjectAdd: () => void;
  onProjectEdit: (project: Project) => void;
  onProjectDelete: (project: Project) => void;
  onProjectSave: () => void;
  onProjectNameChange: (name: string) => void;
}

export function ProjectManagement({
  projects,
  activeProject,
  editingProject,
  newProjectName,
  onProjectSelect,
  onProjectAdd,
  onProjectEdit,
  onProjectDelete,
  onProjectSave,
  onProjectNameChange,
}: ProjectManagementProps) {
  const { state } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (state === "collapsed") {
      setIsOpen(false);
    }
  }, [state]);

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '';
  };

  return (
    <div className="bg-gray-100 border-border py-3 rounded-lg">
      <Accordion 
        type="single" 
        collapsible 
        className="w-full"
        value={state === "collapsed" ? "" : (isOpen ? "projects" : "")}
        onValueChange={(value) => {
          if (state !== "collapsed") {
            setIsOpen(!!value);
          }
        }}
      >
        <AccordionItem value="projects" className="border-none">
          <AccordionTrigger className="hover:no-underline hover:bg-accent rounded-none group px-4 py-2">
            <div className="flex items-center gap-2 flex-1">
              <FolderOpen className="h-4 w-4 group-data-[state=closed]:hidden" />
              <Folder className="h-4 w-4 hidden group-data-[state=closed]:block" />
              <span className="group-data-[state=collapsed]:hidden">My Projects</span>
            </div>
            <div className="flex items-center gap-2">
              {state !== "collapsed" && (
                <div 
                  role="button"
                  tabIndex={0}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md hover:bg-accent"
                  onClick={(e) => {
                    e.stopPropagation();
                    onProjectAdd();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onProjectAdd();
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </div>
              )}
              {state !== "collapsed" && (
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-data-[state=closed]:rotate-[-90deg]" />
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-1 px-4">
              <ProjectList
                projects={projects}
                activeProject={activeProject}
                editingProject={editingProject}
                newProjectName={newProjectName}
                onProjectSelect={onProjectSelect}
                onProjectEdit={onProjectEdit}
                onProjectDelete={onProjectDelete}
                onProjectSave={onProjectSave}
                onProjectNameChange={onProjectNameChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {activeProject && (
        <div 
          role="button"
          tabIndex={0}
          className="w-full flex items-center gap-2 text-sm font-normal h-8 px-4 hover:bg-accent"
        >
          <div className="flex items-center justify-center h-4 w-4 shrink-0 rounded bg-primary/10 text-primary text-[10px] font-medium">
            {getInitials(activeProject.name)}
          </div>
          <span className="truncate group-data-[state=collapsed]:hidden">{activeProject.name}</span>
        </div>
      )}
    </div>
  );
}