import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Candidate } from '@/types/candidate';
import { ProfileHeader } from './candidate-profile/ProfileHeader';
import { AboutSection } from './candidate-profile/AboutSection';
import { SkillsSection } from './candidate-profile/SkillsSection';
import { WorkExperienceSection } from './candidate-profile/WorkExperienceSection';
import { EducationSection } from './candidate-profile/EducationSection';
import { LanguagesCertificationsSection } from './candidate-profile/LanguagesCertificationsSection';
import { ContactSection } from './candidate-profile/ContactSection';

interface CandidateProfileDialogProps {
  candidate: Candidate | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateProfileDialog({ candidate, isOpen, onClose }: CandidateProfileDialogProps) {
  if (!candidate) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <ProfileHeader candidate={candidate} />

        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="p-6 space-y-8">
            <AboutSection summary={candidate.summary} />

            {candidate.skills?.length > 0 && (
              <>
                <Separator />
                <SkillsSection skills={candidate.skills} />
              </>
            )}

            {candidate.workHistory?.length > 0 && (
              <>
                <Separator />
                <WorkExperienceSection workHistory={candidate.workHistory} />
              </>
            )}

            {candidate.education?.length > 0 && (
              <>
                <Separator />
                <EducationSection education={candidate.education} />
              </>
            )}

            {(candidate.languages?.length > 0 || candidate.certifications?.length > 0) && (
              <>
                <Separator />
                <LanguagesCertificationsSection 
                  languages={candidate.languages || []}
                  certifications={candidate.certifications || []}
                />
              </>
            )}

            {candidate.contactInfo && (
              <>
                <Separator />
                <ContactSection contactInfo={candidate.contactInfo} />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}