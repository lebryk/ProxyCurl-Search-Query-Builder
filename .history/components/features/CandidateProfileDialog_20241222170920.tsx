import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SearchResult } from '@/types/PersonSearch';
import { ProfileHeader } from './candidate-profile/ProfileHeader';
import { AboutSection } from './candidate-profile/AboutSection';
import { SkillsSection } from './candidate-profile/SkillsSection';
import { WorkExperienceSection } from './candidate-profile/WorkExperienceSection';
import { EducationSection } from './candidate-profile/EducationSection';
import { LanguagesCertificationsSection } from './candidate-profile/LanguagesCertificationsSection';
import { ContactSection } from './candidate-profile/ContactSection';
import { AccomplishmentsSection } from './candidate-profile/AccomplishmentsSection';
import { VolunteerSection } from './candidate-profile/VolunteerSection';
import { ProjectsSection } from './candidate-profile/ProjectsSection';

interface CandidateProfileDialogProps {
  candidate: SearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CandidateProfileDialog({ candidate, isOpen, onClose }: CandidateProfileDialogProps) {
  if (!candidate?.profile) {
    return null;
  }

  const profile = candidate.profile;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden p-0">
        <DialogTitle className="sr-only">
          {profile.full_name || `${profile.first_name} ${profile.last_name}`}'s Profile
        </DialogTitle>
        
        <ProfileHeader candidate={candidate} />

        <ScrollArea className="h-[calc(90vh-180px)]">
          <div className="p-6 space-y-8">
            <AboutSection summary={profile.summary || undefined} />

            {profile.experiences?.length > 0 && (
              <>
                <Separator />
                <WorkExperienceSection workHistory={profile.experiences} />
              </>
            )}

            {profile.education?.length > 0 && (
              <>
                <Separator />
                <EducationSection education={profile.education} />
              </>
            )}

            {(profile.languages?.length > 0 || profile.certifications?.length > 0) && (
              <>
                <Separator />
                <LanguagesCertificationsSection 
                  languages={profile.languages || []}
                  certifications={profile.certifications?.map(cert => cert.name || '').filter(Boolean) || []}
                />
              </>
            )}

            {(profile.accomplishment_organisations?.length > 0 ||
              profile.accomplishment_publications?.length > 0 ||
              profile.accomplishment_honors_awards?.length > 0 ||
              profile.accomplishment_patents?.length > 0 ||
              profile.accomplishment_courses?.length > 0 ||
              profile.accomplishment_test_scores?.length > 0) && (
              <>
                <Separator />
                <AccomplishmentsSection
                  organizations={profile.accomplishment_organisations}
                  publications={profile.accomplishment_publications}
                  awards={profile.accomplishment_honors_awards}
                  patents={profile.accomplishment_patents}
                  courses={profile.accomplishment_courses}
                  testScores={profile.accomplishment_test_scores}
                />
              </>
            )}

            {profile.volunteer_work?.length > 0 && (
              <>
                <Separator />
                <VolunteerSection volunteerWork={profile.volunteer_work} />
              </>
            )}

            {profile.accomplishment_projects?.length > 0 && (
              <>
                <Separator />
                <ProjectsSection projects={profile.accomplishment_projects} />
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}