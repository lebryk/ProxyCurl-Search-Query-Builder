import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

async function generateSurveyLink(surveyId: string) {
  console.log('Generating survey link for:', surveyId);
  try {
    const response = await fetch('/api/surveys/generate-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ surveyId }),
    });

    console.log('Generate link response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to generate survey link:', errorText);
      throw new Error('Failed to generate survey link');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating survey link:', error);
    throw error;
  }
}

export async function saveSentSurvey(projectId: string, templateId: string, candidateId: string) {
  console.log('Saving sent survey:', { projectId, templateId, candidateId });
  
  // First save the survey
  const { data, error } = await supabase
    .from('sent_surveys')
    .insert({
      project_id: projectId,
      template_id: templateId,
      candidate_id: candidateId,
      survey_status: 'not_started',
      email_sent_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving survey:', error);
    throw error;
  }

  console.log('Survey saved successfully:', data);

  // Then generate link and send email
  try {
    const linkResult = await generateSurveyLink(data.id);
    console.log('Link generated successfully:', linkResult);
  } catch (error) {
    console.error('Error generating survey link:', error);
    // Update survey status to reflect the error
    await supabase
      .from('sent_surveys')
      .update({
        email_status: 'failed',
        survey_status: 'error'
      })
      .eq('id', data.id);
    throw error;
  }

  return data;
}

export async function getSentSurveys(projectId: string) {
  const { data: surveys, error } = await supabase
    .from('sent_surveys')
    .select(`
      id,
      candidate_id,
      survey_templates:template_id(name),
      email_sent_at,
      survey_status,
      completed_at,
      email_status,
      unique_token
    `)
    .eq('project_id', projectId)
    .order('email_sent_at', { ascending: false });

  if (error) throw error;

  return surveys;
}

export async function markSurveyAsCompleted(surveyId: string) {
  const { data, error } = await supabase
    .from('sent_surveys')
    .update({
      survey_status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('id', surveyId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSentSurvey(surveyId: string) {
  const { error } = await supabase
    .from('sent_surveys')
    .delete()
    .eq('id', surveyId);

  if (error) throw error;
}