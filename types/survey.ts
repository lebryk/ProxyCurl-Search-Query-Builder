import type { Json } from "@/integrations/supabase/types";

export interface SurveyQuestion {
  id: string;
  type: 'likert' | 'multiple_choice' | 'scenario' | 'open_ended';
  question: string;
  category: string;
  options?: string[];
}

export interface SurveyTemplate {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  questions: SurveyQuestion[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type CreateSurveyTemplateDTO = Omit<SurveyTemplate, 'id' | 'created_at' | 'updated_at'>;
export type UpdateSurveyTemplateDTO = Partial<Omit<SurveyTemplate, 'id' | 'created_at' | 'updated_at'>>;

export function questionsToJson(questions: SurveyQuestion[]): Json {
  return questions as unknown as Json;
}

export function jsonToQuestions(json: Json): SurveyQuestion[] {
  if (!Array.isArray(json)) return [];
  return json.map(q => {
    const question = q as Record<string, unknown>;
    return {
      id: String(question.id || ''),
      type: (question.type as SurveyQuestion['type']) || 'open_ended',
      question: String(question.question || ''),
      category: String(question.category || ''),
      options: Array.isArray(question.options) ? question.options.map(String) : undefined
    };
  });
}