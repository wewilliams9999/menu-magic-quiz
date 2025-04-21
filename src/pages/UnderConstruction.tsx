
import { wrench } from "lucide-react";
import { motion } from "framer-motion";

const UnderConstruction = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gray-100 dark:bg-gray-900"
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full">
        <div className="mb-4 flex justify-center">
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 text-yellow-400"
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75v-1.5A3.75 3.75 0 0010.5 4.5H9a3 3 0 00-3 3v3.75a3 3 0 003 3h3.75a3 3 0 013 3v.75a3 3 0 003-3v-3a3.75 3.75 0 00-3.75-3.75z" />
          </motion.svg>
        </div>
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">Under Construction</h1>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          We are working hard to bring you an awesome experience. Please check back soon!
        </p>
      </div>
    </motion.div>
  );
};

export default UnderConstruction;
