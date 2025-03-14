import { useState } from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { QuizOption } from "@/utils/quizData";

// Updated Nashville neighborhoods with better spread positions to prevent overlapping
const neighborhoodPositions: Record<string, { left: string, top: string }> = {
  "downtown": { left: "50%", top: "50%" },
  "germantown": { left: "48%", top: "35%" },
  "gulch": { left: "45%", top: "56%" },
  "music-row": { left: "40%", top: "63%" },
  "north-nashville": { left: "38%", top: "27%" },
  "east": { left: "68%", top: "45%" },
  "west-end": { left: "30%", top: "52%" },
  "belle-meade": { left: "22%", top: "60%" },
  "bellevue": { left: "12%", top: "70%" },
  "bordeaux": { left: "25%", top: "30%" },
  "whites-creek": { left: "38%", top: "10%" },
  "12south": { left: "42%", top: "72%" },
  "berry-hill": { left: "52%", top: "77%" },
  "green-hills": { left: "34%", top: "77%" },
  "franklin": { left: "38%", top: "95%" },
  "brentwood": { left: "50%", top: "88%" },
  "opryland": { left: "76%", top: "27%" },
  "madison": { left: "58%", top: "15%" },
  "crieve-hall": { left: "45%", top: "83%" },
  "woodbine": { left: "58%", top: "63%" }
};

interface NeighborhoodMapProps {
  selectedNeighborhoods: string[];
  onSelect: (neighborhoodId: string) => void;
  options?: QuizOption[];
}

const NeighborhoodMap = ({ 
  selectedNeighborhoods, 
  onSelect,
  options = []
}: NeighborhoodMapProps) => {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  
  // Refined color palette for a more chic look
  const bubbleColors = [
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800", 
    "bg-white/80 text-gray-800"
  ];

  const getBubbleColor = (index: number) => {
    return bubbleColors[index % bubbleColors.length];
  };
  
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <MapPin size={14} className="flex-shrink-0 text-gray-500" />
        <p>Select neighborhoods you're interested in exploring.</p>
      </div>
      
      <div className="relative h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Minimalist map background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          {/* Cumberland River - elegant, simplified */}
          <div className="absolute h-full w-full overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M45,0 Q48,25 52,40 Q55,55 49,75 Q47,85 50,100" 
                fill="none" 
                stroke="#e0f2fe" 
                strokeWidth="4"
                className="dark:stroke-[#1e3a5f] opacity-70"
              />
            </svg>
          </div>
          
          {/* Minimalist grid lines */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #9ca3af 1px, transparent 1px),
                linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          {/* Downtown area highlight - subtle */}
          <div className="absolute w-[12%] h-[12%] rounded-full bg-white dark:bg-gray-700 opacity-20 left-[46%] top-[47%] blur-sm"></div>
        </div>
        
        {/* Neighborhood bubbles */}
        {options.map((option, index) => {
          const position = neighborhoodPositions[option.value];
          if (!position) return null;
          
          const isSelected = selectedNeighborhoods.includes(option.value);
          const isHovered = hoveredBubble === option.value;
          
          return (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 
                      ${getBubbleColor(index)}
                      px-2.5 py-1 rounded-full border backdrop-blur-sm
                      ${isSelected 
                        ? 'border-gray-500 shadow-md' 
                        : 'border-gray-300 dark:border-gray-600'}
                      transition-all duration-200`}
                    style={{
                      left: position.left,
                      top: position.top,
                    }}
                    onClick={() => onSelect(option.value)}
                    onMouseEnter={() => setHoveredBubble(option.value)}
                    onMouseLeave={() => setHoveredBubble(null)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-800 dark:bg-white"></div>
                      )}
                      <span className={`text-xs font-medium whitespace-nowrap ${isSelected ? 'font-semibold' : ''}`}>
                        {option.text.length > 12 ? option.text.substring(0, 10) + "..." : option.text}
                      </span>
                    </div>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700">
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
