import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQueryParams } from '@/hooks/useQueryParams';
import { PeopleSearchQueryParams } from '@/types/PersonSearch';

interface QueryFormProps {
  onSearch: (params: PeopleSearchQueryParams) => void;
  loading?: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSearch, loading }) => {
  const { queryParams, setQueryParams } = useQueryParams();

  const [newJobTitle, setNewJobTitle] = React.useState('');
  const [newSkill, setNewSkill] = React.useState('');
  const [newLocation, setNewLocation] = React.useState('');

  const handleAddToArray = (field: keyof PeopleSearchQueryParams, value: string) => {
    setQueryParams((prev) => {
      const currentValue = prev[field];
      if (Array.isArray(currentValue)) {
        return {
          ...prev,
          [field]: [...currentValue, value],
        };
      }
      return prev;
    });
  };

  const handleRemoveFromArray = (field: keyof PeopleSearchQueryParams, index: number) => {
    setQueryParams((prev) => {
      const currentValue = prev[field];
      if (Array.isArray(currentValue)) {
        const updated = [...currentValue];
        updated.splice(index, 1);
        return {
          ...prev,
          [field]: updated,
        };
      }
      return prev;
    });
  };

  const handleExperienceChange = (
    field: 'min_experience' | 'max_experience',
    value: string
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: Number(value),
    }));
  };

  const handleSearchClick = () => {
    onSearch(queryParams);
  };

  return (
    <div className="space-y-4">
      {/* Job Titles */}
      <div>
        <Label>Job Titles</Label>
        <div className="flex gap-2">
          <Input
            value={newJobTitle}
            onChange={(e) => setNewJobTitle(e.target.value)}
            placeholder="Add job title..."
          />
          <Button onClick={() => {
            handleAddToArray('job_titles', newJobTitle);
            setNewJobTitle('');
          }}>Add</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {queryParams.job_titles.map((title, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleRemoveFromArray('job_titles', index)}
            >
              {title} ×
            </Button>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div>
        <Label>Skills</Label>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill..."
          />
          <Button onClick={() => {
            handleAddToArray('skills', newSkill);
            setNewSkill('');
          }}>Add</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {queryParams.skills.map((skill, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleRemoveFromArray('skills', index)}
            >
              {skill} ×
            </Button>
          ))}
        </div>
      </div>

      {/* Locations */}
      <div>
        <Label>Locations</Label>
        <div className="flex gap-2">
          <Input
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
            placeholder="Add location..."
          />
          <Button onClick={() => {
            handleAddToArray('locations', newLocation);
            setNewLocation('');
          }}>Add</Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {queryParams.locations.map((location, index) => (
            <Button
              key={index}
              variant="outline"
              onClick={() => handleRemoveFromArray('locations', index)}
            >
              {location} ×
            </Button>
          ))}
        </div>
      </div>

      {/* Experience Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Min Experience (years)</Label>
          <Input
            type="number"
            value={queryParams.min_experience}
            onChange={(e) => handleExperienceChange('min_experience', e.target.value)}
          />
        </div>
        <div>
          <Label>Max Experience (years)</Label>
          <Input
            type="number"
            value={queryParams.max_experience}
            onChange={(e) => handleExperienceChange('max_experience', e.target.value)}
          />
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={handleSearchClick}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </Button>
    </div>
  );
};
