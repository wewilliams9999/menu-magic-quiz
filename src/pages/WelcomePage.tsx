
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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
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
          className="text-lg md:text-xl text-zinc-300 mb-8 leading-relaxed"
        >
          Discover Nashville's top restaurants with our personalized guide. Whether you're craving hot chicken in Music City, fine dining in Green Hills, or hidden gems in East Nashville, we'll help you find the perfect spot based on your neighborhood, cuisine preferences, and budget.
        </motion.p>

        {/* Key features for SEO */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left"
        >
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-semibold text-red-400 mb-3">By Neighborhood</h3>
            <p className="text-zinc-300 text-sm">
              Explore restaurants in Music City Center, The Gulch, Green Hills, Belle Meade, East Nashville, and more.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-semibold text-red-400 mb-3">All Cuisines</h3>
            <p className="text-zinc-300 text-sm">
              From Southern comfort food to international cuisine, find Nashville restaurants serving every type of food.
            </p>
          </div>
          
          <div className="bg-zinc-900/50 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-semibold text-red-400 mb-3">Every Budget</h3>
            <p className="text-zinc-300 text-sm">
              Discover everything from budget-friendly Nashville eats to upscale fine dining experiences.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button 
            onClick={handleStartQuiz}
            size="lg" 
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
          >
            Find My Perfect Nashville Restaurant
          </Button>
        </motion.div>

        {/* Additional SEO content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-zinc-400">
            Trusted by Nashville locals and visitors • Updated restaurant recommendations • Real-time availability
          </p>
        </motion.div>
      </div>

      {/* Background logo with improved accessibility */}
      <div 
        className="absolute inset-0 flex items-center justify-center z-[-1] opacity-20"
        aria-hidden="true"
      >
        <div 
          className="w-[80vmin] h-[80vmin] bg-center bg-contain bg-no-repeat"
          style={{
            backgroundImage: `url("/lovable-uploads/5e438e4a-f73a-48ba-bd59-55214f04eeaf.png")`,
          }}
        />
      </div>
    </div>
  );
};

export default WelcomePage;
