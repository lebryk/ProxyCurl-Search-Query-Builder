-- Add survey_id column to survey_responses table
ALTER TABLE public.survey_responses ADD COLUMN IF NOT EXISTS survey_id uuid REFERENCES public.sent_surveys(id) ON DELETE CASCADE;

-- Create index on survey_id for faster lookups
CREATE INDEX IF NOT EXISTS survey_responses_survey_id_idx ON public.survey_responses(survey_id);

-- Update RLS policies to include survey_id
DROP POLICY IF EXISTS "Users can view survey responses for their projects" ON public.survey_responses;
CREATE POLICY "Users can view survey responses for their projects" ON public.survey_responses 
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.projects 
    WHERE projects.id = survey_responses.project_id 
    AND projects.user_id = auth.uid()
  )
);

-- Grant necessary permissions
GRANT ALL ON TABLE public.survey_responses TO authenticated;
GRANT ALL ON TABLE public.survey_responses TO service_role;
