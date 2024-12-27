import React from 'react';
import { VolunteeringExperience } from '@/types/PersonSearch';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateObject } from '@/lib/utils';

interface VolunteerSectionProps {
  volunteerWork: VolunteeringExperience[];
}

export function VolunteerSection({ volunteerWork }: VolunteerSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Volunteer Experience</h3>
      <div className="space-y-4">
        {volunteerWork.map((work, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h4 className="font-medium">{work.title}</h4>
                  <p className="text-sm text-gray-600">
                    {work.company}
                    {work.cause && <span className="text-gray-500"> • {work.cause}</span>}
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {formatDateObject(work.starts_at)} - {work.ends_at ? formatDateObject(work.ends_at) : 'Present'}
                </div>
              </div>
              {work.description && (
                <p className="text-sm text-gray-600">{work.description}</p>
              )}
              {work.company_linkedin_profile_url && (
                <a
                  href={work.company_linkedin_profile_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  View Organization
                </a>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
