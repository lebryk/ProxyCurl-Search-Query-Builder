-- Remove the status column from sent_surveys table since we're using survey_status
ALTER TABLE public.sent_surveys DROP COLUMN IF EXISTS status;

-- Update RLS policies to use survey_status instead of status
DROP POLICY IF EXISTS "Users can view sent surveys for their projects" ON public.sent_surveys;
CREATE POLICY "Users can view sent surveys for their projects" ON public.sent_surveys 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = sent_surveys.project_id 
      AND projects.user_id = auth.uid()
    )
  );
