import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useQueryParams } from '@/hooks/useQueryParams';
import { QueryParams } from '@/types/QueryTypes';

interface QueryFormProps {
  onSearch: (params: QueryParams) => void;
  loading?: boolean;
}

export const QueryForm: React.FC<QueryFormProps> = ({ onSearch, loading }) => {
  const {
    queryParams,
    newJobTitle,
    setNewJobTitle,
    newSkill,
    setNewSkill,
    newLocation,
    setNewLocation,
    handleAddToArray,
    handleRemoveFromArray,
    handleExperienceChange
  } = useQueryParams();

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
