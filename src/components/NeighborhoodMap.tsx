
import { useState, useEffect } from "react";
import { MapPin, Navigation, NavigationOff } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { QuizOption } from "@/utils/quizData";
import { toast } from "sonner";

const neighborhoodPositions: Record<string, {
  left: string;
  top: string;
}> = {
  "downtown": {
    left: "50%",
    top: "45%"
  },
  "germantown": {
    left: "48%",
    top: "35%"
  },
  "gulch": {
    left: "45%",
    top: "50%"
  },
  "music-row": {
    left: "40%",
    top: "55%"
  },
  "north-nashville": {
    left: "35%",
    top: "25%"
  },
  "east": {
    left: "68%",
    top: "40%"
  },
  "west-end": {
    left: "30%",
    top: "50%"
  },
  "belle-meade": {
    left: "20%",
    top: "45%"
  },
  "bellevue": {
    left: "12%",
    top: "65%"
  },
  "bordeaux": {
    left: "25%",
    top: "20%"
  },
  "whites-creek": {
    left: "38%",
    top: "10%"
  },
  "12south": {
    left: "42%",
    top: "63%"
  },
  "berry-hill": {
    left: "50%",
    top: "68%"
  },
  "green-hills": {
    left: "34%",
    top: "68%"
  },
  "franklin": {
    left: "38%",
    top: "85%"
  },
  "brentwood": {
    left: "48%",
    top: "78%"
  },
  "opryland": {
    left: "80%",
    top: "25%"
  },
  "madison": {
    left: "62%",
    top: "15%"
  },
  "crieve-hall": {
    left: "45%",
    top: "73%"
  },
  "woodbine": {
    left: "60%",
    top: "60%"
  }
};

interface NeighborhoodMapProps {
  selectedNeighborhoods: string[];
  onSelect: (neighborhoodId: string) => void;
  options?: QuizOption[];
  useUserLocation?: boolean;
  distanceMode?: boolean;
  distanceRadius?: number;
  initialUserLocation?: {
    lat: number;
    lng: number;
  } | null;
}

interface UserLocation {
  latitude: number;
  longitude: number;
  mapX: string;
  mapY: string;
}

// Nashville's approximate coordinates
const NASHVILLE_CENTER = {
  lat: 36.1627,
  lng: -86.7816
};

const NeighborhoodMap = ({
  selectedNeighborhoods,
  onSelect,
  options = [],
  useUserLocation = false,
  distanceMode = false,
  distanceRadius = 100,
  initialUserLocation = null
}: NeighborhoodMapProps) => {
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const convertCoordsToMapPosition = (lat: number, lng: number): { mapX: string, mapY: string } => {
    // Significantly improved scaling factors for more accurate positioning
    // Nashville is approximately at these bounds
    const nashvilleBounds = {
      north: 36.4,    // Northern boundary
      south: 35.9,    // Southern boundary
      east: -86.5,    // Eastern boundary
      west: -87.1     // Western boundary
    };
    
    // Calculate position as percentage within Nashville bounds
    const latRange = nashvilleBounds.north - nashvilleBounds.south;
    const lngRange = nashvilleBounds.east - nashvilleBounds.west;
    
    const latPercent = ((lat - nashvilleBounds.south) / latRange) * 100;
    const lngPercent = ((lng - nashvilleBounds.west) / lngRange) * 100;
    
    // Invert Y axis since map coordinates go from top to bottom
    const mapY = `${100 - latPercent}%`;
    const mapX = `${lngPercent}%`;
    
    console.log("Converting coordinates:", { lat, lng, mapX, mapY });
    
    return { mapX, mapY };
  };

  useEffect(() => {
    if (initialUserLocation && !userLocation) {
      const { mapX, mapY } = convertCoordsToMapPosition(
        initialUserLocation.lat, 
        initialUserLocation.lng
      );
      
      setUserLocation({
        latitude: initialUserLocation.lat,
        longitude: initialUserLocation.lng,
        mapX,
        mapY
      });
      setLocationEnabled(true);
      
      console.log("Setting initial user location:", {
        lat: initialUserLocation.lat,
        lng: initialUserLocation.lng,
        mapX,
        mapY
      });
    }
  }, [initialUserLocation]);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(position => {
      const { mapX, mapY } = convertCoordsToMapPosition(
        position.coords.latitude,
        position.coords.longitude
      );
      
      setUserLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        mapX,
        mapY
      });
      
      setLocationEnabled(true);
      setIsLocating(false);
      toast.success("Your location has been found");
      
      console.log("User location:", {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        mapX,
        mapY
      });
      
    }, error => {
      setIsLocating(false);
      toast.error(`Unable to retrieve your location: ${error.message}`);
    });
  };

  const disableLocation = () => {
    setUserLocation(null);
    setLocationEnabled(false);
    toast.info("Location services disabled");
  };

  const bubbleColors = ["bg-white/90 text-gray-800", "bg-white/90 text-gray-800", "bg-white/90 text-gray-800", "bg-white/90 text-gray-800", "bg-white/90 text-gray-800", "bg-white/90 text-gray-800", "bg-white/90 text-gray-800", "bg-white/90 text-gray-800"];
  
  const getBubbleColor = (index: number) => {
    return bubbleColors[index % bubbleColors.length];
  };

  return <div className="space-y-2">
      {!initialUserLocation}
      
      <div className="relative h-[600px] w-full rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
          <div className="absolute h-full w-full overflow-hidden">
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M18,0 Q22,5 25,10 Q30,20 35,25 Q38,28 40,35 Q42,40 45,42 Q47,45 50,50 Q53,55 58,58 Q63,62 65,70 Q67,78 70,85 Q72,92 75,100" fill="none" stroke="#0EA5E9" strokeWidth="3" className="dark:stroke-[#33C3F0] opacity-70" />
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
        return <TooltipProvider key={option.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className={`absolute z-10 transform -translate-x-1/2 -translate-y-1/2 
                      ${getBubbleColor(index)}
                      px-2.5 py-1 rounded-full border backdrop-blur-sm
                      ${isSelected ? 'border-nashville-accent shadow-md' : 'border-gray-300 dark:border-gray-600'}
                      transition-colors duration-200`} style={{
                left: position.left,
                top: position.top
              }} onClick={() => onSelect(option.value)} onMouseEnter={() => setHoveredBubble(option.value)} onMouseLeave={() => setHoveredBubble(null)}>
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
            </TooltipProvider>;
      })}
        
        {userLocation && <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2" style={{
        left: userLocation.mapX,
        top: userLocation.mapY
      }}>
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
          </motion.div>}
      </div>
    </div>;
};

export default NeighborhoodMap;
