
import { Check } from "lucide-react";
import { motion } from "framer-motion";

interface NeighborhoodListProps {
  neighborhoods: { id: string; name: string }[];
  selectedNeighborhoods: string[];
  onToggle: (id: string) => void;
}

const NeighborhoodList = ({
  neighborhoods,
  selectedNeighborhoods,
  onToggle,
}: NeighborhoodListProps) => {
  if (neighborhoods.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No neighborhoods found</p>
      </div>
    );
  }

  return (
    <ul className="space-y-1.5">
      {neighborhoods.map((neighborhood) => {
        const isSelected = selectedNeighborhoods.includes(neighborhood.id);
        
        return (
          <motion.li
            key={neighborhood.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            layout
            onClick={() => onToggle(neighborhood.id)}
            className={`relative flex items-center px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group
              ${
                isSelected
                  ? "bg-gradient-to-r from-purple-100/80 to-purple-50/80 dark:from-purple-900/30 dark:to-purple-900/10 text-purple-800 dark:text-purple-300 shadow-sm"
                  : "hover:bg-gray-50 dark:hover:bg-gray-800/60 text-gray-700 dark:text-gray-300"
              }
            `}
          >
            <div className="flex-1">{neighborhood.name}</div>
            <div 
              className={`h-5 w-5 rounded-full flex items-center justify-center transition-all duration-200
                ${
                  isSelected 
                    ? "bg-purple-500 text-white" 
                    : "border-2 border-gray-300 dark:border-gray-600 group-hover:border-purple-300 dark:group-hover:border-purple-500"
                }
              `}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </div>
          </motion.li>
        );
      })}
    </ul>
  );
};

export default NeighborhoodList;
