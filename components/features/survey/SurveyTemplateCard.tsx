import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Copy, Trash2, Eye, Edit, FileText, Send } from "lucide-react";
import { SurveyQuestion } from "./SurveyQuestionCard";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

export interface SurveyTemplate {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  questions: SurveyQuestion[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface Props {
  template: SurveyTemplate;
  onCopy: (template: SurveyTemplate) => void;
  onDelete: (templateId: string) => void;
  onPreview: (template: SurveyTemplate) => void;
  onEdit: (template: SurveyTemplate) => void;
  onSend: (template: SurveyTemplate) => void;
}

export function SurveyTemplateCard({ template, onCopy, onDelete, onPreview, onEdit, onSend }: Props) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <Card className="group hover:shadow-md transition-shadow duration-200 flex flex-col min-h-[320px]">
      <div className="flex-1">
        <CardHeader className="pb-3 space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <CardTitle className="text-xl font-semibold leading-none">
                {template.name}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {template.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {template.tags.map((tag, index) => (
              <Badge 
                key={index} 
                variant="secondary"
                className="bg-primary/5 hover:bg-primary/10 text-primary"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent>
        </CardContent>
      </div>
      <CardFooter className="flex flex-col p-0 border-t">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground px-3.5 py-3.5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>{template.questions.length} questions</span>
          </div>
          <span className="text-xs">
            Updated {formatDate(template.updated_at)}
          </span>
        </div>
        <Separator />
        <div className="flex justify-between w-full px-3.5 py-3.5">
          <TooltipProvider>
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onPreview(template)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Preview Template</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onEdit(template)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Template</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onCopy(template)}
                    className="hover:bg-primary/10 hover:text-primary"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Duplicate Template</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onDelete(template.id)}
                    className="hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Template</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => onSend(template)}
                    className="hover:bg-blue-500/10 text-blue-500 hover:text-blue-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send Survey</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
}
