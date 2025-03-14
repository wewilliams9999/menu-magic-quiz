
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SparklesIcon } from "lucide-react";

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
        <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-nashville-accent/30 to-nashville-accent/10 rounded-full mb-5">
          <SparklesIcon className="text-nashville-accent w-8 h-8" />
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-nashville-900 to-nashville-accent dark:from-white dark:to-nashville-accent"
      >
        Find Your Perfect Nashville Restaurant
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-lg text-nashville-700 dark:text-nashville-300 max-w-md"
      >
        Answer a few quick questions about your preferences, and we'll match you with Nashville restaurants you'll love. No overthinking required!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="w-full max-w-xs"
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            onClick={onStart}
            className="w-full bg-gradient-to-r from-nashville-accent to-nashville-accent/80 hover:from-nashville-accent/90 hover:to-nashville-accent/70 text-nashville-900 py-6 text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl border-0"
          >
            Start the Quiz
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
