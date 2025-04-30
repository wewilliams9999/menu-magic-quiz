
import { useState } from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { QuizOption } from "@/utils/quizData";
import { neighborhoodPositions } from "@/utils/mapCoordinates";
import { motion } from "framer-motion";

interface NeighborhoodBubbleProps {
  option: QuizOption;
  index: number;
  isSelected: boolean;
  onSelect: (value: string) => void;
  isMobile?: boolean;
}

const NeighborhoodBubble = ({ 
  option, 
  index, 
  isSelected, 
  onSelect,
  isMobile = false
}: NeighborhoodBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const position = neighborhoodPositions[option.value];
  
  if (!position) return null;
  
  // Array of gradient backgrounds for the bubbles to create visual variety
  const bubbleGradients = [
    "bg-gradient-to-r from-red-500/80 to-orange-400/80 text-white", 
    "bg-gradient-to-r from-orange-500/80 to-amber-400/80 text-white", 
    "bg-gradient-to-r from-amber-500/80 to-yellow-400/80 text-gray-800",
    "bg-gradient-to-r from-yellow-500/80 to-lime-400/80 text-gray-800",
    "bg-gradient-to-r from-lime-500/80 to-green-400/80 text-white",
    "bg-gradient-to-r from-green-500/80 to-emerald-400/80 text-white",
    "bg-gradient-to-r from-emerald-500/80 to-teal-400/80 text-white",
    "bg-gradient-to-r from-teal-500/80 to-cyan-400/80 text-white"
  ];
  
  const getBubbleGradient = (index: number) => {
    return bubbleGradients[index % bubbleGradients.length];
  };

  // Use mobile positions when on mobile to reduce clumping
  const bubblePosition = {
    left: position.left,
    top: position.top,
    mobileLeft: position.mobileLeft || position.left,
    mobileTop: position.mobileTop || position.top
  };

  // Dynamic sizing based on device
  const bubbleSize = isMobile ? 
    (isSelected ? "scale-100" : "scale-90") : 
    (isSelected ? "scale-105" : "scale-100");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.button 
            className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 
              ${isSelected ? getBubbleGradient(index) : 'bg-white/90 backdrop-blur-sm text-gray-800'}
              px-2 py-1 md:px-3 md:py-1.5 rounded-full 
              ${isSelected ? 'shadow-md ring-2 ring-white/30' : 'border border-gray-200 shadow-sm hover:shadow'}
              transition-all duration-300 ease-in-out`} 
            style={{
              left: isMobile ? bubblePosition.mobileLeft : bubblePosition.left,
              top: isMobile ? bubblePosition.mobileTop : bubblePosition.top,
              fontSize: isMobile ? '10px' : 'inherit',
              minWidth: isMobile ? '60px' : 'auto'
            }} 
            onClick={() => onSelect(option.value)} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ 
              scale: isSelected ? 1.05 : 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: isSelected ? 1.05 : 1,
              boxShadow: isSelected ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.05)'
            }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 17,
              delay: index * 0.03
            }}
          >
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {isSelected && (
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-white"
                ></motion.div>
              )}
              <span className={`text-[10px] md:text-xs font-medium whitespace-nowrap ${isSelected ? 'font-bold' : ''}`}>
                {option.text}
              </span>
            </motion.div>
          </motion.button>
        </TooltipTrigger>
        <TooltipContent 
          side="top"
          className="bg-black/80 text-white backdrop-blur-md border-gray-800 shadow-xl"
        >
          <p className="font-medium">{option.text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NeighborhoodBubble;
