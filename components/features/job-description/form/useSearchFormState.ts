import { useState, useEffect, useCallback } from "react";
import type { Tag } from "@/types/common";
import { useSearchQuery } from "@/hooks/useSearchQuery";
import { useProject } from "@/contexts/ProjectContext";

export const useSearchFormState = () => {
  const { activeProject } = useProject();
  const { searchQuery, isLoading, saveSearchQuery } = useSearchQuery(activeProject?.id || '');

  const [jobTitles, setJobTitles] = useState<Tag[]>([]);
  const [industries, setIndustries] = useState<Tag[]>([]);
  const [locations, setLocations] = useState<Tag[]>([]);
  const [experienceRange, setExperienceRange] = useState<[number, number]>([6, 13]);
  const [skills, setSkills] = useState<Tag[]>([]);
  const [languages, setLanguages] = useState<Tag[]>([]);
  const [nationalities, setNationalities] = useState<Tag[]>([]);
  const [companies, setCompanies] = useState<Tag[]>([]);
  const [excludedCompanies, setExcludedCompanies] = useState<Tag[]>([]);
  const [currentEmployer, setCurrentEmployer] = useState<Tag[]>([]);
  const [previousEmployer, setPreviousEmployer] = useState<Tag[]>([]);
  const [educationDegrees, setEducationDegrees] = useState<Tag[]>([]);
  const [educationMajors, setEducationMajors] = useState<Tag[]>([]);
  const [gender, setGender] = useState<string>("both");

  // Update local state when search query data is loaded
  useEffect(() => {
    if (searchQuery) {
      setJobTitles(searchQuery.jobTitles);
      setIndustries(searchQuery.industries);
      setLocations(searchQuery.locations);
      setExperienceRange(searchQuery.experienceRange);
      setSkills(searchQuery.skills);
      setLanguages(searchQuery.languages);
      setNationalities(searchQuery.nationalities);
      setCompanies(searchQuery.companies);
      setExcludedCompanies(searchQuery.excludedCompanies);
      setCurrentEmployer(searchQuery.currentEmployer);
      setPreviousEmployer(searchQuery.previousEmployer);
      setEducationDegrees(searchQuery.educationDegrees);
      setEducationMajors(searchQuery.educationMajors);
      setGender(searchQuery.gender);
    }
  }, [searchQuery]);

  const saveSearchQueryData = useCallback(async () => {
    if (!activeProject?.id) return;

    try {
      await saveSearchQuery.mutateAsync({
        jobTitles,
        industries,
        locations,
        experienceRange,
        skills,
        languages,
        nationalities,
        companies,
        excludedCompanies,
        currentEmployer,
        previousEmployer,
        educationDegrees,
        educationMajors,
        gender,
      });
    } catch (error) {
      console.error('Error saving search query:', error);
    }
  }, [
    activeProject?.id,
    saveSearchQuery,
    jobTitles,
    industries,
    locations,
    experienceRange,
    skills,
    languages,
    nationalities,
    companies,
    excludedCompanies,
    currentEmployer,
    previousEmployer,
    educationDegrees,
    educationMajors,
    gender,
  ]);

  return {
    formState: {
      jobTitles,
      industries,
      locations,
      experienceRange,
      skills,
      languages,
      nationalities,
      companies,
      excludedCompanies,
      currentEmployer,
      previousEmployer,
      educationDegrees,
      educationMajors,
      gender,
    },
    setters: {
      setJobTitles,
      setIndustries,
      setLocations,
      setExperienceRange,
      setSkills,
      setLanguages,
      setNationalities,
      setCompanies,
      setExcludedCompanies,
      setCurrentEmployer,
      setPreviousEmployer,
      setEducationDegrees,
      setEducationMajors,
      setGender,
    },
    saveSearchQueryData,
    isLoading,
  };
};