'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface Question {
  id: string;
  type: string;
  category: string;
  question: string;
}

interface SurveyData {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface SurveyResponse {
  [key: string]: string;
}

export default function PublicSurveyPage() {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [survey, setSurvey] = useState<SurveyData | null>(null);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchSurvey();
  }, [token]);

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/public/${token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load survey');
      }

      if (data.status === 'completed') {
        setCompletionMessage(data.message);
      } else {
        setSurvey(data.survey);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = async () => {
    if (!survey) return;

    // Validate all questions are answered
    const unansweredQuestions = survey.questions.filter(q => !responses[q.id]?.trim());
    if (unansweredQuestions.length > 0) {
      setError('Please answer all questions before submitting');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/surveys/public/${token}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit survey');
      }

      setSubmitted(true);
      setCompletionMessage('Thank you for completing the survey!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container max-w-3xl mx-auto p-4 space-y-4">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-8 w-1/2" />
        <div className="space-y-6">
          {[1, 2, 3].map(i => (
            <Card key={i} className="w-full">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-3xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (completionMessage) {
    return (
      <div className="container max-w-3xl mx-auto p-4">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Survey Completed</AlertTitle>
          <AlertDescription>{completionMessage}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="container max-w-3xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Survey Not Found</AlertTitle>
          <AlertDescription>This survey does not exist or has been removed.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container max-w-3xl mx-auto p-4 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{survey.name}</h1>
        {survey.description && (
          <p className="text-muted-foreground">{survey.description}</p>
        )}
      </div>

      <div className="space-y-4">
        {survey.questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle className="text-lg">{question.question}</CardTitle>
              <CardDescription>{question.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Type your answer here..."
                value={responses[question.id] || ''}
                onChange={(e) => handleResponseChange(question.id, e.target.value)}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <CardFooter className="flex justify-end space-x-2 px-0">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full sm:w-auto"
        >
          {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitting ? 'Submitting...' : 'Submit Survey'}
        </Button>
      </CardFooter>
    </div>
  );
}
