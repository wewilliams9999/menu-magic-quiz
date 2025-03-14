
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { QuizOption } from "@/utils/quizData";

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

  // Group neighborhoods by area
  const neighborhoodGroups = {
    "Central Nashville": ["downtown", "germantown", "gulch", "music-row", "north-nashville"],
    "East Nashville": ["east"],
    "West Nashville": ["west-end", "belle-meade", "bellevue", "bordeaux", "whites-creek"],
    "South Nashville": ["12south", "berry-hill", "green-hills"],
    "Surrounding Areas": ["franklin", "brentwood", "opryland", "madison"]
  };

  const getGroupForNeighborhood = (value: string) => {
    for (const [group, neighborhoods] of Object.entries(neighborhoodGroups)) {
      if (neighborhoods.includes(value)) {
        return group;
      }
    }
    return "Other Areas";
  };
  
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
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
          <Search size={18} />
        </div>
        <Input
          type="text"
          placeholder="Search neighborhoods..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/5 dark:bg-black/5 backdrop-blur-sm border-nashville-200 dark:border-nashville-700"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value);
            return option ? (
              <motion.div
                key={`selected-${value}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex items-center px-3 py-1 rounded-full bg-nashville-accent/20 text-sm"
              >
                <span className="mr-1">{option.text}</span>
                <button
                  onClick={() => handleSelectionChange(value)}
                  className="ml-1 rounded-full p-0.5 hover:bg-nashville-accent/30"
                >
                  <X size={14} />
                </button>
              </motion.div>
            ) : null;
          })}
          <button
            onClick={clearSelections}
            className="inline-flex items-center px-3 py-1 rounded-full bg-nashville-200/50 dark:bg-nashville-700/50 text-sm hover:bg-nashville-200 dark:hover:bg-nashville-700 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}

      <ScrollArea className="h-[400px] pr-4 rounded-lg">
        <div className="space-y-6">
          {/* If filtering, show flat list */}
          {searchQuery ? (
            <div className="grid grid-cols-2 gap-2">
              {filteredOptions.map((option) => (
                <Toggle
                  key={option.id}
                  pressed={selectedValues.includes(option.value)}
                  onPressedChange={() => handleSelectionChange(option.value)}
                  variant="outline"
                  className={`justify-start px-4 py-6 h-auto border border-nashville-200 dark:border-nashville-700 hover:bg-nashville-50 dark:hover:bg-nashville-800 transition-all ${
                    selectedValues.includes(option.value)
                      ? "bg-nashville-accent/10 dark:bg-nashville-accent/20 border-nashville-accent ring-1 ring-nashville-accent/30"
                      : ""
                  }`}
                >
                  {option.text}
                </Toggle>
              ))}
            </div>
          ) : (
            // If not filtering, group by area
            Object.entries(neighborhoodGroups).map(([group, neighborhoods]) => {
              const groupOptions = options.filter(opt => neighborhoods.includes(opt.value));
              if (groupOptions.length === 0) return null;
              
              return (
                <div key={group} className="space-y-2">
                  <h3 className="font-medium text-nashville-800 dark:text-nashville-200">{group}</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {groupOptions.map((option) => (
                      <Toggle
                        key={option.id}
                        pressed={selectedValues.includes(option.value)}
                        onPressedChange={() => handleSelectionChange(option.value)}
                        variant="outline"
                        className={`justify-start px-4 py-6 h-auto border border-nashville-200 dark:border-nashville-700 hover:bg-nashville-50 dark:hover:bg-nashville-800 transition-all ${
                          selectedValues.includes(option.value)
                            ? "bg-nashville-accent/10 dark:bg-nashville-accent/20 border-nashville-accent ring-1 ring-nashville-accent/30"
                            : ""
                        }`}
                      >
                        {option.text}
                      </Toggle>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default NeighborhoodSelector;
