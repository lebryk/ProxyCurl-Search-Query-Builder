"use client";
import { useState } from "react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { ProjectManagement } from "./sidebar/ProjectManagement";
import { AppSidebarHeader } from "./sidebar/SidebarHeader";
import { MenuItems } from "./sidebar/MenuItems";
import { FooterItems } from "./sidebar/FooterItems";
import { DeleteProjectDialog } from "./sidebar/DeleteProjectDialog";
import { ProjectDialog } from "./sidebar/ProjectDialog";
import { useProject } from "@/contexts/ProjectContext";
import type { Project } from "@/types/project";

export function AppSidebar() {
  const {
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
  } = useProject();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");

  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    await handleProjectDelete(projectToDelete);
    setIsDeleteDialogOpen(false);
    setProjectToDelete(null);
  };

  const handleEditClick = (project: Project) => {
    setDialogMode("edit");
    setNewProjectName(project.name);
    handleProjectEdit(project);
    setIsProjectDialogOpen(true);
  };

  const handleAddClick = () => {
    setDialogMode("add");
    setIsProjectDialogOpen(true);
  };

  const handleProjectDialogConfirm = (name: string) => {
    if (dialogMode === "add") {
      handleProjectAdd(name);
    } else {
      setNewProjectName(name);
      handleProjectSave();
    }
  };

  if (isLoading) {
    return (
      <Sidebar collapsible="offcanvas">
        <AppSidebarHeader />
        <SidebarContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <Sidebar collapsible="none">
      <AppSidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <ProjectManagement
              projects={projects || []}
              activeProject={activeProject}
              editingProject={editingProject}
              newProjectName={newProjectName}
              onProjectSelect={handleProjectSelect}
              onProjectAdd={handleAddClick}
              onProjectEdit={handleEditClick}
              onProjectDelete={handleDeleteClick}
              onProjectSave={handleProjectSave}
              onProjectNameChange={setNewProjectName}
            />
            
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
          <MenuItems />
          </SidebarGroupContent>
        </SidebarGroup>
        
      </SidebarContent>

      <FooterItems />

      <DeleteProjectDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        projectName={projectToDelete?.name || ""}
        onConfirm={handleConfirmDelete}
      />

      <ProjectDialog
        isOpen={isProjectDialogOpen}
        onOpenChange={setIsProjectDialogOpen}
        onConfirm={handleProjectDialogConfirm}
        mode={dialogMode}
        initialName={dialogMode === "edit" ? newProjectName : ""}
      />
    </Sidebar>
  );
}