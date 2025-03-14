
import { MapPin } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { QuizOption } from "@/utils/quizData";
import { motion } from "framer-motion";

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

  const bubbleColors = [
    "bg-[#F2FCE2]", "bg-[#FEF7CD]", "bg-[#FEC6A1]", 
    "bg-[#E5DEFF]", "bg-[#FFDEE2]", "bg-[#FDE1D3]", 
    "bg-[#D3E4FD]", "bg-[#F1F0FB]"
  ];

  const getBubbleColor = (index: number) => {
    return bubbleColors[index % bubbleColors.length];
  };

  return (
    <ScrollArea className="h-[250px] pr-4 rounded-lg">
      <div className="space-y-6">
        {/* If filtering, show flat list */}
        {searchQuery ? (
          <div className="flex flex-wrap gap-3">
            {filteredOptions.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => onSelectionChange(option.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`rounded-full px-4 py-2 flex items-center gap-2 transition-all 
                  ${getBubbleColor(index)} dark:text-nashville-900
                  ${selectedValues.includes(option.value) 
                    ? "ring-2 ring-nashville-accent/50 shadow-md" 
                    : "hover:shadow-md"}`}
              >
                <MapPin size={14} className="text-nashville-accent" />
                {option.text}
              </motion.button>
            ))}
          </div>
        ) : (
          // If not filtering, group by area
          Object.entries(neighborhoodGroups).map(([group, neighborhoods], groupIndex) => {
            const groupOptions = options.filter(opt => neighborhoods.includes(opt.value));
            if (groupOptions.length === 0) return null;
            
            return (
              <div key={group} className="space-y-3">
                <h3 className="font-medium text-nashville-800 dark:text-nashville-200">{group}</h3>
                <div className="flex flex-wrap gap-3">
                  {groupOptions.map((option, index) => (
                    <motion.button
                      key={option.id}
                      onClick={() => onSelectionChange(option.value)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`rounded-full px-4 py-2 flex items-center gap-2 transition-all 
                        ${getBubbleColor(index + groupIndex * 3)} dark:text-nashville-900
                        ${selectedValues.includes(option.value) 
                          ? "ring-2 ring-nashville-accent/50 shadow-md font-medium" 
                          : "hover:shadow-md"}`}
                    >
                      <MapPin size={14} className="text-nashville-accent" />
                      {option.text}
                    </motion.button>
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
