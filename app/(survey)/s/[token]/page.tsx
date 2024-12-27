'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Question {
  id: string;
  type: 'likert' | 'multiple_choice' | 'scenario' | 'open_ended';
  category: string;
  question: string;
  options?: string[];
}

interface Survey {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

interface SurveyResponse {
  [key: string]: string;
}

export default function SurveyPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchSurvey();
  }, [params.token]);

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/public/${params.token}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch survey');
      }

      if (data.status === 'completed') {
        setCompleted(true);
        return;
      }

      setSurvey(data.survey);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/surveys/public/${params.token}/submit`, {
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

      setCompleted(true);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to submit survey');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-red-600">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">Thank You!</h2>
          <p className="text-gray-600">Your survey has been submitted successfully.</p>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center text-gray-600">
          <h2 className="text-xl font-semibold mb-2">Survey Not Found</h2>
          <p>The requested survey could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b">
        <h1 className="text-2xl font-semibold mb-2">{survey.name}</h1>
        <p className="text-gray-600">{survey.description}</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-6">
          {survey.questions.map((question) => (
            <div key={question.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded">
                  {question.category}
                </span>
              </div>
              <label className="block mb-2 font-medium">
                {question.question}
              </label>
              {question.type === 'multiple_choice' && question.options ? (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={responses[question.id] === option}
                        onChange={(e) => handleResponseChange(question.id, e.target.value)}
                        required
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="text-sm">{option}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <textarea
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  rows={4}
                  value={responses[question.id] || ''}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  required
                  placeholder="Type your answer here..."
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting...' : 'Submit Survey'}
          </button>
        </div>
      </form>
    </div>
  );
}
