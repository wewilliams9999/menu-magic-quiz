
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, MapIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface LocationSelectionScreenProps {
  onContinue: () => void;
}

const LocationSelectionScreen = ({ onContinue }: LocationSelectionScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4"
    >
      <Alert className="mb-6 border-nashville-accent/30 bg-nashville-accent/10">
        <MapIcon className="h-5 w-5 text-nashville-accent" />
        <AlertDescription className="text-sm font-medium text-nashville-800 dark:text-nashville-100">
          Please allow access to your location for personalized restaurant recommendations
        </AlertDescription>
      </Alert>

      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-nashville-accent/30 to-nashville-accent/10 rounded-full mb-4">
          <MapPin className="text-nashville-accent w-8 h-8" />
        </div>
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent mb-4">
          Find Your Perfect Nashville Restaurant
        </h2>
        <p className="text-nashville-600 dark:text-nashville-400 text-lg mb-8">
          Answer a few questions to get personalized recommendations based on your preferences.
        </p>
      </div>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onContinue}
          className="w-64 py-6 flex flex-col gap-2 text-lg bg-gradient-to-r from-nashville-accent to-nashville-accent/80 hover:from-nashville-accent/90 hover:to-nashville-accent/70 text-nashville-900"
        >
          <span className="font-medium">Start Quiz</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default LocationSelectionScreen;
