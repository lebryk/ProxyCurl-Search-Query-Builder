import { Briefcase } from "lucide-react";
import type { WorkHistory } from "@/types/candidate";

interface WorkExperienceSectionProps {
  workHistory: WorkHistory[];
}

export const WorkExperienceSection = ({ workHistory = [] }: WorkExperienceSectionProps) => {
  if (workHistory.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Briefcase className="w-5 h-5 text-gray-500" />
        <h3 className="text-lg font-semibold text-gray-900">Work Experience</h3>
      </div>
      <div className="space-y-6">
        {workHistory.map((work, index) => (
          <div key={index} className="relative pl-6 pb-6 last:pb-0">
            {/* Timeline line */}
            <div className="absolute left-0 top-2 bottom-0 w-px bg-gray-200" />
            {/* Timeline dot */}
            <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-blue-600" />
            
            <div className="space-y-1">
              <h4 className="font-semibold text-gray-900">{work.position}</h4>
              <div className="text-sm text-gray-600">
                <span className="font-medium">{work.company}</span> • {work.duration}
              </div>
              <p className="text-gray-600 leading-relaxed mt-2">{work.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};