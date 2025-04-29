
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const Homepage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative">
      {/* Logo Background with adjusted opacity */}
      <div 
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url("/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png")`,
          backgroundSize: 'cover',
          filter: 'contrast(1.2) brightness(1.1)'
        }}
      />
      
      {/* Dark overlay with further reduced opacity to make logo more visible */}
      <div className="absolute inset-0 bg-black/45 z-0" />
      
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1.2 }} 
        className="text-center max-w-2xl mx-auto px-4 py-12 z-10 relative"
      >
        <motion.p 
          initial={{ y: 10, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ delay: 0.7, duration: 0.6 }} 
          className="mt-4 text-lg text-white mb-8"
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
