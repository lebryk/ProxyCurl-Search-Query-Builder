import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { SurveyTemplate } from "./SurveyTemplateCard";
import { DraggableQuestionList } from "./DraggableQuestionList";

interface Props {
  template: SurveyTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (template: SurveyTemplate) => void;
}

export function EditTemplateDialog({ template, open, onOpenChange, onSave }: Props) {
  const [editedTemplate, setEditedTemplate] = useState<SurveyTemplate>(template);
  const [newTag, setNewTag] = useState("");

  const handleAddTag = () => {
    if (newTag.trim() && !editedTemplate.tags.includes(newTag.trim())) {
      setEditedTemplate({
        ...editedTemplate,
        tags: [...editedTemplate.tags, newTag.trim()],
      });
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditedTemplate({
      ...editedTemplate,
      tags: editedTemplate.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleUpdateQuestion = (updatedQuestion: any) => {
    setEditedTemplate({
      ...editedTemplate,
      questions: editedTemplate.questions.map((q) =>
        q.id === updatedQuestion.id ? updatedQuestion : q
      ),
    });
  };

  const handleDeleteQuestion = (id: string) => {
    setEditedTemplate({
      ...editedTemplate,
      questions: editedTemplate.questions.filter((q) => q.id !== id),
    });
  };

  const handleQuestionsReorder = (reorderedQuestions: any[]) => {
    setEditedTemplate({
      ...editedTemplate,
      questions: reorderedQuestions,
    });
  };

  const handleSave = () => {
    onSave(editedTemplate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Template</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto space-y-6 py-4">
          <div className="space-y-2">
            <Label>Template Name</Label>
            <Input
              value={editedTemplate.name}
              onChange={(e) =>
                setEditedTemplate({ ...editedTemplate, name: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={editedTemplate.description}
              onChange={(e) =>
                setEditedTemplate({
                  ...editedTemplate,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {editedTemplate.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add new tag..."
                onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAddTag}
                disabled={!newTag.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Questions</Label>
            <DraggableQuestionList
              questions={editedTemplate.questions}
              onQuestionsReorder={handleQuestionsReorder}
              onUpdateQuestion={handleUpdateQuestion}
              onDeleteQuestion={handleDeleteQuestion}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
