-- Add foreign key relationships for survey tables

-- Add foreign key from survey_responses to sent_surveys
ALTER TABLE public.survey_responses
ADD CONSTRAINT survey_responses_survey_id_fkey
FOREIGN KEY (project_id, candidate_id)
REFERENCES public.sent_surveys(project_id, candidate_id);

-- Add indexes to improve join performance
CREATE INDEX idx_sent_surveys_project_candidate 
ON public.sent_surveys(project_id, candidate_id);

CREATE INDEX idx_survey_responses_project_candidate 
ON public.survey_responses(project_id, candidate_id);
