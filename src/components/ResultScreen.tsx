
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizResult } from "@/utils/quizData";
import { Skeleton } from "@/components/ui/skeleton";
import RestaurantCard from "@/components/RestaurantCard";
import { ArrowLeft, ChevronDown, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState, useEffect } from "react";

interface ResultScreenProps {
  results: QuizResult[];
  onReset: () => void;
  isLoading?: boolean;
}

const INITIAL_DISPLAY_COUNT = 3;

const ResultScreen = ({ results, onReset, isLoading = false }: ResultScreenProps) => {
  // State to track how many restaurants to show
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  
  // Debug output to check results
  useEffect(() => {
    console.log("Results in ResultScreen:", results);
    if (results.length > 0) {
      console.log("First result sample:", results[0]);
    }
  }, [results]);
  
  // Check if all results are alternatives
  const allAlternatives = results.length > 0 && results.every(result => result.isAlternative);
  const hasAlternatives = results.length > 0 && results.some(result => result.isAlternative);
  const isSingleResult = results.length === 1;
  const noExactMatches = allAlternatives || results.length === 0;
  
  // Get the subset of results to display
  const displayedResults = results.slice(0, displayCount);
  
  // Check if there are more results to show
  const hasMoreResults = results.length > displayCount;
  
  // Check if any restaurant has reservation links
  const hasReservationLinks = results.some(r => r.resyLink || r.openTableLink);
  
  // Check if any restaurant has map coordinates for map links
  const hasMapLinks = results.some(r => r.coordinates || r.address);
  
  // Check if results include distance information
  const hasDistanceInfo = results.some(r => r.distanceFromUser !== undefined);
  
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
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="inline-flex items-center justify-center p-3 rounded-full mb-5"
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
          className="text-3xl md:text-4xl font-bold mb-3 text-red-500"
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
        
        {/* Add map links explanation */}
        {hasMapLinks && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="text-sm text-zinc-500 mt-2"
          >
            <span className="inline-flex items-center">
              <ExternalLink className="h-3 w-3 mr-1" />
              View locations in Google Maps or Apple Maps
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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="border border-zinc-800 rounded-lg overflow-hidden bg-zinc-900/50">
              <Skeleton className="h-48 w-full bg-zinc-800/50" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4 bg-zinc-800/50" />
                <Skeleton className="h-4 w-1/2 mb-2 bg-zinc-800/50" />
                <Skeleton className="h-4 w-3/4 mb-8 bg-zinc-800/50" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-20 bg-zinc-800/50" />
                  <Skeleton className="h-8 w-20 bg-zinc-800/50" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : results.length > 0 ? (
        <>
          {noExactMatches && (
            <Alert className="mb-6 bg-amber-950/20 border-amber-800/50">
              <AlertDescription className="text-amber-300 text-center">
                There are no exact matches for your criteria, but these are the closest to your preferences.
              </AlertDescription>
            </Alert>
          )}
          
          {hasAlternatives && !allAlternatives && hasDistanceInfo && (
            <Alert className="mb-6 bg-blue-950/20 border-blue-800/50">
              <AlertDescription className="text-blue-300 text-center">
                Some restaurants are outside your specified distance but may match your other preferences.
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
                className="gap-2 border-red-500/30 text-red-400 hover:bg-red-950/30 hover:text-red-300"
              >
                Show More Results
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center p-8 border border-zinc-800 rounded-lg bg-zinc-900/50">
          <p className="text-lg mb-4 text-zinc-200">No matches found for your preferences</p>
          <p className="text-zinc-400 mb-6">
            Try adjusting your preferences for more options, or check out our curated selection of local favorites.
          </p>
        </div>
      )}

      <div className="mt-12 text-center">
        <Button 
          onClick={onReset} 
          variant="outline" 
          className="gap-2 border-zinc-700 text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" /> Start Over
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultScreen;
