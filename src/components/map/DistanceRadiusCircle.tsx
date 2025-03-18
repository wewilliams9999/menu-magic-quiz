
import { motion } from "framer-motion";
import { UserLocation } from "@/utils/mapCoordinates";

interface DistanceRadiusCircleProps {
  userLocation: UserLocation;
  radiusMiles: number;
}

const DistanceRadiusCircle = ({ userLocation, radiusMiles }: DistanceRadiusCircleProps) => {
  // Convert miles to a percentage of the map (approximate)
  // Nashville map is roughly 50 miles across, so 1 mile is ~2% of map width
  const percentageSize = radiusMiles * 2;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 0.3,
      }}
      transition={{ duration: 0.5 }}
      className="absolute rounded-full bg-nashville-accent/20 border border-nashville-accent/40 pointer-events-none z-10"
      style={{
        width: `${percentageSize}%`,
        height: `${percentageSize}%`,
        left: userLocation.mapX,
        top: userLocation.mapY,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

export default DistanceRadiusCircle;
