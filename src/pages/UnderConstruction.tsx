
import { Wrench } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UnderConstruction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-100 dark:bg-gray-900"
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        {/* Neon logo with enhanced hover glow */}
        <motion.div 
          className="mb-8 flex justify-center"
          whileHover={{ scale: 1.05 }}
        >
          <div className="relative group">
            <img 
              src="/lovable-uploads/e94ad863-73fe-40fe-b484-e6644272add3.png" 
              alt="Nash Menus Neon Logo" 
              className="w-64 h-auto transition-all duration-300"
            />
            <div className="absolute inset-0 rounded-full bg-orange-500/0 group-hover:bg-orange-500/20 blur-xl transition-all duration-500 group-hover:blur-2xl -z-10"></div>
          </div>
        </motion.div>

        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Under Construction</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We are working hard to bring you an awesome experience. Please check back soon!
        </p>
        <p className="text-gray-900 dark:text-gray-200">
          <Link to="/quiz" className="text-yellow-500 hover:underline font-medium">
            Click here for a preview
          </Link>
          , but some features aren't working yet.
        </p>
      </div>
    </motion.div>
  );
};

export default UnderConstruction;
