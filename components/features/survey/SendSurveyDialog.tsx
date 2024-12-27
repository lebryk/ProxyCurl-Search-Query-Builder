import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchResult } from "@/types/PersonSearch";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { removeEmojis } from "@/lib/utils";
import type { SurveyTemplate } from "@/types/survey";

interface SendSurveyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidates: SearchResult[];
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
            Select candidates to send the survey to
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Label className="text-sm font-medium">Select candidates:</Label>
          <ScrollArea className="h-[300px] mt-2">
            <div className="space-y-4">
              {candidates.map((result) => {
                const profile = result.profile;
                if (!profile?.public_identifier) return null;

                return (
                  <div key={profile.public_identifier} className="flex items-center space-x-4">
                    <Checkbox
                      id={profile.public_identifier}
                      checked={selectedCandidates.includes(profile.public_identifier)}
                      onCheckedChange={(checked) => 
                        onCandidateSelect(profile.public_identifier, checked as boolean)
                      }
                    />
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 ring-2 ring-primary/5">
                        <AvatarImage src={profile.profile_pic_url || undefined} alt={`${profile.first_name} ${profile.last_name}`} />
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
                          {removeEmojis(`${profile.first_name} ${profile.last_name}`)
                            .split(" ")
                            .map(n => n[0])
                            .filter(Boolean)
                            .join("")
                            .toUpperCase() || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="text-sm font-medium leading-none">{`${profile.first_name} ${profile.last_name}`}</h4>
                        <p className="text-sm text-gray-500">{profile.headline || 'No headline'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
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