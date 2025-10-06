
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Utensils } from "lucide-react";
import ShareBucketListPreview from "@/components/ShareBucketListPreview";
import { isMaintenanceActive } from "@/utils/maintenanceMode";
import { useEffect } from "react";

const WelcomePage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isMaintenanceActive()) {
      navigate("/maintenance");
    }
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black">
      {/* Dark background instead of logo */}
      <div className="absolute inset-0 z-0 bg-brick"></div>
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.2 }} 
        className="text-center max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 z-10 relative"
      >
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-red-500 leading-tight"
        >
          Nashville Restaurant Finder
        </motion.h1>

        <motion.p 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7, duration: 0.6 }} 
          className="mt-2 sm:mt-4 text-white mb-6 sm:mb-8 text-lg sm:text-xl lg:text-2xl max-w-2xl mx-auto"
        >
          Answer a few questions and discover Nashville restaurants you'll love.
        </motion.p>

        <motion.div 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.9, duration: 0.6 }} 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.98 }}
          className="w-full max-w-sm sm:max-w-md mx-auto"
        >
          <Button 
            onClick={() => navigate("/quiz")} 
            className="w-full sm:w-auto bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500/10 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg neon-box min-h-[56px] touch-manipulation"
          >
            <Utensils className="mr-2 w-5 h-5 sm:w-6 sm:h-6" />
            <span className="whitespace-nowrap overflow-hidden text-ellipsis">
              Find My Next Meal
            </span>
          </Button>
        </motion.div>
      </motion.div>

      {/* Preview Section */}
      <div className="bg-background">
        <ShareBucketListPreview />
      </div>
    </div>
  );
};

export default WelcomePage;
