import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Candidate } from "@/types/candidate";

interface SendSurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: Candidate[];
  selectedCandidates: string[];
  onCandidateSelect: (candidateId: string, checked: boolean) => void;
  onSend: () => void;
  onCancel: () => void;
}

export function SendSurveyDialog({
  open,
  onOpenChange,
  candidates,
  selectedCandidates,
  onCandidateSelect,
  onSend,
  onCancel,
}: SendSurveyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Send Survey to Candidates</DialogTitle>
          <DialogDescription>
            Select candidates to send this survey to
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="text-sm font-medium">Select candidates to send the survey:</Label>
          <ScrollArea className="h-[300px] mt-2">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center space-x-2 py-2">
                <Checkbox
                  id={candidate.id}
                  checked={selectedCandidates.includes(candidate.id)}
                  onCheckedChange={(checked) => {
                    onCandidateSelect(candidate.id, !!checked);
                  }}
                />
                <Label htmlFor={candidate.id} className="flex-1">
                  <div>{candidate.name}</div>
                  <div className="text-sm text-gray-500">{candidate.title} at {candidate.company}</div>
                </Label>
              </div>
            ))}
            {candidates.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No shortlisted candidates found
              </div>
            )}
          </ScrollArea>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={onSend}
            disabled={selectedCandidates.length === 0}
          >
            Send Survey
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}