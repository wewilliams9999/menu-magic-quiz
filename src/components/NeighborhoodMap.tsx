
import { useState } from "react";
import { QuizOption } from "@/utils/quizData";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";

// Updated Nashville neighborhoods with better spread positions
const neighborhoodPositions: Record<string, { left: string, top: string }> = {
  "downtown": { left: "50%", top: "50%" },
  "germantown": { left: "48%", top: "38%" },
  "gulch": { left: "45%", top: "53%" },
  "music-row": { left: "40%", top: "58%" },
  "north-nashville": { left: "38%", top: "32%" },
  "east": { left: "65%", top: "45%" },
  "west-end": { left: "35%", top: "52%" },
  "belle-meade": { left: "28%", top: "60%" },
  "bellevue": { left: "18%", top: "70%" },
  "bordeaux": { left: "30%", top: "25%" },
  "whites-creek": { left: "42%", top: "15%" },
  "12south": { left: "48%", top: "68%" },
  "berry-hill": { left: "55%", top: "72%" },
  "green-hills": { left: "38%", top: "72%" },
  "franklin": { left: "48%", top: "90%" },
  "brentwood": { left: "60%", top: "82%" },
  "opryland": { left: "72%", top: "32%" },
  "madison": { left: "60%", top: "20%" }
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
  
  // Enhanced color palette for a more chic look
  const bubbleColors = [
    "bg-[#F2FCE2] text-emerald-900", 
    "bg-[#FEF7CD] text-amber-900", 
    "bg-[#FEC6A1] text-orange-900", 
    "bg-[#E5DEFF] text-indigo-900", 
    "bg-[#FFDEE2] text-rose-900", 
    "bg-[#FDE1D3] text-orange-900", 
    "bg-[#D3E4FD] text-blue-900", 
    "bg-[#F1F0FB] text-violet-900"
  ];

  const getBubbleColor = (index: number) => {
    return bubbleColors[index % bubbleColors.length];
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-nashville-600 dark:text-nashville-400 bg-nashville-100/50 dark:bg-nashville-800/50 rounded-lg">
        <MapPin size={14} className="flex-shrink-0 text-nashville-accent" />
        <p>Click on a neighborhood bubble to select areas of Nashville you're interested in visiting.</p>
      </div>
      
      <div className="relative h-[500px] w-full rounded-xl shadow-lg overflow-hidden border border-nashville-200 dark:border-nashville-700">
        {/* Stylized map background with gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] dark:from-[#263238] dark:to-[#102027]">
          {/* River styling */}
          <div className="absolute h-full w-[12%] left-[48%] top-0 bg-gradient-to-b from-[#bbdefb] to-[#90caf9] dark:from-[#0d47a1] dark:to-[#1976d2] transform -rotate-12 opacity-80"></div>
          
          {/* Interstate highways */}
          <div className="absolute h-[2px] w-[80%] left-[10%] top-[50%] bg-[#eceff1] dark:bg-[#cfd8dc] opacity-60"></div>
          <div className="absolute h-[80%] w-[2px] left-[50%] top-[10%] bg-[#eceff1] dark:bg-[#cfd8dc] opacity-60"></div>
          
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 opacity-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`col-${i}`} className="border-r border-black dark:border-white h-full"></div>
            ))}
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={`row-${i}`} className="border-b border-black dark:border-white w-full"></div>
            ))}
          </div>
          
          {/* City center subtle glow */}
          <div className="absolute w-[20%] h-[20%] rounded-full bg-white dark:bg-nashville-accent/20 blur-xl opacity-30 left-[45%] top-[45%]"></div>
        </div>
        
        {/* Neighborhood bubbles */}
        {options.map((option, index) => {
          const position = neighborhoodPositions[option.value];
          if (!position) return null;
          
          const isSelected = selectedValues.includes(option.value);
          const isHovered = hoveredBubble === option.value;
          
          return (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 rounded-full px-3 py-1.5
                      ${getBubbleColor(index)}
                      ${isSelected 
                        ? 'ring-2 ring-nashville-accent shadow-md font-medium scale-110' 
                        : 'hover:shadow-md'} 
                      transition-all duration-200`}
                    style={{
                      left: position.left,
                      top: position.top,
                    }}
                    onClick={() => onSelectionChange(option.value)}
                    onMouseEnter={() => setHoveredBubble(option.value)}
                    onMouseLeave={() => setHoveredBubble(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-nashville-accent flex-shrink-0" />
                      <span className="text-sm font-medium whitespace-nowrap">
                        {option.text.length > 12 ? option.text.substring(0, 10) + "..." : option.text}
                      </span>
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
