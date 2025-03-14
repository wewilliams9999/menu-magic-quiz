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
  "madison": { left: "60%", top: "20%" },
  "crieve-hall": { left: "52%", top: "78%" },
  "woodbine": { left: "58%", top: "63%" }
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
        {/* Nashville-inspired map background with accurate geographic features */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f6f8fa] to-[#e9eef2] dark:from-[#1a2a3a] dark:to-[#0d1824]">
          {/* Cumberland River */}
          <div className="absolute top-0 h-full w-[10%] left-[48%] bg-[#c2d7e8] dark:bg-[#2a4a70] opacity-80 transform rotate-[15deg]"></div>
          
          {/* I-40 East-West */}
          <div className="absolute top-[50%] h-[3px] w-[90%] left-[5%] bg-[#e0e0e0] dark:bg-[#555555]"></div>
          
          {/* I-65 North-South */}
          <div className="absolute left-[50%] h-[90%] w-[3px] top-[5%] bg-[#e0e0e0] dark:bg-[#555555]"></div>
          
          {/* I-24 */}
          <div className="absolute top-[40%] left-[30%] h-[3px] w-[40%] bg-[#e0e0e0] dark:bg-[#555555] transform rotate-[30deg]"></div>
          
          {/* Secondary roads - grid pattern */}
          <div className="absolute inset-0 grid grid-cols-8 opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`col-${i}`} className="border-r border-[#d0d0d0] dark:border-[#444444] h-full"></div>
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-8 opacity-30">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`row-${i}`} className="border-b border-[#d0d0d0] dark:border-[#444444] w-full"></div>
            ))}
          </div>
          
          {/* Downtown area highlight */}
          <div className="absolute w-[15%] h-[15%] rounded-lg bg-[#fcf8e3] dark:bg-[#45462f] opacity-40 left-[45%] top-[45%]"></div>
          
          {/* Parks and green areas */}
          <div className="absolute w-[18%] h-[12%] rounded-full bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[25%] top-[25%]"></div>
          <div className="absolute w-[15%] h-[10%] rounded-full bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[70%] top-[60%]"></div>
          <div className="absolute w-[10%] h-[8%] rounded-full bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[35%] top-[75%]"></div>
          
          {/* Subtle topography effect */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgzMCkiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+IDxwYXRoIGQ9Ik0tMTAgMTAgSDUwIE0tMTAgMjAgSDUwIE0tMTAgMzAgSDUwIE0tMTAgMCBINTAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMXB4Ij48L3BhdGg+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIj48L3JlY3Q+PC9zdmc+')] opacity-10"></div>
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
