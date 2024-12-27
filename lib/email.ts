import { Resend } from 'resend';
import { SurveyEmailTemplate } from '@/components/emails/SurveyEmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SurveyEmailData {
  recipientEmail: string;
  recipientName: string;
  surveyUrl: string;
  surveyName: string;
}

export async function sendSurveyEmail({
  recipientEmail,
  recipientName,
  surveyUrl,
  surveyName,
}: SurveyEmailData) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Survey System <surveys@021.io>',
      to: [recipientEmail],
      subject: `A Recruiter is Interested in Learning More About You`,
      react: SurveyEmailTemplate({
        recipientName,
        surveyUrl,
        surveyName,
      }),
    });

    if (error) {
      console.error('Failed to send email:', error);
      throw error;
    }

    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
