
import { useEffect, useState } from "react";
import { QuizOption } from "@/utils/quizData";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

// Nashville neighborhoods with their relative positions on the static map
const neighborhoodPositions: Record<string, { left: string, top: string }> = {
  "downtown": { left: "50%", top: "50%" },
  "germantown": { left: "48%", top: "45%" },
  "gulch": { left: "47%", top: "53%" },
  "music-row": { left: "45%", top: "55%" },
  "north-nashville": { left: "45%", top: "40%" },
  "east": { left: "58%", top: "48%" },
  "west-end": { left: "42%", top: "52%" },
  "belle-meade": { left: "35%", top: "58%" },
  "bellevue": { left: "25%", top: "65%" },
  "bordeaux": { left: "40%", top: "35%" },
  "whites-creek": { left: "45%", top: "25%" },
  "12south": { left: "48%", top: "60%" },
  "berry-hill": { left: "52%", top: "65%" },
  "green-hills": { left: "42%", top: "65%" },
  "franklin": { left: "48%", top: "85%" },
  "brentwood": { left: "52%", top: "75%" },
  "opryland": { left: "65%", top: "35%" },
  "madison": { left: "55%", top: "30%" }
};

interface NeighborhoodMapProps {
  options: QuizOption[];
  selectedValues: string[];
  onSelectionChange: (value: string) => void;
}

const NeighborhoodMap = ({ 
  options, 
  selectedValues, 
  onSelectionChange 
}: NeighborhoodMapProps) => {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-nashville-600 dark:text-nashville-400 bg-nashville-100/50 dark:bg-nashville-800/50 rounded-lg">
        <Info size={14} className="flex-shrink-0" />
        <p>Click on a neighborhood bubble to select areas of Nashville you're interested in visiting.</p>
      </div>
      
      <div className="relative h-[300px] w-full rounded-lg shadow-md overflow-hidden border border-nashville-200 dark:border-nashville-700">
        {/* Static map background */}
        <div className="absolute inset-0 bg-[#e9eef2] dark:bg-[#2a3035]">
          {/* Simple map styling - river */}
          <div className="absolute w-[15%] h-full left-[45%] top-0 bg-[#b8d0e6] dark:bg-[#3a4c5d] transform -rotate-12"></div>
          
          {/* Map grid lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`col-${i}`} className="border-r border-black dark:border-white h-full"></div>
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={`row-${i}`} className="border-b border-black dark:border-white w-full"></div>
            ))}
          </div>
        </div>
        
        {/* Neighborhood bubbles with labels directly on map */}
        {options.map((option) => {
          const position = neighborhoodPositions[option.value];
          if (!position) return null;
          
          const isSelected = selectedValues.includes(option.value);
          const isHovered = hoveredBubble === option.value;
          
          return (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 rounded-full
                      ${isSelected 
                        ? 'bg-nashville-accent text-white' 
                        : 'bg-white dark:bg-nashville-800 text-nashville-900 dark:text-nashville-100'} 
                      shadow-md transition-all duration-200`}
                    style={{
                      left: position.left,
                      top: position.top,
                      padding: isHovered || isSelected ? '0.75rem' : '0.6rem',
                    }}
                    onClick={() => onSelectionChange(option.value)}
                    onMouseEnter={() => setHoveredBubble(option.value)}
                    onMouseLeave={() => setHoveredBubble(null)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="relative text-xs font-medium">
                      {option.text.length > 10 ? option.text.substring(0, 8) + "..." : option.text}
                    </div>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{option.text}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
};

export default NeighborhoodMap;
