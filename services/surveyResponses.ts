import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface SurveyResponseData {
  question: string;
  answer: string;
}

export async function getSurveyResponse(surveyId: string, projectId: string) {
  // Validate input parameters
  if (!surveyId || !projectId) {
    throw new Error('surveyId and projectId are required');
  }

  // First get the survey details to get template questions
  const { data: survey, error: surveyError } = await supabase
    .from('sent_surveys')
    .select(`
      id,
      candidate_id,
      survey_templates:template_id (
        questions
      )
    `)
    .eq('id', surveyId)
    .single();

  if (surveyError) throw surveyError;
  if (!survey) throw new Error('Survey not found');

  // Get the questions from the template
  const questions = (survey.survey_templates as any).questions;
  if (!questions || !Array.isArray(questions)) {
    throw new Error('Invalid survey template');
  }

  // Then get the response using survey_id
  const { data, error } = await supabase
    .from('survey_responses')
    .select('responses, created_at')
    .eq('survey_id', surveyId)
    .single();

  if (error) throw error;
  if (!data) return null;

  // Map the responses to question-answer pairs
  const responseMap = data.responses as Record<string, string>;
  const answers = questions.map(q => ({
    question: q.question,
    answer: responseMap[q.id] || 'No response'
  }));

  return {
    answers,
    submittedAt: new Date(data.created_at)
  };
}