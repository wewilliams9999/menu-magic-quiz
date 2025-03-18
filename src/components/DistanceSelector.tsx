
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import NeighborhoodMap from "./NeighborhoodMap";

interface DistanceSelectorProps {
  onSelect: (distance: number) => void;
  selectedDistance: number;
  options: { id: string; text: string; value: string }[];
  userLocation?: { lat: number; lng: number } | null;
}

const DistanceSelector = ({
  onSelect,
  selectedDistance,
  options,
  userLocation,
}: DistanceSelectorProps) => {
  const isMobile = useIsMobile();
  const distances = [1, 2, 3, 5, 10, 15];
  
  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="p-4">
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-2">Select Distance Range</h3>
            <p className="text-sm text-gray-500 mb-4">
              We'll find restaurants within this distance from your current location
            </p>
            
            <div className="mb-4">
              <Slider
                defaultValue={[selectedDistance]}
                max={15}
                min={1}
                step={1}
                onValueChange={(value) => onSelect(value[0])}
                className="py-4"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1 px-1">
                {distances.map((d) => (
                  <span key={d}>{d} mi</span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 mb-6 flex justify-center">
              <Badge variant="secondary" className="px-4 py-2 text-base">
                {selectedDistance} {selectedDistance === 1 ? 'mile' : 'miles'} radius
              </Badge>
            </div>
          </div>
          
          <div className="overflow-hidden rounded-lg">
            <div className="relative">
              <NeighborhoodMap 
                selectedNeighborhoods={[]}
                onSelect={() => {}}
                options={options}
                useUserLocation={true}
                distanceMode={true}
                distanceRadius={selectedDistance}
              />
              
              {userLocation && (
                <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-2 rounded-md shadow-md text-xs">
                  <div className="flex items-center gap-1.5">
                    <Navigation className="h-3.5 w-3.5 text-nashville-accent" />
                    <span>Your location</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceSelector;
