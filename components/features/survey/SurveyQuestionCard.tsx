import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Trash2, GripVertical, Plus, X } from "lucide-react";

export interface SurveyQuestion {
  id: string;
  type: 'likert' | 'multiple_choice' | 'scenario' | 'open_ended';
  question: string;
  category: string;
  options?: string[];
}

interface Props {
  question: SurveyQuestion;
  onUpdate: (question: SurveyQuestion) => void;
  onDelete: (id: string) => void;
  dragHandleProps?: Record<string, any>;
}

export function SurveyQuestionCard({ question, onUpdate, onDelete, dragHandleProps }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState(question);
  const [newOption, setNewOption] = useState("");

  useEffect(() => {
    setEditedQuestion(question);
  }, [question]);

  const handleSave = () => {
    onUpdate(editedQuestion);
    setIsEditing(false);
  };

  const addOption = () => {
    if (newOption.trim() && editedQuestion.options) {
      setEditedQuestion({
        ...editedQuestion,
        options: [...editedQuestion.options, newOption.trim()]
      });
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    if (editedQuestion.options) {
      setEditedQuestion({
        ...editedQuestion,
        options: editedQuestion.options.filter((_, i) => i !== index)
      });
    }
  };

  return (
    <Card className="relative group">
      <div 
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-move opacity-0 group-hover:opacity-50"
        {...dragHandleProps}
      >
        <GripVertical className="w-4 h-4" />
      </div>
      <CardContent className="p-4 pl-8">
        {isEditing ? (
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <Textarea
                  value={editedQuestion.question}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
                  className="w-full"
                  placeholder="Enter question text..."
                />
              </div>
              <div className="space-y-2">
                <Input
                  value={editedQuestion.category}
                  onChange={(e) => setEditedQuestion({ ...editedQuestion, category: e.target.value })}
                  placeholder="Category"
                  className="w-[180px]"
                />
                <Select
                  value={editedQuestion.type}
                  onValueChange={(value: SurveyQuestion['type']) => 
                    setEditedQuestion({ 
                      ...editedQuestion, 
                      type: value,
                      options: value === 'multiple_choice' ? [] : undefined 
                    })
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="likert">Likert Scale</SelectItem>
                    <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                    <SelectItem value="scenario">Scenario</SelectItem>
                    <SelectItem value="open_ended">Open Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {editedQuestion.type === 'multiple_choice' && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Options</div>
                <div className="space-y-2">
                  {editedQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={option} readOnly className="flex-1" />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeOption(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Add new option..."
                      className="flex-1"
                      onKeyPress={(e) => e.key === 'Enter' && addOption()}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={addOption}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Changes
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium">{question.question}</p>
                {question.category && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Category: {question.category}
                  </p>
                )}
                {question.options && (
                  <div className="mt-2 space-y-1">
                    {question.options.map((option, index) => (
                      <div key={index} className="text-sm text-muted-foreground">
                        • {option}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{question.type.replace('_', ' ')}</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(question.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
