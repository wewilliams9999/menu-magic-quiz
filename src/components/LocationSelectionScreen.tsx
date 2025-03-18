
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, MapIcon, Navigation, Map } from "lucide-react";

interface LocationSelectionScreenProps {
  onContinue: () => void;
  onAnswer?: (questionId: string, answerId: string) => void;
}

const LocationSelectionScreen = ({ onContinue, onAnswer }: LocationSelectionScreenProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (value: string) => {
    setSelectedOption(value);
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
      className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center px-4"
    >
      <div className="mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-nashville-accent/30 to-nashville-accent/10 rounded-full mb-4">
          <MapPin className="text-nashville-accent w-8 h-8" />
        </div>
        <div className="mb-2 text-sm font-medium text-nashville-accent">Question 1</div>
        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent mb-4">
          Find Your Perfect Nashville Restaurant
        </h2>
        <p className="text-nashville-600 dark:text-nashville-400 text-lg mb-8">
          We can help you discover restaurants based on specific neighborhoods or your current location.
        </p>
      </div>

      <div className="w-full max-w-md mb-8 space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptionSelect("location")}
          className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 ${
            selectedOption === "location"
              ? "bg-nashville-accent text-nashville-900 shadow-lg"
              : "bg-nashville-accent/20 hover:bg-nashville-accent/30 text-nashville-900 dark:text-nashville-accent border border-nashville-accent/50"
          }`}
        >
          <Navigation className="w-5 h-5" />
          Use My Location
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOptionSelect("manual")}
          className={`w-full py-4 px-6 rounded-lg flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 ${
            selectedOption === "manual"
              ? "bg-nashville-accent text-nashville-900 shadow-lg"
              : "bg-nashville-accent/20 hover:bg-nashville-accent/30 text-nashville-900 dark:text-nashville-accent border border-nashville-accent/50"
          }`}
        >
          <Map className="w-5 h-5" />
          Choose Neighborhoods
        </motion.button>
      </div>

      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onContinue}
          disabled={!selectedOption}
          className="w-64 py-6 flex flex-col gap-2 text-lg bg-gradient-to-r from-nashville-accent to-nashville-accent/80 hover:from-nashville-accent/90 hover:to-nashville-accent/70 text-nashville-900 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="font-medium">Continue</span>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default LocationSelectionScreen;
