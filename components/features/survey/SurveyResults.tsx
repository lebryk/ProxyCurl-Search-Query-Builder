import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SurveyResultsProps {
  results: {
    answers: Array<{
      question: string;
      answer: string;
    }>;
    submittedAt: Date;
  };
}

export function SurveyResults({ results }: SurveyResultsProps) {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Submitted on: {results.submittedAt.toLocaleString()}
      </div>
      
      {results.answers.map((answer, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-lg">{answer.question}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base text-foreground whitespace-pre-wrap">
              {answer.answer}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
