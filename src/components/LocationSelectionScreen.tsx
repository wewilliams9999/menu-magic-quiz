
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Map } from "lucide-react";
import NeighborhoodMap from "./NeighborhoodMap";
import { useLocationServices } from "./map/useLocationServices";

interface LocationSelectionScreenProps {
  onAnswer: (questionId: string, answerId: string) => void;
  onUserLocationUpdate?: (coords: { latitude: number; longitude: number }) => void;
}

const LocationSelectionScreen = ({
  onAnswer,
  onUserLocationUpdate
}: LocationSelectionScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const {
    userLocation,
    isLocating,
    getUserLocation
  } = useLocationServices(null, false); // Disable automatic toasts

  // Effect to continue to next question immediately after selection
  useEffect(() => {
    if (selectedOption) {
      // Small delay for better UX to see the selection effect
      const timer = setTimeout(() => {
        // The continue functionality is now handled inside the handleOptionSelect
        // through the onAnswer callback
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedOption]);

  // Effect to update parent component when location is found
  useEffect(() => {
    if (userLocation && selectedOption === "location") {
      // Pass the user location to the parent component without showing toast
      if (onUserLocationUpdate) {
        onUserLocationUpdate({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        });
      }
    }
  }, [userLocation, selectedOption, onUserLocationUpdate]);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    if (value === "location") {
      getUserLocation();
    }
    if (onAnswer) {
      onAnswer("locationMethod", value);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-red-500/30 rounded-full mb-4">
          <MapPin className="text-red-500 w-8 h-8" />
        </div>
        
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-red-500 mb-3 sm:mb-4 leading-tight">
          Find Your Perfect Nashville Restaurant
        </h2>
        <p className="text-white text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
          We can help you discover restaurants based on distance from your current location or specific neighborhoods.
        </p>
      </div>

      <div className="w-full max-w-lg mb-6 sm:mb-8 space-y-3 sm:space-y-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptionSelect("location")} 
          className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-lg flex items-center justify-center gap-3 text-base sm:text-lg font-medium transition-all duration-300 touch-manipulation min-h-[60px] sm:min-h-[64px]
            ${selectedOption === "location" 
              ? "bg-red-500 text-black shadow-lg" 
              : "bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50"}`}
          disabled={isLocating}
        >
          <Navigation className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="whitespace-nowrap">{isLocating ? "Finding Location..." : "Use My Location"}</span>
        </motion.button>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptionSelect("manual")} 
          className={`w-full py-4 sm:py-5 px-6 sm:px-8 rounded-lg flex items-center justify-center gap-3 text-base sm:text-lg font-medium transition-all duration-300 touch-manipulation min-h-[60px] sm:min-h-[64px]
            ${selectedOption === "manual" 
              ? "bg-red-500 text-black shadow-lg" 
              : "bg-red-500/20 hover:bg-red-500/30 text-white border border-red-500/50"}`}
        >
          <Map className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="whitespace-nowrap">Choose Neighborhoods</span>
        </motion.button>
      </div>
      
      {selectedOption === "location" && userLocation && (
        <div className="w-full max-w-4xl mt-4 sm:mt-6 bg-black/50 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-red-500/30 shadow-lg">
          <h3 className="text-base sm:text-lg font-medium mb-3 text-white">Your Location</h3>
          <div className="h-[250px] sm:h-[300px] lg:h-[400px] rounded-lg overflow-hidden">
            <NeighborhoodMap 
              selectedNeighborhoods={[]} 
              onSelect={() => {}} 
              useUserLocation={true} 
              options={[]}
              initialUserLocation={{
                lat: userLocation.latitude,
                lng: userLocation.longitude
              }} 
            />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default LocationSelectionScreen;
