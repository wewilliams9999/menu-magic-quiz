
import { MapPin } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizOption } from "@/utils/quizData";

interface NeighborhoodListProps {
  options: QuizOption[];
  filteredOptions: QuizOption[];
  selectedValues: string[];
  onSelectionChange: (value: string) => void;
  searchQuery: string;
}

const NeighborhoodList = ({
  options,
  filteredOptions,
  selectedValues,
  onSelectionChange,
  searchQuery
}: NeighborhoodListProps) => {
  // Group neighborhoods by area
  const neighborhoodGroups = {
    "Central Nashville": ["downtown", "germantown", "gulch", "music-row", "north-nashville"],
    "East Nashville": ["east"],
    "West Nashville": ["west-end", "belle-meade", "bellevue", "bordeaux", "whites-creek"],
    "South Nashville": ["12south", "berry-hill", "green-hills"],
    "Surrounding Areas": ["franklin", "brentwood", "opryland", "madison"]
  };

  return (
    <ScrollArea className="h-[250px] pr-4 rounded-lg">
      <div className="space-y-6">
        {/* If filtering, show flat list */}
        {searchQuery ? (
          <div className="grid grid-cols-2 gap-2">
            {filteredOptions.map((option) => (
              <Toggle
                key={option.id}
                pressed={selectedValues.includes(option.value)}
                onPressedChange={() => onSelectionChange(option.value)}
                variant="outline"
                className={`justify-start px-4 py-3 h-auto border border-nashville-200 dark:border-nashville-700 hover:bg-nashville-50 dark:hover:bg-nashville-800 transition-all ${
                  selectedValues.includes(option.value)
                    ? "bg-nashville-accent/10 dark:bg-nashville-accent/20 border-nashville-accent ring-1 ring-nashville-accent/30"
                    : ""
                }`}
              >
                <MapPin size={14} className="mr-2 text-nashville-accent" />
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
                      onPressedChange={() => onSelectionChange(option.value)}
                      variant="outline"
                      className={`justify-start px-4 py-3 h-auto border border-nashville-200 dark:border-nashville-700 hover:bg-nashville-50 dark:hover:bg-nashville-800 transition-all ${
                        selectedValues.includes(option.value)
                          ? "bg-nashville-accent/10 dark:bg-nashville-accent/20 border-nashville-accent ring-1 ring-nashville-accent/30"
                          : ""
                      }`}
                    >
                      <MapPin size={14} className="mr-2 text-nashville-accent" />
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
  );
};

export default NeighborhoodList;
