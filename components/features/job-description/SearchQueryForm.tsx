import { useCallback, useState, useEffect } from "react";
import { useSearchFormState } from "@/hooks/useSearchFormState";
import { JobTitlesSection } from "./JobTitlesSection";
import { ExperienceSection } from "./ExperienceSection";
import { CompaniesSection } from "./CompaniesSection";
import { IndustrySection } from "./IndustrySection";
import { GenderSection } from "./GenderSection";
import { EducationSection } from "./EducationSection";
import { LocationLanguageSection } from "./LocationLanguageSection";
import { SkillsSection } from "./form/SkillsSection";
import type { Tag } from "@/types/common";

type SettersType = ReturnType<typeof useSearchFormState>['setters'];

export const SearchQueryForm = () => {
  const { formState, setters } = useSearchFormState();
  const [localExperienceRange, setLocalExperienceRange] = useState<[number, number]>(formState.experienceRange);

  // Update local experience range when form state changes
  useEffect(() => {
    setLocalExperienceRange(formState.experienceRange);
  }, [formState.experienceRange]);

  const handleFieldChange = useCallback(<K extends keyof SettersType>(
    field: K,
    value: Parameters<SettersType[K]>[0]
  ) => {
    console.log(`Setting ${String(field)}:`, value);
    const setter = setters[field] as (value: Parameters<SettersType[K]>[0]) => void;
    setter(value);
  }, [setters]);

  const handleExperienceChange = useCallback((value: [number, number]) => {
    setLocalExperienceRange(value);
  }, []);

  const handleExperienceCommit = useCallback((value: [number, number]) => {
    handleFieldChange('setExperienceRange', value);
  }, [handleFieldChange]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Column */}
      <div className="space-y-3">
        <JobTitlesSection 
          jobTitles={formState.jobTitles}
          onJobTitlesChange={(tags: Tag[]) => handleFieldChange('setJobTitles', tags)}
          jobTitleSuggestions={[]}
        />

        <SkillsSection
          skills={formState.skills}
          onSkillsChange={(tags: Tag[]) => handleFieldChange('setSkills', tags)}
        />

        <LocationLanguageSection
          languages={formState.languages}
          nationalities={formState.nationalities}
          locations={formState.locations}
          onLanguagesChange={(tags: Tag[]) => handleFieldChange('setLanguages', tags)}
          onNationalitiesChange={(tags: Tag[]) => handleFieldChange('setNationalities', tags)}
          onLocationsChange={(tags: Tag[]) => handleFieldChange('setLocations', tags)}
        />

        <EducationSection
          educationDegrees={formState.educationDegrees}
          educationMajors={formState.educationMajors}
          onEducationDegreesChange={(tags: Tag[]) => handleFieldChange('setEducationDegrees', tags)}
          onEducationMajorsChange={(tags: Tag[]) => handleFieldChange('setEducationMajors', tags)}
        />
      </div>

      {/* Right Column */}
      <div className="space-y-3">
        <ExperienceSection
          experienceRange={localExperienceRange}
          onExperienceRangeChange={handleExperienceChange}
          onExperienceRangeCommit={handleExperienceCommit}
        />

        <CompaniesSection
          companies={formState.companies}
          excludedCompanies={formState.excludedCompanies}
          currentEmployer={formState.currentEmployer}
          previousEmployer={formState.previousEmployer}
          onCompaniesChange={(tags: Tag[]) => handleFieldChange('setCompanies', tags)}
          onExcludedCompaniesChange={(tags: Tag[]) => handleFieldChange('setExcludedCompanies', tags)}
          onCurrentEmployerChange={(tags: Tag[]) => handleFieldChange('setCurrentEmployer', tags)}
          onPreviousEmployerChange={(tags: Tag[]) => handleFieldChange('setPreviousEmployer', tags)}
        />

        <IndustrySection
          industries={formState.industries}
          onIndustriesChange={(tags: Tag[]) => handleFieldChange('setIndustries', tags)}
        />

        <GenderSection
          gender={formState.gender}
          onGenderChange={(value) => handleFieldChange('setGender', value)}
        />
      </div>
    </div>
  );
};