import React from "react";
import { SurveyTemplateCard } from "./SurveyTemplateCard";
import type { SurveyTemplate } from "./SurveyTemplateCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Props {
  templates: SurveyTemplate[];
  onCreateTemplate: () => void;
  onDeleteTemplate: (templateId: string) => void;
  onDuplicateTemplate: (template: SurveyTemplate) => void;
  onPreviewTemplate: (template: SurveyTemplate) => void;
  onEditTemplate: (template: SurveyTemplate) => void;
  onSendTemplate: (template: SurveyTemplate) => void;
}

export function SurveyTemplatesList({
  templates,
  onCreateTemplate,
  onDeleteTemplate,
  onDuplicateTemplate,
  onPreviewTemplate,
  onEditTemplate,
  onSendTemplate,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Survey Templates</h1>
        <Button className="h-8 gap-2" onClick={onCreateTemplate}>
          <Plus className="h-4 w-4" />
          New Survey
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <SurveyTemplateCard
            key={template.id}
            template={template}
            onCopy={onDuplicateTemplate}
            onDelete={onDeleteTemplate}
            onPreview={onPreviewTemplate}
            onEdit={onEditTemplate}
            onSend={onSendTemplate}
          />
        ))}
      </div>
    </div>
  );
}