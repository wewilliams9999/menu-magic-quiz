import { motion } from "framer-motion";
import { Wrench, Clock } from "lucide-react";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative bg-black">
      <div className="absolute inset-0 z-0 bg-brick"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 z-10 relative"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="inline-block mb-8"
        >
          <Wrench className="w-20 h-20 text-red-500" />
        </motion.div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-red-500">
          Under Maintenance
        </h1>

        <p className="text-white text-lg sm:text-xl mb-8 leading-relaxed">
          We're currently making improvements to bring you the best restaurant recommendations. 
          Our quiz will be back online shortly!
        </p>

        <div className="flex items-center justify-center gap-3 text-red-400">
          <Clock className="w-5 h-5" />
          <span className="text-base sm:text-lg">We'll be back soon</span>
        </div>

        <p className="mt-8 text-white/60 text-sm">
          Thank you for your patience
        </p>
      </motion.div>
    </div>
  );
};

export default MaintenancePage;
