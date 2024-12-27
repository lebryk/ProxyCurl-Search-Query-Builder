import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SearchResult } from "@/types/PersonSearch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { removeEmojis } from "@/lib/utils";
import { Eye, CheckCircle, Trash2, Send } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Database } from "@/types/supabase";

type SentSurvey = {
  id: string;
  candidate_id: string;
  survey_templates: {
    name: string;
  };
  email_sent_at: string | null;
  survey_status: string | null;
  completed_at: string | null;
  email_status: string | null;
  unique_token: string | null;
};

interface SurveySentListProps {
  surveys: SentSurvey[];
  candidates?: SearchResult[];
  onMarkCompleted: (surveyId: string) => void;
  onViewResults: (surveyId: string) => void;
  onDelete?: (surveyId: string) => void;
  onResend?: (surveyId: string) => void;
  loadingSurveyId?: string;
}

export function SurveySentList({
  surveys,
  candidates = [],
  onMarkCompleted,
  onViewResults,
  onDelete = () => {},
  onResend,
  loadingSurveyId,
}: SurveySentListProps) {
  const getCandidateProfile = (candidateId: string) => {
    return candidates.find(c => c.profile?.public_identifier === candidateId)?.profile;
  };

  const getEmailStatusColor = (status?: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'no_email_found':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmailStatusText = (status?: string) => {
    switch (status) {
      case 'sent':
        return 'Email Sent';
      case 'failed':
        return 'Email Failed';
      case 'pending':
        return 'Sending Email';
      case 'no_email_found':
        return 'No Email Found';
      default:
        return 'Email Status Unknown';
    }
  };

  const getStatus = (survey: SentSurvey) => {
    return survey.survey_status || 'pending';
  };

  if (surveys.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sent Surveys</CardTitle>
          <CardDescription>Track the status of sent surveys</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">No surveys have been sent yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sent Surveys</CardTitle>
        <CardDescription>Track the status of sent surveys</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {surveys.map((survey) => {
          const profile = getCandidateProfile(survey.candidate_id);
          if (!profile) return null;

          const name = `${profile.first_name || ''} ${profile.last_name || ''}`.trim();
          const initials = removeEmojis(name)
            .split(" ")
            .map(n => n[0])
            .filter(Boolean)
            .join("")
            .toUpperCase();

          const showResend = survey.email_status === 'failed' || survey.email_status === 'no_email_found';
          const surveyStatus = getStatus(survey);

          return (
            <div
              key={survey.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10 ring-2 ring-primary/5">
                  {profile.profile_pic_url ? (
                    <AvatarImage src={profile.profile_pic_url} alt={name} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/30 text-primary font-medium">
                      {initials || '?'}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h4 className="font-medium">{name}</h4>
                  <p className="text-sm text-gray-500">{survey.survey_templates.name}</p>
                  <div className="flex gap-2 items-center">
                    <p className="text-xs text-gray-400">
                      Sent: {survey.email_sent_at ? new Date(survey.email_sent_at).toLocaleDateString() : 'N/A'}
                    </p>
                    {surveyStatus && (
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        surveyStatus === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {surveyStatus.charAt(0).toUpperCase() + surveyStatus.slice(1)}
                      </span>
                    )}
                    {survey.email_status && (
                      <Tooltip>
                        <TooltipTrigger>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getEmailStatusColor(survey.email_status)}`}>
                            {getEmailStatusText(survey.email_status)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getEmailStatusText(survey.email_status)}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {showResend && onResend && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onResend(survey.id)}
                        disabled={loadingSurveyId === survey.id}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Resend Survey Email</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {surveyStatus === 'completed' ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onViewResults(survey.id)}
                        disabled={loadingSurveyId === survey.id}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View Survey Results</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onMarkCompleted(survey.id)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Mark as Completed</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                {onDelete && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onDelete(survey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Survey</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}