import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

interface SurveyResponseData {
  question: string;
  answer: string;
}

export async function getSurveyResponse(candidateId: string, projectId: string) {
  // Validate input parameters
  if (!candidateId || !projectId) {
    throw new Error('candidateId and projectId are required');
  }

  const { data, error } = await supabase
    .from('survey_responses')
    .select('responses, created_at')
    .eq('candidate_id', candidateId)
    .eq('project_id', projectId)
    .single();

  if (error) throw error;
  
  if (!data) return null;

  // First cast to unknown, then to the specific type to ensure type safety
  const responses = (data.responses as unknown) as SurveyResponseData[];
  
  return {
    answers: responses.map((response) => ({
      question: response.question,
      answer: response.answer
    })),
    submittedAt: new Date(data.created_at)
  };
}