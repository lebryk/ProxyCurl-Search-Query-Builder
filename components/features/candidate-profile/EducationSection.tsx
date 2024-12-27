import { GraduationCap } from "lucide-react";
import { Education } from "@/types/PersonSearch";

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education = [] }: EducationSectionProps) {
  if (!education?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
      </div>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="space-y-1">
            <h4 className="font-medium text-gray-900">{edu.school || 'Not specified'}</h4>
            <p className="text-sm text-gray-600">
              {edu.degree_name}{edu.field_of_study ? `, ${edu.field_of_study}` : ''}
            </p>
            <p className="text-sm text-gray-500">
              {edu.starts_at?.year || 'Unknown'} - {edu.ends_at?.year || 'Present'}
            </p>
            {edu.description && (
              <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">
                {edu.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}