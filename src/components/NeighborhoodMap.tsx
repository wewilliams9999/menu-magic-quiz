
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
        {/* Nashville-inspired map background with more organic, visual design */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f9f7f2] to-[#e8edf0] dark:from-[#1e2a38] dark:to-[#162232]">
          {/* Cumberland River - more natural, curved shape */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path 
              d="M45,0 Q48,25 52,40 Q55,55 49,75 Q47,85 50,100" 
              fill="none" 
              stroke="#a3ceed" 
              strokeWidth="6"
              className="dark:stroke-[#2a4a70] opacity-80"
            />
          </svg>
          
          {/* Main highways with more natural curves */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* I-40 */}
            <path 
              d="M5,50 Q25,48 50,50 Q75,52 95,50" 
              fill="none" 
              stroke="#e0e0e0" 
              strokeWidth="1.5"
              className="dark:stroke-[#555555]"
            />
            
            {/* I-65 */}
            <path 
              d="M50,5 Q48,25 50,50 Q52,75 50,95" 
              fill="none" 
              stroke="#e0e0e0" 
              strokeWidth="1.5"
              className="dark:stroke-[#555555]"
            />
            
            {/* I-24 */}
            <path 
              d="M30,30 Q40,40 50,45 Q65,53 75,65" 
              fill="none" 
              stroke="#e0e0e0" 
              strokeWidth="1.5"
              className="dark:stroke-[#555555]"
            />
            
            {/* Secondary roads - more organic */}
            <path d="M20,35 Q30,40 40,35 Q50,30 65,35" fill="none" stroke="#e0e0e0" strokeWidth="0.75" className="dark:stroke-[#444444] opacity-30" />
            <path d="M35,60 Q45,65 55,60 Q65,55 75,60" fill="none" stroke="#e0e0e0" strokeWidth="0.75" className="dark:stroke-[#444444] opacity-30" />
            <path d="M40,20 Q45,30 50,25 Q55,20 60,30" fill="none" stroke="#e0e0e0" strokeWidth="0.75" className="dark:stroke-[#444444] opacity-30" />
            <path d="M25,70 Q35,75 45,70 Q55,65 65,70" fill="none" stroke="#e0e0e0" strokeWidth="0.75" className="dark:stroke-[#444444] opacity-30" />
          </svg>
          
          {/* Downtown area highlight - warmer, more organic */}
          <div className="absolute w-[12%] h-[12%] rounded-lg bg-[#fcf8e3] dark:bg-[#45462f] opacity-40 left-[46%] top-[47%]"></div>
          <div className="absolute w-[8%] h-[8%] rounded-lg bg-[#fcf8e3] dark:bg-[#45462f] opacity-30 left-[49%] top-[45%]"></div>
          
          {/* Parks and green areas - more organic shapes */}
          <div className="absolute w-[15%] h-[11%] rounded-[40%_60%_60%_40%/40%_50%_50%_60%] bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[25%] top-[25%]"></div>
          <div className="absolute w-[12%] h-[9%] rounded-[60%_40%_40%_60%/50%_50%_50%_50%] bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[70%] top-[60%]"></div>
          <div className="absolute w-[10%] h-[8%] rounded-[40%_60%_30%_70%/30%_30%_70%_70%] bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[35%] top-[75%]"></div>
          <div className="absolute w-[14%] h-[10%] rounded-[70%_30%_50%_50%/50%_50%_50%_50%] bg-[#e8f5e9] dark:bg-[#2c4c2e] opacity-30 left-[60%] top-[25%]"></div>
          
          {/* Percy Priest Lake */}
          <div className="absolute w-[18%] h-[20%] rounded-[60%_40%_50%_50%/40%_60%_60%_40%] bg-[#b8d9eb] dark:bg-[#2a4c6a] opacity-30 left-[75%] top-[35%]"></div>
          
          {/* Land contours/elevation indicators */}
          <div className="absolute w-[25%] h-[15%] rounded-full bg-[#f0e9de] dark:bg-[#3c362e] opacity-20 left-[20%] top-[45%]"></div>
          <div className="absolute w-[20%] h-[15%] rounded-full bg-[#f0e9de] dark:bg-[#3c362e] opacity-20 left-[65%] top-[70%]"></div>
          
          {/* Light texture overlay */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10" style={{ 
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiM4ODgiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPgo8L3N2Zz4=')",
            backgroundRepeat: 'repeat'
          }}></div>
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
