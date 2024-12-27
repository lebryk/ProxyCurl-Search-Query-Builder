-- Enable RLS on profile_contacts table
ALTER TABLE public.profile_contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert/update profile_contacts
CREATE POLICY "Allow authenticated users to manage profile contacts"
ON public.profile_contacts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON TABLE public.profile_contacts TO authenticated;
GRANT ALL ON TABLE public.profile_contacts TO service_role;
