import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendSurveyEmail } from "@/lib/email";

// Create a Supabase client with admin privileges
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Create a Supabase client for public access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Survey {
  id: string;
  candidate_id: string;
  survey_templates: {
    name: string;
  };
  profile: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    profile_contacts: {
      email: string | null;
    };
  };
}

interface ProxycurlResponse {
  emails: string[];
}

async function getEmailFromProxycurl(profileId: string): Promise<string | null> {
  try {
    console.log('Fetching email from Proxycurl for profile:', profileId);
    
    const url = new URL('https://nubela.co/proxycurl/api/contact-api/personal-email');
    url.searchParams.append('linkedin_profile_url', `https://linkedin.com/in/${profileId}`);
    url.searchParams.append('email_validation', 'fast');
    url.searchParams.append('page_size', '0');

    console.log('Proxycurl request URL:', url.toString());
    console.log('Proxycurl API Key:', process.env.PROXYCURL_API_KEY ? 'Present' : 'Missing');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${process.env.PROXYCURL_API_KEY}`,
      },
    });

    console.log('Proxycurl response status:', response.status);
    
    if (!response.ok) {
      console.error('Proxycurl API error:', response.statusText);
      const errorBody = await response.text();
      console.error('Proxycurl error body:', errorBody);
      return null;
    }

    const data = await response.json() as ProxycurlResponse;
    console.log('Proxycurl response:', data);
    
    // Return the first valid email if available
    if (data.emails && data.emails.length > 0) {
      console.log('Found email:', data.emails[0]);
      return data.emails[0];
    }

    console.log('No valid emails found in Proxycurl response');
    return null;
  } catch (error) {
    console.error('Error fetching email from Proxycurl:', error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { surveyId } = await request.json();
    console.log('Generating link for survey:', surveyId);

    // Get survey and candidate details
    const { data: survey, error: surveyError } = await supabaseAdmin
      .from("sent_surveys")
      .select(`
        id,
        candidate_id,
        survey_templates (
          name
        ),
        profile:candidate_id (
          id,
          first_name,
          last_name,
          profile_contacts (
            email
          )
        )
      `)
      .eq("id", surveyId)
      .single() as { data: Survey | null, error: any };

    if (surveyError) {
      console.error('Error fetching survey:', surveyError);
      console.error('Survey ID:', surveyId);
      console.error('Full error:', JSON.stringify(surveyError, null, 2));
      return NextResponse.json(
        { error: "Failed to fetch survey details", details: surveyError },
        { status: 500 }
      );
    }

    if (!survey) {
      console.error('No survey found for ID:', surveyId);
      return NextResponse.json(
        { error: "Survey not found" },
        { status: 404 }
      );
    }

    console.log('Survey data:', JSON.stringify(survey, null, 2));

    // Generate a unique token
    const token = crypto.randomUUID();
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const surveyUrl = `${baseUrl}/s/${token}`;

    // Update the sent_surveys table with the token
    const { data, error } = await supabase
      .from("sent_surveys")
      .update({
        unique_token: token,
        email_sent_at: new Date().toISOString(),
        email_status: "no_email_found",
        survey_status: "not_started",
        last_accessed_at: null,
        completed_at: null,
      })
      .eq("id", surveyId)
      .select()
      .single();

    if (error) {
      console.error('Error updating survey:', error);
      return NextResponse.json(
        { error: "Failed to generate survey link" },
        { status: 500 }
      );
    }

    // Try to get email from profile_contacts or Proxycurl
    let recipientEmail = survey.profile?.profile_contacts?.email;
    console.log('Initial recipient email from profile_contacts:', recipientEmail);
    console.log('Profile data:', survey.profile);

    if (!recipientEmail && survey.candidate_id) {
      console.log('No email found in profile_contacts, trying Proxycurl...');
      const proxycurlEmail = await getEmailFromProxycurl(survey.candidate_id);
      
      if (proxycurlEmail) {
        // Store the email in profile_contacts
        const { error: insertError } = await supabaseAdmin
          .from("profile_contacts")
          .upsert({
            id: survey.candidate_id,
            email: proxycurlEmail,
          });

        if (insertError) {
          console.error('Error storing email in profile_contacts:', insertError);
        } else {
          console.log('Stored email in profile_contacts');
          recipientEmail = proxycurlEmail;
        }
      }
    }

    if (!recipientEmail) {
      console.log('No email found for candidate:', survey.candidate_id);
      return NextResponse.json({
        message: "Survey link generated but no email found",
        surveyUrl,
        status: "no_email",
        candidateName: survey.profile ? `${survey.profile.first_name || ''} ${survey.profile.last_name || ''}`.trim() : survey.candidate_id,
        candidateId: survey.candidate_id
      });
    }

    // Send email with survey link
    try {
      await sendSurveyEmail({
        recipientEmail,
        recipientName: survey.profile ? `${survey.profile.first_name || ''} ${survey.profile.last_name || ''}`.trim() : survey.candidate_id,
        surveyUrl,
        surveyName: survey.survey_templates.name,
      });

      // Update email status to sent
      await supabase
        .from("sent_surveys")
        .update({ email_status: "sent" })
        .eq("id", surveyId);

      return NextResponse.json({
        message: "Survey link generated and email sent successfully",
        surveyUrl,
        status: "sent"
      });
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      console.error('Survey ID:', surveyId);
      console.error('Full error:', JSON.stringify(emailError, null, 2));
      // Update email status to failed
      await supabase
        .from("sent_surveys")
        .update({ email_status: "failed" })
        .eq("id", surveyId);

      return NextResponse.json({
        error: "Failed to send email",
        surveyUrl,
        status: "failed"
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in generate-link:', error);
    console.error('Full error:', JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
