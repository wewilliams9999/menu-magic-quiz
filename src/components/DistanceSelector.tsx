
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigation, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
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
  
  const {
    userLocation: location,
    isLocating,
    getUserLocation: getLocation
  } = useLocationServices(initialUserLocation, false);
  
  useEffect(() => {
    if (location && userInitiatedLocationRequest && onLocationShared) {
      onLocationShared();
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
      <div className="rounded-xl overflow-hidden bg-black/50 shadow-md border border-orange-500/20">
        <div className="p-4">
          <div className="mb-8">
            {!location && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg"
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="bg-blue-900/50 p-2 rounded-full">
                    <Navigation className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-300 mb-1">Share Your Location</h4>
                    <p className="text-sm text-blue-300 mb-3">To find restaurants near you, please share your location</p>
                    <Button 
                      onClick={getUserLocation} 
                      disabled={isLocating} 
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLocating ? "Getting Location..." : "Share My Location"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
            
            {permissionDenied && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-amber-900/30 border border-amber-500/30 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-amber-300 mb-1">Location Permission Required</h4>
                    <p className="text-sm text-amber-300">
                      Please enable location services in your browser settings and refresh the page to use distance-based search.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
            
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
                        className={`flex-1 min-w-[60px] border border-gray-600 dark:border-gray-600 rounded-md px-2 py-3 text-white
                          ${selectedDistance === distance 
                            ? "bg-orange-500/30 border-orange-500 text-orange-300" 
                            : ""}`}
                      >
                        {distance} mi
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
                
                <div className="mt-4 mb-6 flex justify-center">
                  <Badge variant="secondary" className="px-4 py-2 text-base bg-orange-500/20 text-orange-300 border border-orange-500/30">
                    {selectedDistance} {selectedDistance === 1 ? 'mile' : 'miles'} radius
                  </Badge>
                </div>
                
                <div className="p-8 flex items-center justify-center bg-gray-800/50 rounded-lg border border-gray-600">
                  <div className="text-center">
                    <div className="mb-3 inline-flex p-3 rounded-full bg-orange-900/30">
                      <Navigation className="h-6 w-6 text-orange-400" />
                    </div>
                    <p className="text-sm text-gray-300">
                      We'll search for restaurants within a {selectedDistance}-mile radius of your current location
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceSelector;
