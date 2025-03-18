
import React from 'react';
import { UserLocation } from '@/utils/mapCoordinates';

interface DistanceRadiusCircleProps {
  userLocation: UserLocation;
  radiusMiles: number;
}

const DistanceRadiusCircle: React.FC<DistanceRadiusCircleProps> = ({ 
  userLocation, 
  radiusMiles 
}) => {
  // Better scaling factor to make radius proportional
  // A typical city might span ~30 miles across, and our map is ~900px wide
  // So 1 mile ≈ 15 pixels (adjusted from previous 30)
  const scaleFactor = 12; // Pixels per mile
  const radiusInPixels = radiusMiles * scaleFactor;
  
  // Log position values for debugging
  console.log("Circle positioning:", {
    mapX: userLocation.mapX,
    mapY: userLocation.mapY,
    radiusInPixels,
    width: `${radiusInPixels * 2}px`,
    height: `${radiusInPixels * 2}px`
  });
  
  return (
    <div 
      className="absolute rounded-full border-2 border-purple-400/40 bg-gradient-to-br from-purple-400/20 via-pink-400/15 to-blue-400/10"
      style={{
        width: `${radiusInPixels * 2}px`,
        height: `${radiusInPixels * 2}px`,
        position: 'absolute',
        left: userLocation.mapX,
        top: userLocation.mapY,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 5,
        backdropFilter: 'blur(1px)'
      }}
    >
      <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-gray-800/90 text-xs font-medium px-2 py-1 rounded-full shadow-sm text-purple-600 dark:text-purple-300">
        {radiusMiles} {radiusMiles === 1 ? 'mile' : 'miles'} radius
      </div>
    </div>
  );
};

export default DistanceRadiusCircle;
