
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Beer, Music } from "lucide-react";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative flex flex-col items-center justify-center text-center gap-8 px-4 py-12 max-w-2xl mx-auto"
    >
      <div className="absolute inset-0 z-[-1] bg-brick opacity-70"></div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="inline-flex items-center justify-center p-4 rounded-full mb-4">
          <div className="relative">
            <Beer className="text-neon-orange w-10 h-10 animate-pulse" />
            <div className="absolute inset-0 blur-sm text-neon-orange animate-pulse">
              <Beer className="w-10 h-10" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold tracking-tight neon-text"
      >
        NASH MENUS
      </motion.h1>
      
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-2xl md:text-3xl font-bold text-white/90"
      >
        Find Your Perfect Spot
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-lg text-zinc-400 max-w-md"
      >
        Answer a few quick questions, and we'll match you with Nashville restaurants you'll love.
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
            className="w-full bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 py-6 text-lg font-medium transition-all duration-300 neon-box"
          >
            <Music className="mr-2" />
            Start the Quiz
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
