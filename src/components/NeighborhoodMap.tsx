
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { QuizOption } from "@/utils/quizData";
import { convertCoordsToMapPosition, UserLocation } from "@/utils/mapCoordinates";
import MapBackground from "./map/MapBackground";
import NeighborhoodBubble from "./map/NeighborhoodBubble";
import UserLocationMarker from "./map/UserLocationMarker";
import DistanceRadiusCircle from "./map/DistanceRadiusCircle";
import { useLocationServices } from "./map/useLocationServices";
import { motion } from "framer-motion";

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
  const {
    userLocation,
    setUserLocation,
    isLocating,
    locationEnabled,
    getUserLocation,
    disableLocation
  } = useLocationServices(initialUserLocation);

  useEffect(() => {
    if (initialUserLocation && !userLocation) {
      const {
        mapX,
        mapY
      } = convertCoordsToMapPosition(initialUserLocation.lat, initialUserLocation.lng);
      setUserLocation({
        latitude: initialUserLocation.lat,
        longitude: initialUserLocation.lng,
        mapX,
        mapY
      });
      console.log("Setting initial user location:", {
        lat: initialUserLocation.lat,
        lng: initialUserLocation.lng,
        mapX,
        mapY
      });
    }
  }, [initialUserLocation, userLocation, setUserLocation]);

  return (
    <motion.div 
      className="space-y-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {!initialUserLocation && useUserLocation && !locationEnabled && (
        <div className="flex justify-end mb-2">
          {/* Location button content would go here if needed */}
        </div>
      )}
      
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <MapBackground>
          {/* Distance radius circle - render BEFORE user marker so marker appears on top */}
          {distanceMode && userLocation && distanceRadius && (
            <DistanceRadiusCircle userLocation={userLocation} radiusMiles={distanceRadius} />
          )}
          
          {/* Neighborhood bubbles with staggered animation */}
          {options.map((option, index) => (
            <NeighborhoodBubble 
              key={option.id} 
              option={option} 
              index={index} 
              isSelected={selectedNeighborhoods.includes(option.value)} 
              onSelect={onSelect} 
            />
          ))}
          
          {/* User location marker - rendered LAST to appear on top */}
          {userLocation && <UserLocationMarker userLocation={userLocation} />}
        </MapBackground>
      </div>
    </motion.div>
  );
};

export default NeighborhoodMap;
