import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface ResultHeaderProps {
  isSingleResult: boolean;
  hasReservationLinks: boolean;
  hasMapLinks: boolean;
  results: any[];
  displayedResults: any[];
}

const ResultHeader = ({ 
  isSingleResult, 
  hasReservationLinks, 
  hasMapLinks, 
  results, 
  displayedResults 
}: ResultHeaderProps) => {
  return (
    <div className="text-center mb-2 sm:mb-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="inline-flex items-center justify-center p-2 rounded-full mb-1 sm:mb-3"
      >
        <div className="relative">
          <span className="text-red-500 text-4xl">✦</span>
          <div className="absolute inset-0 blur-md text-red-500">
            <span className="text-4xl">✦</span>
          </div>
        </div>
      </motion.div>
      
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 text-red-500"
      >
        {isSingleResult 
          ? "Your Nashville Restaurant Match" 
          : "Your Nashville Restaurant Matches"}
      </motion.h2>
      
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="text-zinc-400 max-w-md mx-auto"
      >
        {isSingleResult
          ? "Based on your preferences, we think you'll enjoy this Nashville gem."
          : "Based on your preferences, we think you'll enjoy these Nashville gems."}
      </motion.p>
      
      {/* Add reservation links explanation */}
      {hasReservationLinks && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-sm text-zinc-500 mt-2"
        >
          <span className="inline-flex items-center">
            <ExternalLink className="h-3 w-3 mr-1" />
            Reservation links available where offered
          </span>
        </motion.p>
      )}
      
      {/* Show result count info */}
      {results.length > 0 && !isSingleResult && (
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-sm text-zinc-500 mt-2"
        >
          Showing {displayedResults.length} of {results.length} matches
        </motion.p>
      )}
    </div>
  );
};

export default ResultHeader;