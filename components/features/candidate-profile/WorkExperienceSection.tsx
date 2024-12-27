import { Building2 } from "lucide-react";
import { Experience } from "@/types/PersonSearch";

interface WorkExperienceSectionProps {
  workHistory: Experience[];
}

export function WorkExperienceSection({ workHistory }: WorkExperienceSectionProps) {
  if (!workHistory?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Building2 className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
      </div>
      <div className="space-y-4">
        {workHistory.map((experience, index) => (
          <div key={index} className="space-y-2">
            <div>
              <h4 className="font-medium text-gray-900">{experience.title || 'Not specified'}</h4>
              <p className="text-sm text-gray-600">{experience.company || 'Not specified'}</p>
              <p className="text-sm text-gray-500">
                {experience.starts_at?.year || 'Unknown'} - {experience.ends_at?.year || 'Present'}
              </p>
            </div>
            {experience.description && (
              <p className="text-sm text-gray-600 whitespace-pre-line">
                {experience.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}