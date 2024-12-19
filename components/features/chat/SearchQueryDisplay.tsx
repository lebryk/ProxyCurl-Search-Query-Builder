import { Button } from "@/components/ui/button";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useProject } from "@/contexts/ProjectContext";

export const SearchQueryDisplay = () => {
  const { activeProject } = useProject();
  const { searchQuery } = useSearchQuery(activeProject?.id);

  if (!searchQuery) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-3 mb-2 shadow-sm">
      <div className="space-y-2">
        <div className="bg-white rounded-lg p-2 shadow-sm">
          <p className="text-s text-gray-700">
            Looking for{" "}
            {searchQuery.jobTitles?.map((title, index) => (
              <span key={title.id}>
                <span className="bg-blue-100 text-blue-600 px-1 py-0.5 rounded text-[14px]">
                  {title.label}
                </span>
                {index < searchQuery.jobTitles.length - 1 && " or "}
              </span>
            ))}
            {searchQuery.industries?.length > 0 && (
              <>
                {" "}in{" "}
                <span className="bg-purple-100 text-purple-600 px-1 py-0.5 rounded text-[14px]">
                  {searchQuery.industries.map(industry => industry.label).join(", ")}
                </span>
              </>
            )}
            {searchQuery.locations?.length > 0 && (
              <>
                {" "}based in{" "}
                <span className="bg-green-100 text-green-600 px-1 py-0.5 rounded text-[14px]">
                  {searchQuery.locations.map(location => location.label).join(", ")}
                </span>
              </>
            )}
            {searchQuery.experienceRange && (
              <>
                {" "}with{" "}
                <span className="bg-orange-100 text-orange-600 px-1 py-0.5 rounded text-[14px]">
                  {searchQuery.experienceRange[0]}-{searchQuery.experienceRange[1]} years
                </span>
                {" "}of experience
              </>
            )}
            {searchQuery.skills?.length > 0 && (
              <>
                . Must have skills in{" "}
                {searchQuery.skills.map((skill, index) => (
                  <span key={skill.id}>
                    <span className="bg-blue-100 text-blue-600 px-1 py-0.5 rounded text-[14px]">
                      {skill.label}
                    </span>
                    {index < searchQuery.skills.length - 1 && ", "}
                    {index === searchQuery.skills.length - 2 && "and "}
                  </span>
                ))}
              </>
            )}
            {searchQuery.educationDegrees?.length > 0 && (
              <>
                . Has{" "}
                <span className="bg-yellow-100 text-yellow-600 px-1 py-0.5 rounded text-[14px]">
                  {searchQuery.educationDegrees.map(degree => degree.label).join(" or ")}
                </span>
              </>
            )}
            {searchQuery.languages?.length > 0 && (
              <>
                {" "}and speaks{" "}
                {searchQuery.languages.map((language, index) => (
                  <span key={language.id}>
                    <span className="bg-pink-100 text-pink-600 px-1 py-0.5 rounded text-[14px]">
                      {language.label}
                    </span>
                    {index < searchQuery.languages.length - 1 && " and "}
                  </span>
                ))}
              </>
            )}
            .
          </p>
        </div>
      </div>
    </div>
  );
};