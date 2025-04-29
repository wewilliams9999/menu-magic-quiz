
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

const WelcomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black">
      {/* Dark background instead of logo */}
      <div className="absolute inset-0 z-0 bg-brick"></div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.2 }} 
        className="text-center max-w-2xl mx-auto px-4 py-12 z-10 relative"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center p-4 rounded-full mb-4">
            <div className="relative">
              <img 
                src="/lovable-uploads/c2d43af8-d827-4faf-94d0-4109003a31fb.png" 
                alt="Beer icon" 
                className="w-16 h-16"
              />
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
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7, duration: 0.6 }} 
          className="mt-4 text-lg text-zinc-400 mb-8"
        >
          Answer a few quick questions, and we'll match you with Nashville restaurants you'll love.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.9, duration: 0.6 }} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.98 }}
        >
          <Button 
            onClick={() => navigate("/quiz")} 
            className="bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 px-8 py-6 text-lg neon-box"
          >
            <Music className="mr-2" />
            Start the Quiz
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
