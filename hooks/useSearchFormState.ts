import { useState, useCallback, useEffect } from "react";
import type { Tag } from "@/types/common";
import { useSearchQuery, type SearchQueryData } from "@/hooks/useSearchQuery";
import { useProject } from "@/contexts/ProjectContext";
import { v4 as generateUUID } from 'uuid';

export const useSearchFormState = () => {
  const { activeProject, isLoading: isProjectLoading } = useProject();
  const { searchQuery, isLoading: isSearchQueryLoading, saveSearchQuery } = useSearchQuery(activeProject?.id);
  
  const defaultState: SearchQueryData = {
    jobTitles: [],
    industries: [],
    locations: [],
    experienceRange: [6, 13] as [number, number],
    skills: [],
    languages: [],
    nationalities: [],
    companies: [],
    excludedCompanies: [],
    currentEmployer: [],
    previousEmployer: [],
    educationDegrees: [],
    educationMajors: [],
    gender: "both",
  };

  const [formState, setFormState] = useState<SearchQueryData>(defaultState);

  // Reset form state when active project changes
  useEffect(() => {
    if (!activeProject) {
      setFormState(defaultState);
      return;
    }
  }, [activeProject?.id]);

  // Update form state when search query data changes
  useEffect(() => {
    if (searchQuery) {
      setFormState(searchQuery);
    }
  }, [searchQuery]);

  const updateAndSave = useCallback((field: keyof SearchQueryData, value: any) => {
    if (!activeProject) return;

    const newState = { 
      ...formState,
      [field]: Array.isArray(value) && field !== 'experienceRange' 
        ? value.map(item => ({
            id: item.id || generateUUID(),
            label: item.label
          }))
        : value 
    };
    setFormState(newState);
    saveSearchQuery.mutate(newState);
  }, [formState, saveSearchQuery, activeProject]);

  return {
    formState,
    setters: {
      setJobTitles: (value: Tag[]) => updateAndSave('jobTitles', value),
      setIndustries: (value: Tag[]) => updateAndSave('industries', value),
      setLocations: (value: Tag[]) => updateAndSave('locations', value),
      setExperienceRange: (value: [number, number]) => updateAndSave('experienceRange', value),
      setSkills: (value: Tag[]) => updateAndSave('skills', value),
      setLanguages: (value: Tag[]) => updateAndSave('languages', value),
      setNationalities: (value: Tag[]) => updateAndSave('nationalities', value),
      setCompanies: (value: Tag[]) => updateAndSave('companies', value),
      setExcludedCompanies: (value: Tag[]) => updateAndSave('excludedCompanies', value),
      setCurrentEmployer: (value: Tag[]) => updateAndSave('currentEmployer', value),
      setPreviousEmployer: (value: Tag[]) => updateAndSave('previousEmployer', value),
      setEducationDegrees: (value: Tag[]) => updateAndSave('educationDegrees', value),
      setEducationMajors: (value: Tag[]) => updateAndSave('educationMajors', value),
      setGender: (value: string) => updateAndSave('gender', value),
    },
    isLoading: isProjectLoading || isSearchQueryLoading,
  };
};