import { Globe, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface LanguagesCertificationsSectionProps {
  languages: string[];
  certifications: string[];
}

export const LanguagesCertificationsSection = ({ 
  languages = [], 
  certifications = [] 
}: LanguagesCertificationsSectionProps) => {
  if (languages.length === 0 && certifications.length === 0) return null;

  return (
    <section className="grid md:grid-cols-2 gap-6">
      {languages.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Languages</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Badge 
                key={lang} 
                variant="outline"
                className="px-3 py-1"
              >
                {lang}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Certifications</h3>
          </div>
          <div className="space-y-2">
            {certifications.map((cert) => (
              <div 
                key={cert}
                className="text-sm text-gray-600 flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                {cert}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};