import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SurveyPreview } from "./SurveyPreview";
import type { SurveyTemplate } from "@/types/survey";

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: SurveyTemplate | null;
  onSubmit: (answers: any) => void;
}

export function PreviewDialog({ open, onOpenChange, template, onSubmit }: PreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            {template ? template.name : "Survey Preview"}
          </DialogTitle>
          <DialogDescription>
            Preview how the survey will appear to candidates
          </DialogDescription>
        </DialogHeader>
        <SurveyPreview 
          questions={template?.questions || []}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}