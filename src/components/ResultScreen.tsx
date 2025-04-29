
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/utils/quizData";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";
import { ArrowLeft, ExternalLink } from "lucide-react";

interface ResultScreenProps {
  results: QuizResult[];
  onReset: () => void;
  isLoading?: boolean;
}

const ResultScreen = ({ results, onReset, isLoading = false }: ResultScreenProps) => {
  // Check if all results are alternatives
  const allAlternatives = results.length > 0 && results.every(result => result.isAlternative);
  const isSingleResult = results.length === 1;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-nashville-accent/20 rounded-full mb-5">
          <span className="text-nashville-accent text-2xl">✦</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          {isSingleResult 
            ? "Your Nashville Restaurant Match" 
            : "Your Nashville Restaurant Matches"}
        </h2>
        <p className="text-nashville-600 dark:text-nashville-400 max-w-md mx-auto">
          {isSingleResult
            ? "Based on your preferences, we think you'll enjoy this Nashville gem."
            : "Based on your preferences, we think you'll enjoy these Nashville gems."}
        </p>
        
        {/* Add reservation links explanation */}
        {results.some(r => r.resyLink || r.openTableLink) && (
          <p className="text-sm text-nashville-500 mt-2">
            <span className="inline-flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              Reservation links available where offered
            </span>
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((_, i) => (
            <div key={i} className="border rounded-lg overflow-hidden">
              <Skeleton className="h-48 w-full" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-3/4 mb-8" />
                <Skeleton className="h-20 w-full mb-4" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          {allAlternatives && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 text-center">
              <p className="text-yellow-800 dark:text-yellow-300">
                We couldn't find exact matches for your criteria, but here are some great alternatives!
              </p>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result) => (
              <RestaurantCard key={result.id} restaurant={result} />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
          <p className="text-lg mb-4">No exact matches found, but we have some alternatives for you!</p>
          <p className="text-nashville-600 dark:text-nashville-400 mb-6">
            Try adjusting your preferences for more options, or check out our curated selection of local favorites.
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Start Over
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultScreen;
