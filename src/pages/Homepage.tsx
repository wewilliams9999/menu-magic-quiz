
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-nashville-50 dark:bg-nashville-950">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <div className="mb-8">
          <img 
            src="/lovable-uploads/f9cf439b-c731-45ab-8bd2-76ed76a6b686.png" 
            alt="Nash Menus Logo" 
            className="h-16 mx-auto"
          />
          <h1 className="text-4xl font-bold mt-4 text-nashville-900 dark:text-nashville-50">
            Nash Menus
          </h1>
          <p className="mt-4 text-lg text-nashville-700 dark:text-nashville-300">
            Find your perfect Nashville restaurant match based on your preferences
          </p>
        </div>

        <Button 
          onClick={() => navigate("/quiz")}
          className="bg-nashville-accent hover:bg-nashville-accent/90 text-white px-8 py-6 text-lg"
        >
          Start Quiz
        </Button>
      </motion.div>
    </div>
  );
};

export default Homepage;
