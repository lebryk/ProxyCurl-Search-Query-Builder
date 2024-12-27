-- Enable public access for survey-related tables

-- Allow public read access to survey_templates
CREATE POLICY "Allow public read access to survey templates" 
ON public.survey_templates 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.sent_surveys
    WHERE sent_surveys.template_id = survey_templates.id
    AND sent_surveys.unique_token IS NOT NULL
  )
);

-- Allow public access to survey_responses
CREATE POLICY "Allow public access to survey responses" 
ON public.survey_responses 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Enable RLS on these tables if not already enabled
ALTER TABLE public.survey_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
