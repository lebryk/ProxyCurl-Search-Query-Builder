

import { createClient } from "@/utils/supabase/client";

const supabase = createClient();


export async function saveSentSurvey(projectId: string, templateId: string, candidateId: string) {
  const { data, error } = await supabase
    .from('sent_surveys')
    .insert({
      project_id: projectId,
      template_id: templateId,
      candidate_id: candidateId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getSentSurveys(projectId: string) {
  const { data: surveys, error } = await supabase
    .from('sent_surveys')
    .select(`
      *,
      template:survey_templates(name),
      candidate:candidates(first_name, last_name)
    `)
    .eq('project_id', projectId)
    .order('sent_at', { ascending: false });

  if (error) throw error;

  return surveys.map(survey => ({
    id: survey.id,
    templateName: survey.template?.name || 'Unknown Template',
    candidateName: `${survey.candidate?.first_name || ''} ${survey.candidate?.last_name || ''}`.trim() || 'Unknown Candidate',
    candidateId: survey.candidate_id,
    sentDate: new Date(survey.sent_at),
    status: survey.status,
    completedDate: survey.completed_at ? new Date(survey.completed_at) : undefined
  }));
}

export async function markSurveyAsCompleted(surveyId: string) {
  const { data, error } = await supabase
    .from('sent_surveys')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', surveyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}