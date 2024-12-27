"use client";
import { useState } from "react";
import { SurveyTemplatesList } from "@/components/features/survey/SurveyTemplatesList";
import { EditTemplateDialog } from "@/components/features/survey/EditTemplateDialog";
import { PreviewDialog } from "@/components/features/survey/PreviewDialog";
import { SendSurveyDialog } from "@/components/features/survey/SendSurveyDialog";
import { SurveyResultsDialog } from "@/components/features/survey/SurveyResultsDialog";
import { SurveySentList } from "@/components/features/survey/SurveySentList";
import { useSurveyTemplates } from "@/hooks/useSurveyTemplates";
import { useShortlistedCandidates } from "@/hooks/useShortlistedCandidates";
import type { SurveyTemplate } from "@/types/survey";
import { useProject } from "@/contexts/ProjectContext";
import { useToast } from "@/hooks/use-toast";
import { saveSentSurvey, getSentSurveys, markSurveyAsCompleted, deleteSentSurvey } from "@/services/sentSurveys";
import { getSurveyResponse } from "@/services/surveyResponses";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SearchResult } from "@/types/PersonSearch";
import { createClient } from "@/utils/supabase/client";

export default function CultureFitSurvey() {
  const { toast } = useToast();
  const supabase = createClient();
  const queryClient = useQueryClient();
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate, duplicateTemplate } = useSurveyTemplates();
  const { data: shortlistedCandidates = [] } = useShortlistedCandidates();
  const [previewTemplate, setPreviewTemplate] = useState<SurveyTemplate | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<SurveyTemplate | null>(null);
  const [sendingTemplate, setSendingTemplate] = useState<SurveyTemplate | null>(null);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [viewingSurveyResults, setViewingSurveyResults] = useState<{
    candidateId: string;
    data: any | null;
  } | null>(null);
  const [loadingSurveyId, setLoadingSurveyId] = useState<string | undefined>(undefined);
  const { activeProject } = useProject();

  const { data: sentSurveys = [] } = useQuery({
    queryKey: ['sent-surveys', activeProject?.id],
    queryFn: () => activeProject?.id ? getSentSurveys(activeProject.id) : Promise.resolve([]),
    enabled: !!activeProject?.id,
  });

  const handleSendTemplate = async () => {
    if (!sendingTemplate || !activeProject?.id || selectedCandidates.length === 0) return;

    console.log('Starting to send surveys:', {
      template: sendingTemplate.name,
      candidates: selectedCandidates,
      projectId: activeProject.id
    });

    try {
      const results = await Promise.all(
        selectedCandidates.map(candidateId => {
          console.log('Sending survey to candidate:', candidateId);
          return saveSentSurvey(activeProject.id, sendingTemplate.id, candidateId);
        })
      );

      console.log('Survey sending results:', results);

      const selectedCandidatesList = shortlistedCandidates.filter(c => 
        selectedCandidates.includes(c.profile?.public_identifier || '')
      );
      
      const selectedCandidateNames = selectedCandidatesList
        .map(c => c.profile ? `${c.profile.first_name} ${c.profile.last_name}` : 'Unknown Candidate')
        .join(", ");

      queryClient.invalidateQueries({ queryKey: ['sent-surveys', activeProject.id] });

      toast({
        title: "Survey Sent",
        description: `Survey "${sendingTemplate.name}" has been sent to ${selectedCandidateNames}`,
      });
      setSendingTemplate(null);
      setSelectedCandidates([]);
    } catch (error) {
      console.error('Error sending surveys:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send the survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMarkAsCompleted = async (surveyId: string) => {
    if (!activeProject?.id) return;

    try {
      await markSurveyAsCompleted(surveyId);
      queryClient.invalidateQueries({ queryKey: ['sent-surveys', activeProject.id] });
      toast({
        title: "Survey Updated",
        description: "Survey has been marked as completed.",
      });
    } catch (error) {
      console.error('Error marking survey as completed:', error);
      toast({
        title: "Update Failed",
        description: "Failed to mark the survey as completed. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    if (!activeProject?.id) return;

    try {
      await deleteSentSurvey(surveyId);
      queryClient.invalidateQueries({ queryKey: ['sent-surveys', activeProject.id] });
      toast({
        title: "Survey Deleted",
        description: "Survey has been deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting survey:', error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the survey. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleResendSurvey = async (surveyId: string) => {
    if (!activeProject?.id) return;

    console.log('Resending survey:', surveyId);
    try {
      const response = await fetch('/api/surveys/generate-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ surveyId }),
      });

      console.log('Resend response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to resend survey:', errorText);
        throw new Error('Failed to resend survey');
      }

      const result = await response.json();
      console.log('Resend result:', result);

      if (result.status === 'no_email') {
        // Show dialog to manually input email
        const email = await new Promise<string>((resolve, reject) => {
          const email = window.prompt(
            `No email found for ${result.candidateName}. Please enter their email address:`
          );
          if (email) {
            resolve(email);
          } else {
            reject(new Error('Email input cancelled'));
          }
        });

        // Save the email and retry sending
        const { error: saveError } = await supabase
          .from('profile_contacts')
          .upsert({
            id: result.candidateId,
            email: email,
            created_at: new Date().toISOString(),
          });

        if (saveError) {
          throw new Error('Failed to save email');
        }

        // Retry sending with the new email
        return handleResendSurvey(surveyId);
      }

      queryClient.invalidateQueries({ queryKey: ['sent-surveys', activeProject.id] });
      toast({
        title: "Survey Resent",
        description: result.status === 'sent' 
          ? "Survey email has been sent successfully."
          : "Survey link has been generated but email could not be sent.",
      });
    } catch (error) {
      console.error('Error resending survey:', error);
      toast({
        title: "Resend Failed",
        description: "Failed to resend the survey email. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleViewResults = async (surveyId: string) => {
    const survey = sentSurveys.find(s => s.id === surveyId);
    if (!survey) {
      toast({
        title: "Error",
        description: "Survey not found.",
        variant: "destructive",
      });
      return;
    }

    setLoadingSurveyId(surveyId);

    try {
      if (!activeProject?.id) {
        throw new Error('Active project not found');
      }
      const response = await getSurveyResponse(surveyId, activeProject?.id);
      setViewingSurveyResults({
        candidateId: survey.candidate_id,
        data: response,
      });
    } catch (error) {
      console.error('Error fetching survey results:', error);
      toast({
        title: "Error",
        description: "Failed to fetch survey results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingSurveyId(undefined);
    }
  };

  const handleCreateNewTemplate = () => {
    if (!activeProject?.id) return;

    const newTemplate: any = {
      project_id: activeProject.id,
      name: "New Survey Template",
      description: "Click edit to customize this template with your own questions and requirements.",
      questions: [
        {
          id: crypto.randomUUID(),
          question: "What interests you most about our company culture?",
          type: "open_ended",
          category: "Culture Fit"
        },
        {
          id: crypto.randomUUID(),
          question: "How do you prefer to work in a team environment?",
          type: "open_ended",
          category: "Team Work"
        }
      ],
      tags: ["General", "Culture Fit"]
    };

    createTemplate(newTemplate);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <SurveyTemplatesList
        templates={templates}
        onCreateTemplate={handleCreateNewTemplate}
        onDeleteTemplate={deleteTemplate}
        onDuplicateTemplate={template => duplicateTemplate(template.id)}
        onPreviewTemplate={(template) => {
          setPreviewTemplate(template);
          setShowPreviewDialog(true);
        }}
        onEditTemplate={setEditingTemplate}
        onSendTemplate={setSendingTemplate}
      />

      {/* Sent Surveys List */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Sent Surveys</h2>
        <SurveySentList
          surveys={sentSurveys as any}
          candidates={shortlistedCandidates}
          onViewResults={handleViewResults}
          onMarkCompleted={handleMarkAsCompleted}
          onDelete={handleDeleteSurvey}
          onResend={handleResendSurvey}
          loadingSurveyId={loadingSurveyId}
        />
      </div>

      {/* Dialogs */}
      <PreviewDialog
        open={showPreviewDialog}
        onOpenChange={setShowPreviewDialog}
        template={previewTemplate}
        onSubmit={(answers) => {
          console.log("Preview answers:", answers);
          setShowPreviewDialog(false);
        }}
      />

      {editingTemplate && (
        <EditTemplateDialog
          template={editingTemplate}
          open={true}
          onOpenChange={(open) => !open && setEditingTemplate(null)}
          onSave={(template) => {
            updateTemplate(template);
            setEditingTemplate(null);
          }}
        />
      )}

      <SendSurveyDialog
        open={!!sendingTemplate}
        onOpenChange={(open) => !open && setSendingTemplate(null)}
        candidates={shortlistedCandidates}
        selectedCandidates={selectedCandidates}
        onCandidateSelect={(candidateId, checked) => {
          if (checked) {
            setSelectedCandidates(prev => [...prev, candidateId]);
          } else {
            setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
          }
        }}
        onSend={handleSendTemplate}
        onCancel={() => setSendingTemplate(null)}
      />

      {viewingSurveyResults && (
        <SurveyResultsDialog
          open={!!viewingSurveyResults}
          onOpenChange={(open) => !open && setViewingSurveyResults(null)}
          results={viewingSurveyResults.data}
        />
      )}
    </div>
  );
}