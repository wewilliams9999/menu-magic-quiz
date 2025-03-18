
import { useState, useEffect } from "react";
import { MapPin, Navigation, NavigationOff } from "lucide-react";
import { motion } from "framer-motion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { QuizOption } from "@/utils/quizData";
import { toast } from "sonner";

const neighborhoodPositions: Record<string, { left: string, top: string }> = {
  "downtown": { left: "50%", top: "50%" },
  "germantown": { left: "48%", top: "35%" },
  "gulch": { left: "45%", top: "55%" },
  "music-row": { left: "40%", top: "63%" },
  "north-nashville": { left: "35%", top: "25%" },
  "east": { left: "68%", top: "40%" },
  "west-end": { left: "30%", top: "52%" },
  "belle-meade": { left: "20%", top: "48%" },
  "bellevue": { left: "12%", top: "70%" },
  "bordeaux": { left: "25%", top: "20%" },
  "whites-creek": { left: "38%", top: "8%" },
  "12south": { left: "42%", top: "72%" },
  "berry-hill": { left: "52%", top: "77%" },
  "green-hills": { left: "34%", top: "78%" },
  "franklin": { left: "38%", top: "95%" }, // Moved within visible area
  "brentwood": { left: "50%", top: "85%" }, // Moved up to be more visible
  "opryland": { left: "80%", top: "25%" },
  "madison": { left: "62%", top: "15%" },
  "crieve-hall": { left: "45%", top: "85%" },
  "woodbine": { left: "60%", top: "65%" }
};

interface NeighborhoodMapProps {
  selectedNeighborhoods: string[];
  onSelect: (neighborhoodId: string) => void;
  options?: QuizOption[];
  useUserLocation?: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  mapX: string;
  mapY: string;
}

const NeighborhoodMap = ({ 
  selectedNeighborhoods, 
  onSelect,
  options = [],
  useUserLocation = false
}: NeighborhoodMapProps) => {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nashvilleCenter = { lat: 36.1627, lng: -86.7816 };
        
        const latDiff = position.coords.latitude - nashvilleCenter.lat;
        const lngDiff = position.coords.longitude - nashvilleCenter.lng;
        
        const mapX = `${50 + (lngDiff * 200)}%`;
        const mapY = `${50 - (latDiff * 200)}%`;
        
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          mapX,
          mapY
        });
        
        setLocationEnabled(true);
        setIsLocating(false);
        toast.success("Your location has been found");
      },
      (error) => {
        setIsLocating(false);
        toast.error(`Unable to retrieve your location: ${error.message}`);
      }
    );
  };
  
  const disableLocation = () => {
    setUserLocation(null);
    setLocationEnabled(false);
    toast.info("Location services disabled");
  };
  
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
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <MapPin size={14} className="flex-shrink-0 text-gray-500" />
          <p>Select neighborhoods you're interested in exploring.</p>
        </div>
        
        {useUserLocation && (
          <div>
            {locationEnabled ? (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={disableLocation}
                className="h-8 px-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <NavigationOff size={14} className="mr-1" />
                <span className="text-xs">Hide Location</span>
              </Button>
            ) : (
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={getUserLocation}
                disabled={isLocating}
                className="h-8 px-2 text-nashville-accent hover:bg-nashville-accent/10"
              >
                <Navigation size={14} className="mr-1" />
                <span className="text-xs">{isLocating ? "Locating..." : "Show My Location"}</span>
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="relative h-[500px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="absolute h-full w-full overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path 
                d="M45,0 Q48,25 52,40 Q55,55 49,75 Q47,85 50,100" 
                fill="none" 
                stroke="#e0f2fe" 
                strokeWidth="3"
                className="dark:stroke-[#1e3a5f] opacity-70"
              />
            </svg>
          </div>
          
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #9ca3af 1px, transparent 1px),
                linear-gradient(to bottom, #9ca3af 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>
          
          <div className="absolute w-[12%] h-[12%] rounded-full bg-white dark:bg-gray-700 opacity-20 left-[46%] top-[47%] blur-sm"></div>
        </div>
        
        {options.map((option, index) => {
          const position = neighborhoodPositions[option.value];
          if (!position) return null;
          
          const isSelected = selectedNeighborhoods.includes(option.value);
          
          return (
            <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 
                      ${getBubbleColor(index)}
                      px-2.5 py-1 rounded-full border backdrop-blur-sm
                      ${isSelected 
                        ? 'border-nashville-accent shadow-md' 
                        : 'border-gray-300 dark:border-gray-600'}
                      transition-colors duration-200`}
                    style={{
                      left: position.left,
                      top: position.top,
                    }}
                    onClick={() => onSelect(option.value)}
                    onMouseEnter={() => setHoveredBubble(option.value)}
                    onMouseLeave={() => setHoveredBubble(null)}
                  >
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-nashville-accent"></div>
                      )}
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
        })}
        
        {userLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: userLocation.mapX,
              top: userLocation.mapY,
            }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-nashville-accent/30 animate-pulse"></div>
                    <div className="relative bg-nashville-accent text-white p-1.5 rounded-full shadow-lg">
                      <Navigation size={14} />
                    </div>
                    <div className="absolute h-20 w-1 bg-nashville-accent/20 -bottom-20 left-1/2 transform -translate-x-1/2 z-[-1]"></div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-sm font-medium">You are here</p>
                  <p className="text-xs text-gray-500">
                    {userLocation.latitude.toFixed(4)}, {userLocation.longitude.toFixed(4)}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NeighborhoodMap;
