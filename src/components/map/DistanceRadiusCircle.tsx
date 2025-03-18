
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
  
  return (
    <div 
      className="absolute rounded-full border-2 border-nashville-accent/20 bg-nashville-accent/10"
      style={{
        width: `${radiusInPixels * 2}px`,
        height: `${radiusInPixels * 2}px`,
        left: userLocation.mapX,
        top: userLocation.mapY,
        transform: 'translate(-50%, -50%)', // This ensures the circle is centered on the point
        pointerEvents: 'none',
        zIndex: 5
      }}
    >
      <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-gray-800/90 text-xs px-2 py-1 rounded-full shadow-sm">
        {radiusMiles} {radiusMiles === 1 ? 'mile' : 'miles'} radius
      </div>
    </div>
  );
};

export default DistanceRadiusCircle;
