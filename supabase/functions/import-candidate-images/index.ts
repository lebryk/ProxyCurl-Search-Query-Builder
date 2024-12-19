import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get candidates with external image URLs
    const { data: candidates, error: fetchError } = await supabase
      .from('candidates')
      .select('id, image_url')
      .neq('image_url', null)
      .not('image_url', 'like', '%/storage/v1/object/public/candidate-avatars/%')

    if (fetchError) {
      console.error('Error fetching candidates:', fetchError)
      throw fetchError
    }

    const results = []

    for (const candidate of candidates || []) {
      try {
        if (!candidate.image_url) continue

        // Download the image
        const response = await fetch(candidate.image_url)
        if (!response.ok) continue

        const blob = await response.blob()
        const fileExt = candidate.image_url.split('.').pop()?.split('?')[0] || 'jpg'
        const filePath = `${candidate.id}.${fileExt}`

        // Upload to storage
        const { error: uploadError } = await supabase.storage
          .from('candidate-avatars')
          .upload(filePath, blob, {
            contentType: response.headers.get('content-type') || 'image/jpeg',
            upsert: true
          })

        if (uploadError) {
          console.error('Error uploading image:', uploadError)
          continue
        }

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('candidate-avatars')
          .getPublicUrl(filePath)

        // Update candidate record
        const { error: updateError } = await supabase
          .from('candidates')
          .update({ image_url: publicUrlData.publicUrl })
          .eq('id', candidate.id)

        if (updateError) {
          console.error('Error updating candidate:', updateError)
          continue
        }

        results.push({
          candidateId: candidate.id,
          oldUrl: candidate.image_url,
          newUrl: publicUrlData.publicUrl
        })

      } catch (error) {
        console.error(`Error processing candidate ${candidate.id}:`, error)
      }
    }

    return new Response(
      JSON.stringify({ message: 'Import completed', results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in import-candidate-images:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})