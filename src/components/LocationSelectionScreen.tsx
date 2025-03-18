
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, MapIcon, Navigation, Map } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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

      <div className="w-full max-w-md mb-8">
        <div className="space-y-4">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === "location" 
                ? "border-nashville-accent bg-nashville-accent/10" 
                : "border-nashville-200 dark:border-nashville-700 hover:border-nashville-accent/50"
            }`}
            onClick={() => handleOptionSelect("location")}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                selectedOption === "location" 
                  ? "bg-nashville-accent text-white" 
                  : "bg-nashville-100 dark:bg-nashville-800"
              }`}>
                <Navigation className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-lg">Use My Location</h3>
                <p className="text-sm text-nashville-600 dark:text-nashville-400">Find restaurants close to you</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === "location" 
                  ? "border-nashville-accent" 
                  : "border-nashville-300 dark:border-nashville-600"
              }`}>
                {selectedOption === "location" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-nashville-accent" />
                )}
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
              selectedOption === "manual" 
                ? "border-nashville-accent bg-nashville-accent/10" 
                : "border-nashville-200 dark:border-nashville-700 hover:border-nashville-accent/50"
            }`}
            onClick={() => handleOptionSelect("manual")}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${
                selectedOption === "manual" 
                  ? "bg-nashville-accent text-white" 
                  : "bg-nashville-100 dark:bg-nashville-800"
              }`}>
                <Map className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium text-lg">Choose Neighborhoods</h3>
                <p className="text-sm text-nashville-600 dark:text-nashville-400">Browse by Nashville areas</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === "manual" 
                  ? "border-nashville-accent" 
                  : "border-nashville-300 dark:border-nashville-600"
              }`}>
                {selectedOption === "manual" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-nashville-accent" />
                )}
              </div>
            </div>
          </motion.div>
        </div>
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
