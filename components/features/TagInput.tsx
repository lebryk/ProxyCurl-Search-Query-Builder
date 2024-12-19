import { useState, KeyboardEvent, FormEvent, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface Tag {
  id: string;
  label: string;
}

interface TagInputProps {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  suggestions?: Tag[];
  onSubmit?: (e: FormEvent) => void;
}

export const TagInput = ({ 
  tags, 
  onTagsChange, 
  placeholder = "Type and press Enter", 
  icon,
  suggestions = [],
  onSubmit
}: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.label.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [suggestions]);

  const addTag = useCallback((tagLabel: string) => {
    const trimmedLabel = tagLabel.trim();
    if (trimmedLabel && !tags.find(tag => tag.label.toLowerCase() === trimmedLabel.toLowerCase())) {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        label: trimmedLabel
      };
      const newTags = [...tags, newTag];
      onTagsChange(newTags);
      setInputValue('');
      setShowSuggestions(false);
    }
  }, [tags, onTagsChange]);

  const removeTag = useCallback((tagId: string) => {
    const newTags = tags.filter(tag => tag.id !== tagId);
    onTagsChange(newTags);
  }, [tags, onTagsChange]);

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (onSubmit) {
        onSubmit(e as any);
      }
      if (inputValue.trim()) {
        addTag(inputValue);
      }
    }
  }, [inputValue, addTag, onSubmit]);

  const handleSuggestionClick = useCallback((suggestion: Tag) => {
    addTag(suggestion.label);
  }, [addTag]);

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={icon ? "pr-10" : ""}
        />
        {icon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {icon}
          </div>
        )}
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-md">
            {filteredSuggestions.map(suggestion => (
              <button
                key={suggestion.id}
                className="w-full px-4 py-2 text-left hover:bg-muted text-sm"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
          >
            <span className="text-primary text-xs">✦</span>
            {tag.label}
            <button 
              onClick={() => removeTag(tag.id)}
              className="hover:text-primary"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};