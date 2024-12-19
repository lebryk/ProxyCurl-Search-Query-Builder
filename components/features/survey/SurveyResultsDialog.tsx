import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { SurveyResults } from "./SurveyResults";

interface SurveyResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: any | null;
}

export function SurveyResultsDialog({
  open,
  onOpenChange,
  results,
}: SurveyResultsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Survey Results</DialogTitle>
          <DialogDescription>
            View the candidate's survey responses
          </DialogDescription>
        </DialogHeader>
        {results ? (
          <SurveyResults results={results} />
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No results found for this survey
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}