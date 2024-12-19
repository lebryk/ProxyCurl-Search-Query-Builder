import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export const importCandidateImages = async () => {
  const { data, error } = await supabase.functions.invoke('import-candidate-images');
  
  if (error) {
    console.error('Error importing candidate images:', error);
    throw error;
  }

  return data;
};