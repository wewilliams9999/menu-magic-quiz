
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
  useUserLocation?: boolean;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  // These values are rough approximations for the map's coordinate system
  // and will be used to position the "You are here" pin
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
  
  // Get user location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Nashville coordinates for reference
        const nashvilleCenter = { lat: 36.1627, lng: -86.7816 };
        
        // Calculate relative position (very rough approximation)
        // In a real app, you'd use proper map projection math
        const latDiff = position.coords.latitude - nashvilleCenter.lat;
        const lngDiff = position.coords.longitude - nashvilleCenter.lng;
        
        // Assuming the map is roughly centered on Nashville
        // and that 0.1 degree is about 20% of the map width/height
        // This is just a rough mapping to place the pin somewhat accurately
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
  
  // Disable location tracking
  const disableLocation = () => {
    setUserLocation(null);
    setLocationEnabled(false);
    toast.info("Location services disabled");
  };
  
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
        
        {/* User location pin */}
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
