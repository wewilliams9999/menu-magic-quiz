
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";

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
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold mb-6 text-red-500"
        >
          Nashville Restaurant Finder
        </motion.h1>

        <motion.p 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7, duration: 0.6 }} 
          className="mt-4 text-white mb-8 text-xl"
        >
          Answer a few questions and discover Nashville restaurants you'll love.
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
            className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500/10 px-8 py-6 text-lg neon-box"
          >
            <Utensils className="mr-2" />
            Find My Perfect Nashville Restaurant
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
