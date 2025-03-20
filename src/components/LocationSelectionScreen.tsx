import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Map } from "lucide-react";
import { toast } from "sonner";
import NeighborhoodMap from "./NeighborhoodMap";
import { useLocationServices } from "./map/useLocationServices";
interface LocationSelectionScreenProps {
  onAnswer: (questionId: string, answerId: string) => void;
}
const LocationSelectionScreen = ({
  onAnswer
}: LocationSelectionScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [locationToastShown, setLocationToastShown] = useState(false);
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

  // Effect to show toast when location is found
  useEffect(() => {
    if (userLocation && selectedOption === "location" && !locationToastShown) {
      toast.success("Your location has been found");
      setLocationToastShown(true);
    }
  }, [userLocation, selectedOption, locationToastShown]);
  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
    if (value === "location") {
      getUserLocation();
    }
    if (onAnswer) {
      onAnswer("locationMethod", value);
    }
  };
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={{
    opacity: 1,
    y: 0
  }} exit={{
    opacity: 0,
    y: -20
  }} transition={{
    duration: 0.5
  }} className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-nashville-accent/30 to-nashville-accent/10 rounded-full mb-4">
          <MapPin className="text-nashville-accent w-8 h-8" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent mb-4">
          Find Your Perfect Nashville Restaurant
        </h2>
        <p className="text-nashville-600 dark:text-nashville-400 text-lg mb-8">We can help you discover restaurants based on distance from your current location or specific neighborhoods.</p>
      </div>

      <div className="w-full max-w-md mb-8 space-y-4">
        <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => handleOptionSelect("location")} className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 ${selectedOption === "location" ? "bg-nashville-accent text-nashville-900 shadow-lg" : "bg-nashville-accent/20 hover:bg-nashville-accent/30 text-nashville-900 dark:text-nashville-accent border border-nashville-accent/50"}`} disabled={isLocating}>
          <Navigation className="w-5 h-5" />
          {isLocating ? "Finding Location..." : "Use My Location"}
        </motion.button>

        <motion.button whileHover={{
        scale: 1.02
      }} whileTap={{
        scale: 0.98
      }} onClick={() => handleOptionSelect("manual")} className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 ${selectedOption === "manual" ? "bg-nashville-accent text-nashville-900 shadow-lg" : "bg-nashville-accent/20 hover:bg-nashville-accent/30 text-nashville-900 dark:text-nashville-accent border border-nashville-accent/50"}`}>
          <Map className="w-5 h-5" />
          Choose Neighborhoods
        </motion.button>
      </div>
      
      {selectedOption === "location" && userLocation && <div className="w-full max-w-2xl mt-4 bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-xl p-6 border border-nashville-200 dark:border-nashville-800 shadow-lg">
          <h3 className="text-lg font-medium mb-3">Your Location</h3>
          <div className="h-[300px] rounded-lg overflow-hidden">
            <NeighborhoodMap selectedNeighborhoods={[]} onSelect={() => {}} useUserLocation={true} options={[]} initialUserLocation={{
          lat: userLocation.latitude,
          lng: userLocation.longitude
        }} />
          </div>
        </div>}
    </motion.div>;
};
export default LocationSelectionScreen;