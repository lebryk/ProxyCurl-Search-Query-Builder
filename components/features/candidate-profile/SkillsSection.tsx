import { Badge } from "@/components/ui/badge";

interface SkillsSectionProps {
  skills: string[];
}

export const SkillsSection = ({ skills = [] }: SkillsSectionProps) => {
  if (skills.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-semibold mb-4 text-gray-900">Skills & Expertise</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <Badge 
            key={skill} 
            variant="secondary"
            className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            {skill}
          </Badge>
        ))}
      </div>
    </section>
  );
};