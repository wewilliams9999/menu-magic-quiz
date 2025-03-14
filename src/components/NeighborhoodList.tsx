
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
  const bubbleColors = [
    "bg-[#F2FCE2]", "bg-[#FEF7CD]", "bg-[#FEC6A1]", 
    "bg-[#E5DEFF]", "bg-[#FFDEE2]", "bg-[#FDE1D3]", 
    "bg-[#D3E4FD]", "bg-[#F1F0FB]"
  ];

  const getBubbleColor = (index: number) => {
    return bubbleColors[index % bubbleColors.length];
  };

  const displayOptions = searchQuery ? filteredOptions : options;

  return (
    <ScrollArea className="h-[250px] pr-4 rounded-lg">
      <div className="flex flex-wrap gap-3">
        {displayOptions.map((option, index) => (
          <motion.button
            key={option.id}
            onClick={() => onSelectionChange(option.value)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`rounded-full px-4 py-2 flex items-center gap-2 transition-all 
              ${getBubbleColor(index)} dark:text-nashville-900
              ${selectedValues.includes(option.value) 
                ? "ring-2 ring-nashville-accent/50 shadow-md font-medium" 
                : "hover:shadow-md"}`}
          >
            <MapPin size={14} className="text-nashville-accent" />
            {option.text}
          </motion.button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default NeighborhoodList;
