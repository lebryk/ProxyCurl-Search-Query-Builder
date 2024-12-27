-- Drop existing foreign key constraints if any
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'survey_responses_candidate_id_fkey'
        AND table_name = 'survey_responses'
    ) THEN
        ALTER TABLE public.survey_responses DROP CONSTRAINT survey_responses_candidate_id_fkey;
    END IF;
END $$;

-- Change candidate_id column type to text
ALTER TABLE public.survey_responses 
ALTER COLUMN candidate_id TYPE text;
