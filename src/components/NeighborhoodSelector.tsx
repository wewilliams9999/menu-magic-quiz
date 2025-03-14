
import { useState, useEffect } from "react";
import { QuizOption } from "@/utils/quizData";
import NeighborhoodSearch from "./NeighborhoodSearch";
import NeighborhoodSelectionTags from "./NeighborhoodSelectionTags";
import NeighborhoodMap from "./NeighborhoodMap";

interface NeighborhoodSelectorProps {
  options: QuizOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
}

const NeighborhoodSelector = ({
  options,
  selectedValues,
  onChange,
}: NeighborhoodSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  
  // Filter options based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredOptions(options);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredOptions(
        options.filter(option => 
          option.text.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, options]);
  
  // Handle selection changes
  const handleSelectionChange = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value];
    onChange(newValues);
  };

  const clearSelections = () => {
    onChange([]);
  };

  return (
    <div className="space-y-4">
      <NeighborhoodSearch 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      <NeighborhoodSelectionTags 
        selectedValues={selectedValues} 
        options={options} 
        onSelectionChange={handleSelectionChange}
        onClearAll={clearSelections}
      />

      <NeighborhoodMap 
        options={filteredOptions.length > 0 || !searchQuery ? filteredOptions : options}
        selectedValues={selectedValues}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};

export default NeighborhoodSelector;
