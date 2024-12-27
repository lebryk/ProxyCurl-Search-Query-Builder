import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Create a Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  // Extract token from the URL path
  const pathname = request.nextUrl.pathname;       // e.g. "/api/surveys/public/12345/submit"
  const token = pathname.substring(pathname.lastIndexOf("/") + 1);

  try {
    const { responses } = await request.json();

    // Validate responses
    if (!responses || typeof responses !== 'object') {
      return NextResponse.json({ 
        error: "Invalid response format" 
      }, { status: 400 });
    }

    console.log('Submitting survey for token:', token);

    // Get survey details
    const { data: survey, error: surveyError } = await supabase
      .from("sent_surveys")
      .select(`
        id,
        project_id,
        candidate_id,
        template_id,
        survey_status,
        survey_templates (
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

    console.log('Survey data:', JSON.stringify(survey, null, 2));

    // Check if survey is already completed
    if (survey.survey_status === 'completed') {
      return NextResponse.json(
        { error: "Survey has already been completed" },
        { status: 400 }
      );
    }

    // Validate that responses match questions
    const questions = (survey.survey_templates as unknown as { questions: { id: string }[] }).questions;
    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json({ 
        error: "Invalid survey template" 
      }, { status: 500 });
    }

    const questionIds = new Set(questions.map(q => q.id));
    const responseIds = new Set(Object.keys(responses));

    // Check if all required questions are answered
    for (const questionId of questionIds) {
      if (!responseIds.has(questionId)) {
        return NextResponse.json({ 
          error: "All questions must be answered",
          details: `Missing response for question ${questionId}`
        }, { status: 400 });
      }
    }

    // Check if there are any extra responses
    for (const responseId of responseIds) {
      if (!questionIds.has(responseId)) {
        return NextResponse.json({ 
          error: "Invalid response",
          details: `Response provided for non-existent question ${responseId}`
        }, { status: 400 });
      }
    }

    // Check for existing responses for this specific survey
    const { data: existingResponse, error: responseError } = await supabase
      .from("survey_responses")
      .select("id")
      .eq("survey_id", survey.id)
      .maybeSingle();

    if (responseError) {
      console.error('Error checking existing response:', responseError);
      return NextResponse.json({ 
        error: "Error checking survey status",
        details: responseError.message 
      }, { status: 500 });
    }

    if (existingResponse) {
      return NextResponse.json(
        { error: "Survey has already been submitted" },
        { status: 400 }
      );
    }

    // Submit the response
    const { data: response, error: submitError } = await supabase
      .from("survey_responses")
      .insert({
        survey_id: survey.id,
        project_id: survey.project_id,
        candidate_id: survey.candidate_id,
        responses,
      })
      .select()
      .single();

    if (submitError) {
      console.error('Error submitting survey response:', submitError);
      return NextResponse.json(
        { 
          error: "Failed to submit survey response",
          details: submitError.message
        },
        { status: 500 }
      );
    }

    // Update survey status
    const { error: updateError } = await supabase
      .from("sent_surveys")
      .update({
        survey_status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", survey.id);

    if (updateError) {
      console.error('Error updating survey status:', updateError);
      // Continue anyway as the response was saved
    }

    return NextResponse.json({
      message: "Survey submitted successfully",
      response,
    });
  } catch (error) {
    console.error("Error in submit survey route:", error);
    return NextResponse.json({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
