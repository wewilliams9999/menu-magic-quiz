
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { trackQuizStart } from "@/utils/analytics";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleStartQuiz = () => {
    trackQuizStart();
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
      {/* SEO-friendly content structure */}
      <div className="text-center max-w-4xl mx-auto">
        {/* Main heading for SEO */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-6xl font-bold mb-6 text-red-500"
        >
          Best Nashville Restaurants
        </motion.h1>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl md:text-3xl font-semibold mb-4 text-white"
        >
          Find Your Perfect Nashville Dining Experience
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-zinc-300 mb-12 leading-relaxed max-w-2xl mx-auto"
        >
          Discover Nashville's top restaurants with our personalized guide. Answer a few quick questions and we'll match you with the perfect spot based on your preferences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            onClick={handleStartQuiz}
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-12 py-6 text-xl font-semibold mb-8 shadow-lg"
          >
            Find My Perfect Nashville Restaurant
          </Button>
        </motion.div>

        {/* Simple trust indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-zinc-400">
            Trusted by Nashville locals and visitors • Updated restaurant recommendations
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default WelcomePage;
