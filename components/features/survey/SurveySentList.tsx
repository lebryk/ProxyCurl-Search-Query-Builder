import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, Loader2 } from "lucide-react";

export interface SentSurvey {
  id: string;
  templateName: string;
  candidateName: string;
  candidateId: string;
  sentDate: Date;
  status: "pending" | "completed" | "expired";
  completedDate?: Date;
}

interface SurveySentListProps {
  surveys: SentSurvey[];
  onViewResults: (surveyId: string) => void;
  onMarkAsCompleted: (surveyId: string) => void;
}

export function SurveySentList({ surveys, onViewResults, onMarkAsCompleted, loadingSurveyId }: SurveySentListProps & { loadingSurveyId?: string }) {
  const getStatusBadge = (status: SentSurvey["status"]) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      expired: "bg-gray-100 text-gray-800",
    };

    return (
      <Badge className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Template Name</TableHead>
            <TableHead>Candidate</TableHead>
            <TableHead>Sent Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Completed Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {surveys.map((survey) => (
            <TableRow key={survey.id}>
              <TableCell className="font-medium">{survey.templateName}</TableCell>
              <TableCell>{survey.candidateName}</TableCell>
              <TableCell>{survey.sentDate.toLocaleDateString()}</TableCell>
              <TableCell>{getStatusBadge(survey.status)}</TableCell>
              <TableCell>
                {survey.completedDate?.toLocaleDateString() || "-"}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {survey.status === "pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onMarkAsCompleted(survey.id)}
                    title="Mark as completed"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewResults(survey.id)}
                  disabled={survey.status !== "completed"}
                >
                  {loadingSurveyId === survey.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {surveys.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                No surveys have been sent yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}