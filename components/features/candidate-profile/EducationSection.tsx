import { GraduationCap } from "lucide-react";
import type { Education } from "@/types/candidate";

interface EducationSectionProps {
  education: Education[];
}

export const EducationSection = ({ education = [] }: EducationSectionProps) => {
  if (!education?.length) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <GraduationCap className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Education</h3>
      </div>
      <div className="space-y-4">
        {education.map((edu, index) => (
          <div key={index} className="pl-6 relative">
            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-2 h-2 rounded-full bg-blue-600" />
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900">{edu?.institution || 'Unknown Institution'}</h4>
              <div className="text-sm text-gray-600">
                {edu?.degree || 'Degree'} in {edu?.field || 'Field'} • {edu?.year || 'Year'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};