
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col items-center justify-center text-center gap-6 px-4 max-w-2xl mx-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-2"
      >
        <div className="inline-flex items-center justify-center p-2 bg-nashville-accent/20 rounded-full mb-5">
          <span className="text-nashville-accent text-2xl">✦</span>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl md:text-5xl font-bold tracking-tight"
      >
        Find Your Perfect Nashville Restaurant
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-lg text-nashville-700 dark:text-nashville-300 max-w-md"
      >
        Answer a few questions about your preferences, and we'll recommend Nashville restaurants that match your taste.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="w-full max-w-xs"
      >
        <Button
          onClick={onStart}
          className="w-full bg-nashville-900 hover:bg-nashville-800 text-white py-6 text-lg transition-all duration-300"
        >
          Start Quiz
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
