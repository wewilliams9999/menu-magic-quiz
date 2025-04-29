
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/utils/quizData";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";
import { ArrowLeft, ChevronDown, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

interface ResultScreenProps {
  results: QuizResult[];
  onReset: () => void;
  isLoading?: boolean;
}

const INITIAL_DISPLAY_COUNT = 3;

const ResultScreen = ({ results, onReset, isLoading = false }: ResultScreenProps) => {
  // State to track how many restaurants to show
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  
  // Check if all results are alternatives
  const allAlternatives = results.length > 0 && results.every(result => result.isAlternative);
  const isSingleResult = results.length === 1;
  const noExactMatches = allAlternatives || results.length === 0;
  
  // Get the subset of results to display
  const displayedResults = results.slice(0, displayCount);
  
  // Check if there are more results to show
  const hasMoreResults = results.length > displayCount;
  
  // Function to handle showing more results
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 3);
  };
  
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
        
        {/* Show result count info */}
        {results.length > 0 && !isSingleResult && (
          <p className="text-sm text-nashville-500 mt-2">
            Showing {displayedResults.length} of {results.length} matches
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((_, i) => (
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
          {noExactMatches && (
            <Alert className="mb-6 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <AlertDescription className="text-amber-800 dark:text-amber-300 text-center">
                There are no exact matches for your criteria, but these are the closest to your preferences.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedResults.map((result) => (
              <RestaurantCard key={result.id} restaurant={result} />
            ))}
          </div>
          
          {/* Show "More Results" button if there are more results to display */}
          {hasMoreResults && (
            <div className="mt-8 text-center">
              <Button 
                onClick={handleShowMore} 
                variant="outline" 
                className="gap-2"
              >
                Show More Results
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
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
