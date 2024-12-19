import { Check, FileText, Building, Users, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from 'react';
import type { Candidate } from "@/types/candidate";
import { EnrichCandidateDialog } from './EnrichCandidateDialog';

interface ShortlistChecklistProps {
  candidates: Candidate[];
}

interface SubTask {
  id: string;
  label: string;
}

const researchTasks = [
  {
    id: "company-research",
    label: "Previous Company Research",
    subtasks: [
      { id: "company-culture", label: "Company Culture Analysis" },
      { id: "company-growth", label: "Growth Trajectory" },
      { id: "company-tech", label: "Tech Stack Assessment" },
    ],
  },
  {
    id: "candidate-research",
    label: "Candidate Deep Research",
    subtasks: [
      { id: "career-progression", label: "Career Progression Analysis" },
      { id: "skill-validation", label: "Skills Validation" },
      { id: "online-presence", label: "Online Presence Review" },
    ],
  },
  {
    id: "cultural-fit",
    label: "Cultural Fit Assessment",
    subtasks: [
      { id: "values-alignment", label: "Values Alignment" },
      { id: "communication-style", label: "Communication Style" },
      { id: "team-dynamics", label: "Team Dynamics Fit" },
    ],
  },
];

const reportTypes = [
  { id: "detailed", label: "Detailed Assessment Report", icon: FileText },
  { id: "company", label: "Company Background Report", icon: Building },
  { id: "cultural", label: "Cultural Fit Report", icon: Users },
  { id: "ai", label: "AI Insights Report", icon: Brain },
];

export function ShortlistChecklist({ candidates }: ShortlistChecklistProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [showEnrichDialog, setShowEnrichDialog] = useState(false);

  const handleTaskChange = (taskId: string, checked: boolean) => {
    setSelectedTasks(prev => 
      checked ? [...prev, taskId] : prev.filter(id => id !== taskId)
    );
  };

  const getSelectedTaskLabels = () => {
    return selectedTasks.map(taskId => {
      for (const task of researchTasks) {
        const subtask = task.subtasks.find(st => st.id === taskId);
        if (subtask) return subtask.label;
      }
      return '';
    }).filter(Boolean);
  };

  return (
    <div className="relative flex h-screen flex-col border-l">
      <div className="flex-1 overflow-auto p-8">
        <div className="space-y-10">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">AI Research Agent</h2>
            <p className="text-sm text-muted-foreground">
              Choose tasks for our AI Agents to perform. They'll search online resources to gather comprehensive data, enabling informed decision-making for your candidate selection process.
            </p>
          </div>

          <div className="space-y-6">
            {researchTasks.map((task) => (
              <div key={task.id} className="space-y-4">
                <div className="flex items-center gap-2.5">
                  {task.id === "company-research" && <Building className="h-5 w-5" />}
                  {task.id === "candidate-research" && <Users className="h-5 w-5" />}
                  {task.id === "cultural-fit" && <Brain className="h-5 w-5" />}
                  <span className="text-base font-medium">{task.label}</span>
                </div>
                <div className="space-y-4 pl-7">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="group flex items-center gap-3">
                      <div className="relative flex h-5 w-5 shrink-0 items-center justify-center">
                        <Checkbox 
                          id={subtask.id}
                          className="h-5 w-5 rounded-[4px] border-[1.5px] border-indigo-600 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-indigo-600 data-[state=checked]:text-white"
                          onCheckedChange={(checked) => handleTaskChange(subtask.id, checked as boolean)}
                          checked={selectedTasks.includes(subtask.id)}
                        />
                        <div className="absolute inset-0 -z-10 rounded-[4px] bg-indigo-50 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <label
                        htmlFor={subtask.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {subtask.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 border-t bg-background p-4">
        <Button 
          size="lg"
          className="w-full gap-2.5 bg-indigo-600 text-sm font-medium text-white hover:bg-indigo-600/90"
          onClick={() => setShowEnrichDialog(true)}
          disabled={selectedTasks.length === 0}
        >
          <FileText className="h-5 w-5" />
          Enrich Candidate
        </Button>
      </div>

      <EnrichCandidateDialog
        open={showEnrichDialog}
        onOpenChange={setShowEnrichDialog}
        tasks={getSelectedTaskLabels()}
        candidates={candidates}
      />
    </div>
  );
}