import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useProject } from "@/contexts/ProjectContext";
import {
  getTemplates,
  saveTemplate,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate
} from "@/services/surveyTemplates";
import type { SurveyTemplate, CreateSurveyTemplateDTO } from "@/types/survey";

export function useSurveyTemplates() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { activeProject } = useProject();

  const {
    data: templates = [],
    isLoading,
    error
  } = useQuery({
    queryKey: ['surveyTemplates', activeProject?.id],
    queryFn: getTemplates,
    enabled: !!activeProject?.id
  });

  const createTemplateMutation = useMutation({
    mutationFn: (template: CreateSurveyTemplateDTO) => 
      saveTemplate({ ...template, project_id: activeProject?.id! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyTemplates'] });
      toast({
        title: "Template Created",
        description: "New survey template has been created successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateTemplateMutation = useMutation({
    mutationFn: (template: SurveyTemplate) => 
      updateTemplate(template, activeProject?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyTemplates'] });
      toast({
        title: "Template Updated",
        description: "Survey template has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: (templateId: string) => 
      deleteTemplate(templateId, activeProject?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyTemplates'] });
      toast({
        title: "Template Deleted",
        description: "Survey template has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete template. Please try again.",
        variant: "destructive",
      });
    },
  });

  const duplicateTemplateMutation = useMutation({
    mutationFn: (templateId: string) => 
      duplicateTemplate(templateId, activeProject?.id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['surveyTemplates'] });
      toast({
        title: "Template Duplicated",
        description: "Survey template has been duplicated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to duplicate template. Please try again.",
        variant: "destructive",
      });
    },
  });

  return {
    templates,
    isLoading,
    error,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate,
    duplicateTemplate: duplicateTemplateMutation.mutate,
  };
}