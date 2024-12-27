import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface SurveyEmailTemplateProps {
  recipientName: string;
  surveyName: string;
  surveyUrl: string;
}

export const SurveyEmailTemplate = ({
  recipientName,
  surveyUrl,
}: SurveyEmailTemplateProps) => {
  const previewText = `A Recruiter is Interested in Learning More About You`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={text}>Hi {recipientName},</Text>
          
          <Text style={text}>
            We noticed your impressive profile and believe you could be a great fit for an exciting opportunity. 
            A recruiter using NominAIt is eager to learn more about you and has requested a quick questionnaire 
            to better understand your work preferences and style.
          </Text>

          <Text style={text}>
            It's short and takes just 5 minutes, but it will help match you to the perfect role.
          </Text>

          <Section style={buttonContainer}>
            <Button 
              style={{
                backgroundColor: '#2754C5',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '16px',
                fontWeight: 'bold',
                textDecoration: 'none',
                textAlign: 'center' as const,
                display: 'block',
                padding: '12px 20px',
              }} 
              href={surveyUrl}
            >
              Start Questionnaire
            </Button>
          </Section>

          <Text style={text}>
            Your input is key to finding the right fit for you. Feel free to reach out if you have any questions!
          </Text>

          <Text style={text}>Best regards,</Text>
          <Text style={text}>The NominAIt Team</Text>

          <Text style={footer}>
            If the button above doesn't work, copy and paste this URL into your browser:{' '}
            <Link href={surveyUrl} style={link}>
              {surveyUrl}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '580px',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const buttonContainer = {
  margin: '32px 0',
};

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
};

const footer = {
  color: '#898989',
  fontSize: '14px',
  margin: '48px 0 24px',
};

export default SurveyEmailTemplate;
