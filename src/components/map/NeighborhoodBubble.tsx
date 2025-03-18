
import { useState } from "react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { QuizOption } from "@/utils/quizData";
import { neighborhoodPositions } from "@/utils/mapCoordinates";

interface NeighborhoodBubbleProps {
  option: QuizOption;
  index: number;
  isSelected: boolean;
  onSelect: (value: string) => void;
}

const NeighborhoodBubble = ({ 
  option, 
  index, 
  isSelected, 
  onSelect 
}: NeighborhoodBubbleProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const position = neighborhoodPositions[option.value];
  
  if (!position) return null;
  
  // Array of background colors for the bubbles
  const bubbleColors = [
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800", 
    "bg-white/90 text-gray-800"
  ];
  
  const getBubbleColor = (index: number) => {
    return bubbleColors[index % bubbleColors.length];
  };
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 
              ${getBubbleColor(index)}
              px-2.5 py-1 rounded-full border backdrop-blur-sm
              ${isSelected ? 'border-nashville-accent shadow-md' : 'border-gray-300 dark:border-gray-600'}
              transition-colors duration-200`} 
            style={{
              left: position.left,
              top: position.top
            }} 
            onClick={() => onSelect(option.value)} 
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center gap-1.5">
              {isSelected && <div className="w-2 h-2 rounded-full bg-nashville-accent"></div>}
              <span className={`text-xs font-medium whitespace-nowrap ${isSelected ? 'font-semibold' : ''}`}>
                {option.text}
              </span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700">
          <p>{option.text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default NeighborhoodBubble;
