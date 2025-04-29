
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Beer, ChevronRight } from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center dive-bar-bg text-white">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="text-center max-w-2xl mx-auto px-4 py-12"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-6 relative"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                boxShadow: ["0 0 10px #ff7800", "0 0 20px #ff7800", "0 0 10px #ff7800"],
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="rounded-full p-4 border border-orange-600/30 bg-black/30"
            >
              <Beer className="h-12 w-12 text-orange-500" />
            </motion.div>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-5xl font-bold mt-4 neon-text"
        >
          NASH MENUS
        </motion.h1>

        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-4 text-lg text-zinc-400 mb-8"
        >
          Find your perfect Nashville restaurant match based on your preferences
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
            Start Quiz <ChevronRight className="ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Homepage;
