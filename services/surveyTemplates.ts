import type { SurveyTemplate, CreateSurveyTemplateDTO } from "@/types/survey";
import { questionsToJson, jsonToQuestions } from "@/types/survey";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export async function getTemplates(): Promise<SurveyTemplate[]> {
  const { data, error } = await supabase
    .from('survey_templates')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  
  return data.map(template => ({
    ...template,
    questions: jsonToQuestions(template.questions)
  })) as SurveyTemplate[];
}

export async function saveTemplate(template: CreateSurveyTemplateDTO) {
  const { data, error } = await supabase
    .from('survey_templates')
    .insert([{ 
      ...template,
      questions: questionsToJson(template.questions)
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateTemplate(template: SurveyTemplate, projectId: string) {
  const { data, error } = await supabase
    .from('survey_templates')
    .update({
      name: template.name,
      description: template.description,
      questions: questionsToJson(template.questions),
      tags: template.tags,
      updated_at: new Date().toISOString()
    })
    .eq('id', template.id)
    .eq('project_id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteTemplate(templateId: string, projectId: string) {
  const { error } = await supabase
    .from('survey_templates')
    .delete()
    .eq('id', templateId)
    .eq('project_id', projectId);

  if (error) throw error;
}

export async function duplicateTemplate(templateId: string, projectId: string) {
  const { data: template, error: fetchError } = await supabase
    .from('survey_templates')
    .select('*')
    .eq('id', templateId)
    .single();

  if (fetchError) throw fetchError;

  const { data, error } = await supabase
    .from('survey_templates')
    .insert([{
      project_id: projectId,
      name: `${template.name} (Copy)`,
      description: template.description,
      questions: template.questions,
      tags: template.tags
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}