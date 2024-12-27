import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Create a Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(
  request: Request,
  context: { params: { token: string } }
) {
  try {
    const { token } = context.params;
    console.log('Fetching survey for token:', token);

    // Get survey details
    const { data: survey, error: surveyError } = await supabase
      .from("sent_surveys")
      .select(`
        *,
        survey_templates (
          name,
          description,
          questions
        )
      `)
      .eq("unique_token", token)
      .single();

    if (surveyError) {
      console.error('Error fetching survey:', surveyError);
      return NextResponse.json({ 
        error: "Survey not found",
        details: surveyError.message 
      }, { status: 404 });
    }

    if (!survey) {
      console.error('No survey found for token:', token);
      return NextResponse.json({ error: "Survey not found" }, { status: 404 });
    }

    console.log('Survey found:', {
      id: survey.id,
      candidate_id: survey.candidate_id,
      project_id: survey.project_id,
      template_id: survey.template_id,
      survey_status: survey.survey_status,
      completed_at: survey.completed_at
    });

    // Check if survey is completed
    if (survey.survey_status === 'completed' || survey.completed_at) {
      return NextResponse.json({
        status: "completed",
        message: "This survey has already been completed. Thank you for your participation.",
      });
    }

    // Check for existing responses for this specific survey
    const { data: response, error: responseError } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("survey_id", survey.id) // Check for responses to this specific survey
      .maybeSingle();

    if (responseError) {
      console.error('Error checking survey response:', responseError);
    }

    // If there are responses but survey is not marked as completed, mark it as completed
    if (response) {
      // Update survey status
      const { error: updateError } = await supabase
        .from("sent_surveys")
        .update({
          survey_status: "completed",
          completed_at: new Date().toISOString()
        })
        .eq("id", survey.id);

      if (updateError) {
        console.error('Error updating survey status:', updateError);
      }

      return NextResponse.json({
        status: "completed",
        message: "This survey has already been completed. Thank you for your participation.",
      });
    }

    // Update last accessed timestamp
    const { error: updateError } = await supabase
      .from("sent_surveys")
      .update({ last_accessed_at: new Date().toISOString() })
      .eq("id", survey.id);

    if (updateError) {
      console.error('Error updating last_accessed_at:', updateError);
      // Continue anyway as this is not critical
    }

    // Return survey data
    return NextResponse.json({
      status: "active",
      survey: {
        id: survey.id,
        name: survey.survey_templates?.name,
        description: survey.survey_templates?.description,
        questions: survey.survey_templates?.questions,
      },
    });
  } catch (error) {
    console.error("Error in public survey route:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
