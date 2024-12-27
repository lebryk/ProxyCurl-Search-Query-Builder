import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { SurveyQuestion } from "./SurveyQuestionCard";

interface Props {
  questions: SurveyQuestion[];
  onSubmit?: (answers: Record<string, any>) => void;
}

const likertOptions = [
  { value: "1", label: "Strongly Disagree" },
  { value: "2", label: "Disagree" },
  { value: "3", label: "Neutral" },
  { value: "4", label: "Agree" },
  { value: "5", label: "Strongly Agree" },
];

export function SurveyPreview({ questions, onSubmit }: Props) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);

  const handleAnswer = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit?.(answers);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

  if (!question) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No questions available in this survey.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Question {currentQuestion + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-8">
            <h3 className="text-lg font-medium">{question.question}</h3>

            {question.type === 'likert' && (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswer(question.id, value)}
                className="space-y-3"
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={`${question.id}-${option.value}`} />
                    <Label htmlFor={`${question.id}-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {question.type === 'multiple_choice' && question.options && (
              <RadioGroup
                value={answers[question.id] || ""}
                onValueChange={(value) => handleAnswer(question.id, value)}
                className="space-y-3"
              >
                {question.options.map((option) => (
                  <div key={`${question.id}-${option}`} className="flex items-center space-x-3">
                    <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                    <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {(question.type === 'open_ended' || question.type === 'scenario') && (
              <Textarea
                value={answers[question.id] || ""}
                onChange={(e) => handleAnswer(question.id, e.target.value)}
                placeholder="Type your answer here..."
                className="min-h-[150px]"
              />
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        {currentQuestion === questions.length - 1 ? (
          <Button onClick={handleSubmit}>Submit Survey</Button>
        ) : (
          <Button onClick={handleNext}>Next Question</Button>
        )}
      </div>
    </div>
  );
}
