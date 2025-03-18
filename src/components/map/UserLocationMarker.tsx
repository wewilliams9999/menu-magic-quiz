
import { motion } from "framer-motion";
import { Navigation } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserLocation } from "@/utils/mapCoordinates";

interface UserLocationMarkerProps {
  userLocation: UserLocation;
}

const UserLocationMarker = ({ userLocation }: UserLocationMarkerProps) => {
  return (
    <motion.div 
      initial={{
        opacity: 0,
        y: -20
      }} 
      animate={{
        opacity: 1,
        y: 0
      }} 
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2" 
      style={{
        left: userLocation.mapX,
        top: userLocation.mapY
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
  );
};

export default UserLocationMarker;
