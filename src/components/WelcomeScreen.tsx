
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col items-center justify-center text-center gap-8 px-4 py-12 max-w-2xl mx-auto"
    >
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold text-white mb-4"
      >
        Best Nashville Restaurants Finder
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-lg text-gray-300 max-w-lg leading-relaxed mb-8"
      >
        Discover the best places to eat in Nashville tailored to your taste preferences. 
        Answer a few quick questions and we'll recommend the perfect restaurants for you.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <Button
          onClick={onStart}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 text-lg font-medium transition-colors duration-300 flex items-center justify-center gap-3"
        >
          <Music className="w-5 h-5" />
          Find My Perfect Nashville Restaurant
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
