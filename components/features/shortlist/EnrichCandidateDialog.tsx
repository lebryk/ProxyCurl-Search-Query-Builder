import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { Candidate } from "@/types/candidate";

interface EnrichCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tasks: string[];
  candidates: Candidate[];
}

export function EnrichCandidateDialog({
  open,
  onOpenChange,
  tasks,
  candidates,
}: EnrichCandidateDialogProps) {
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState(0);
  const [currentCandidate, setCurrentCandidate] = useState(0);

  useEffect(() => {
    if (!open) {
      setProgress(0);
      setCurrentTask(0);
      setCurrentCandidate(0);
      return;
    }

    const totalSteps = tasks.length * candidates.length;
    const stepSize = 100 / totalSteps;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onOpenChange(false);
          }, 500);
          return 100;
        }
        
        // Calculate current task and candidate based on progress
        const completedSteps = Math.floor((prev / 100) * totalSteps);
        const newTaskIndex = completedSteps % tasks.length;
        const newCandidateIndex = Math.floor(completedSteps / tasks.length);
        
        if (newTaskIndex !== currentTask || newCandidateIndex !== currentCandidate) {
          setCurrentTask(newTaskIndex);
          setCurrentCandidate(newCandidateIndex);
        }
        
        return prev + stepSize / 3; // Divide by 3 to make the animation slower
      });
    }, 100);

    return () => clearInterval(interval);
  }, [open, tasks.length, candidates.length, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enriching candidate profiles</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Progress value={progress} className="w-full" />
          <div className="space-y-2">
            <div className="text-sm font-medium">
              Candidate {currentCandidate + 1} of {candidates.length}: {candidates[currentCandidate]?.name}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentTask < tasks.length && currentCandidate < candidates.length ? (
                <>Working on: {tasks[currentTask]}</>
              ) : (
                <>Completed all tasks!</>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
