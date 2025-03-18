
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation } from "lucide-react";

interface LocationSelectionScreenProps {
  onContinue: (method: "manual" | "location") => void;
}

const LocationSelectionScreen = ({ onContinue }: LocationSelectionScreenProps) => {
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

  const handleLocationSelect = () => {
    setIsCheckingPermission(true);
    
    // Check if geolocation is available
    if (!navigator.geolocation) {
      setIsCheckingPermission(false);
      // Continue with manual selection if geolocation is not available
      onContinue("manual");
      return;
    }
    
    // Request permission for location
    navigator.permissions.query({ name: 'geolocation' }).then(permissionStatus => {
      setIsCheckingPermission(false);
      onContinue("location");
    }).catch(() => {
      setIsCheckingPermission(false);
      onContinue("location");
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4"
    >
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-nashville-accent/30 to-nashville-accent/10 rounded-full mb-4">
          <MapPin className="text-nashville-accent w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent mb-4">
          How would you like to explore Nashville?
        </h2>
        <p className="text-nashville-600 dark:text-nashville-400 text-lg mb-8">
          We can help you discover restaurants based on specific neighborhoods or your current location.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-xl">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={() => onContinue("manual")}
            variant="outline"
            className="w-full h-32 flex flex-col gap-2 text-lg bg-white/50 dark:bg-nashville-800/50 hover:bg-white/80 dark:hover:bg-nashville-800/80 border-nashville-200 dark:border-nashville-700"
          >
            <MapPin size={24} className="mb-1 text-nashville-accent" />
            <span className="font-medium">Choose Neighborhoods</span>
            <span className="text-xs text-nashville-500 dark:text-nashville-400">
              I'll select specific areas to explore
            </span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={handleLocationSelect}
            disabled={isCheckingPermission}
            className="w-full h-32 flex flex-col gap-2 text-lg bg-gradient-to-r from-nashville-accent to-nashville-accent/80 hover:from-nashville-accent/90 hover:to-nashville-accent/70 text-nashville-900"
          >
            <Navigation size={24} className="mb-1" />
            <span className="font-medium">Use My Location</span>
            <span className="text-xs opacity-80">
              Find places near me
            </span>
            {isCheckingPermission && (
              <span className="text-xs mt-1">Checking permissions...</span>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LocationSelectionScreen;
