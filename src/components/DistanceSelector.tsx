
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, NavigationOff, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import NeighborhoodMap from "./NeighborhoodMap";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useLocationServices } from "./map/useLocationServices";

interface DistanceSelectorProps {
  onSelect: (distance: number) => void;
  selectedDistance: number;
  options: {
    id: string;
    text: string;
    value: string;
  }[];
  userLocation?: {
    lat: number;
    lng: number;
  } | null;
  onLocationShared?: () => void;
}

const DistanceSelector = ({
  onSelect,
  selectedDistance,
  options,
  userLocation: initialUserLocation,
  onLocationShared
}: DistanceSelectorProps) => {
  const isMobile = useIsMobile();
  const distances = [3, 5, 10, 15, 30, 50];
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [userInitiatedLocationRequest, setUserInitiatedLocationRequest] = useState(false);
  const [locationToastShown, setLocationToastShown] = useState(false);
  
  // Use the location services hook with toasts disabled
  const { 
    userLocation: location, 
    isLocating, 
    getUserLocation: getLocation 
  } = useLocationServices(initialUserLocation, false);

  // Effect to notify parent when location is obtained
  useEffect(() => {
    if (location && userInitiatedLocationRequest && onLocationShared) {
      onLocationShared();
      // Show toast here instead, but only once
      if (!locationToastShown) {
        toast.success("Your location has been found");
        setLocationToastShown(true);
      }
    }
  }, [location, userInitiatedLocationRequest, onLocationShared, locationToastShown]);

  const getUserLocation = () => {
    setPermissionDenied(false);
    setUserInitiatedLocationRequest(true);
    getLocation();
  };

  return (
    <div className="w-full">
      <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800">
        <div className="p-4">
          <div className="mb-8">
            
            <p className="text-sm text-gray-500 mb-4">
              We'll find restaurants within this distance from your current location
            </p>
            
            {!location && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="bg-blue-100 dark:bg-blue-800/30 p-2 rounded-full">
                    <Navigation className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">Share Your Location</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">To find restaurants near you, please share your location</p>
                    <Button onClick={getUserLocation} disabled={isLocating} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {isLocating ? "Getting Location..." : "Share My Location"}
                    </Button>
                  </div>
                </div>
              </motion.div>}
            
            {permissionDenied && <motion.div initial={{
              opacity: 0,
              y: 10
            }} animate={{
              opacity: 1,
              y: 0
            }} className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-800 dark:text-amber-300 mb-1">Location Permission Required</h4>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Please enable location services in your browser settings and refresh the page to use distance-based search.
                    </p>
                  </div>
                </div>
              </motion.div>}
            
            {/* Only show distance options after location is shared */}
            {location && (
              <>
                <div className="mb-6">
                  <ToggleGroup 
                    type="single" 
                    value={selectedDistance.toString()} 
                    onValueChange={value => value && onSelect(parseInt(value))} 
                    className="flex flex-wrap justify-between gap-2"
                  >
                    {distances.map(distance => (
                      <ToggleGroupItem 
                        key={distance} 
                        value={distance.toString()} 
                        variant="outline" 
                        className={`flex-1 min-w-[60px] border border-gray-200 dark:border-gray-700 rounded-md px-2 py-3 ${selectedDistance === distance ? "bg-nashville-accent/20 border-nashville-accent text-nashville-accent dark:border-nashville-accent dark:text-nashville-accent" : ""}`}
                      >
                        {distance} mi
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                
                <div className="mt-4 mb-6 flex justify-center">
                  <Badge variant="secondary" className="px-4 py-2 text-base">
                    {selectedDistance} {selectedDistance === 1 ? 'mile' : 'miles'} radius
                  </Badge>
                </div>
              </>
            )}
          </div>
          
          {/* Only show map after location is shared */}
          {location && (
            <div className="overflow-hidden rounded-lg">
              <div className="relative">
                <NeighborhoodMap 
                  selectedNeighborhoods={[]} 
                  onSelect={() => {}} 
                  options={options} 
                  useUserLocation={true} 
                  distanceMode={true} 
                  distanceRadius={selectedDistance} 
                  initialUserLocation={{
                    lat: location.latitude,
                    lng: location.longitude
                  }} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistanceSelector;
