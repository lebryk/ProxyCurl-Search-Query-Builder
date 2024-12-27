import React from 'react';
import { Project } from '@/types/PersonSearch';
import { Card, CardContent } from '@/components/ui/card';
import { formatDateObject } from '@/lib/utils';

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Projects</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, index) => (
          <Card key={index}>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{project.title}</h4>
                  <div className="text-sm text-gray-500">
                    {project.starts_at && (
                      <span>
                        {formatDateObject(project.starts_at)}
                        {project.ends_at && ` - ${formatDateObject(project.ends_at)}`}
                      </span>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="text-sm text-gray-600">{project.description}</p>
                )}
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline"
                  >
                    View Project
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
