-- Enable public access for survey-related operations
CREATE POLICY "Allow public access to sent surveys" 
ON public.sent_surveys 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Note: This policy allows public read/write access to the sent_surveys table
-- It's necessary for the public survey endpoints to work without authentication
-- If you need to restrict certain operations, you can modify the policy accordingly
