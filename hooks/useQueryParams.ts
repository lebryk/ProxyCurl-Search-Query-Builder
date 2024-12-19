import { useState } from 'react';
import { PeopleSearchQueryParams } from '@/types/PersonSearch';

export const useQueryParams = (initialParams?: Partial<PeopleSearchQueryParams>) => {
  const [queryParams, setQueryParams] = useState<PeopleSearchQueryParams>({
    ...initialParams
  });

  // Form state for array fields
  const [newFieldOfStudy, setNewFieldOfStudy] = useState('');
  const [newDegree, setNewDegree] = useState('');
  const [newSchool, setNewSchool] = useState('');

  const handleAddToArray = (
    field: keyof Pick<PeopleSearchQueryParams, 'education_field_of_study' | 'education_degree_name' | 'education_school_name'>, 
    value: string
  ) => {
    if (!value.trim()) return;
    setQueryParams(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field]) 
        ? [...(prev[field] as string[]), value]
        : [value]
    }));
  };

  const handleRemoveFromArray = (
    field: keyof Pick<PeopleSearchQueryParams, 'education_field_of_study' | 'education_degree_name' | 'education_school_name'>, 
    index: number
  ) => {
    setQueryParams(prev => ({
      ...prev,
      [field]: Array.isArray(prev[field])
        ? (prev[field] as string[]).filter((_, i) => i !== index)
        : prev[field]
    }));
  };

  return {
    queryParams,
    setQueryParams,
    // Field of Study
    newFieldOfStudy,
    setNewFieldOfStudy,
    handleAddFieldOfStudy: () => handleAddToArray('education_field_of_study', newFieldOfStudy),
    handleRemoveFieldOfStudy: (index: number) => handleRemoveFromArray('education_field_of_study', index),
    // Degree
    newDegree,
    setNewDegree,
    handleAddDegree: () => handleAddToArray('education_degree_name', newDegree),
    handleRemoveDegree: (index: number) => handleRemoveFromArray('education_degree_name', index),
    // School
    newSchool,
    setNewSchool,
    handleAddSchool: () => handleAddToArray('education_school_name', newSchool),
    handleRemoveSchool: (index: number) => handleRemoveFromArray('education_school_name', index),
  };
};
