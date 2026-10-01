import { useEffect, useState } from 'react';
import { Chips } from 'primereact/chips';

export interface TagInputProps {
  /** Seeds the tag list. Re-seeds when the identity of the array changes. */
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  initialTags = [],
  onTagsChange,
  placeholder = 'Add a tag',
  disabled = false,
  id,
  className,
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);

  useEffect(() => {
    setTags(initialTags);
    // Seeding follows the array's identity, matching how the edit forms hand a
    // fresh list in when the record they are editing changes.
  }, [initialTags]);

  const handleChange = (next: string[]) => {
    // Chips allows duplicates by default; the antd version this replaces
    // silently dropped them, and the staff/localization forms depend on that.
    const unique = Array.from(new Set(next));
    setTags(unique);
    onTagsChange?.(unique);
  };

  return (
    <Chips
      inputId={id}
      className={`custome-tag-input${className ? ` ${className}` : ''}`}
      value={tags}
      onChange={(event) => handleChange(event.value ?? [])}
      placeholder={placeholder}
      disabled={disabled}
      // Enter commits; the comma is the template's other accepted terminator.
      separator=","
    />
  );
};

export default TagInput;
