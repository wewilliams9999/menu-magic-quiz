
import { motion } from "framer-motion";
import { MapPin, X } from "lucide-react";
import { QuizOption } from "@/utils/quizData";

interface NeighborhoodSelectionTagsProps {
  selectedValues: string[];
  options: QuizOption[];
  onSelectionChange: (value: string) => void;
  onClearAll: () => void;
}

const NeighborhoodSelectionTags = ({ 
  selectedValues, 
  options, 
  onSelectionChange, 
  onClearAll 
}: NeighborhoodSelectionTagsProps) => {
  if (selectedValues.length === 0) return null;
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {selectedValues.map((value) => {
        const option = options.find(opt => opt.value === value);
        return option ? (
          <motion.div
            key={`selected-${value}`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center px-3 py-1 rounded-full bg-nashville-accent/20 text-sm shadow-sm"
          >
            <MapPin size={14} className="mr-1 text-nashville-accent" />
            <span className="mr-1">{option.text}</span>
            <button
              onClick={() => onSelectionChange(value)}
              className="ml-1 rounded-full p-0.5 hover:bg-nashville-accent/30"
            >
              <X size={14} />
            </button>
          </motion.div>
        ) : null;
      })}
      {selectedValues.length > 0 && (
        <button
          onClick={onClearAll}
          className="inline-flex items-center px-3 py-1 rounded-full bg-nashville-200/50 dark:bg-nashville-700/50 text-sm hover:bg-nashville-200 dark:hover:bg-nashville-700 transition-colors shadow-sm"
        >
          Clear all
        </button>
      )}
    </div>
  );
};

export default NeighborhoodSelectionTags;
