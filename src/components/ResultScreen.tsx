
import { motion } from "framer-motion";
import { QuizResult } from "@/utils/quizData";
import { useState, useEffect } from "react";

// Import our newly created components
import ResultHeader from "./results/ResultHeader";
import ResultAlerts from "./results/ResultAlerts";
import ResultLoadingSkeleton from "./results/ResultLoadingSkeleton";
import NoResultsMessage from "./results/NoResultsMessage";
import ResultsGrid from "./results/ResultsGrid";
import ShowMoreButton from "./results/ShowMoreButton";
import ResetButton from "./results/ResetButton";
import BannerAd from "./ads/BannerAd";

interface ResultScreenProps {
  results: QuizResult[];
  onReset: () => void;
  onRetry?: () => void;
  isLoading?: boolean;
  requestedDistance?: number; // Add this prop to pass the requested distance
}

const INITIAL_DISPLAY_COUNT = 3;

const ResultScreen = ({ results, onReset, onRetry, isLoading = false, requestedDistance }: ResultScreenProps) => {
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  
  // Debug output to check results
  useEffect(() => {
    console.log("=== RESULT SCREEN DEBUG ===");
    console.log("Results received:", results);
    console.log("Results length:", results?.length || 0);
    console.log("Is loading:", isLoading);
    console.log("Requested distance:", requestedDistance);
    if (results && results.length > 0) {
      console.log("First result sample:", results[0]);
      console.log("All results:", results.map(r => ({ 
        name: r.name, 
        id: r.id, 
        cuisine: r.cuisine, 
        distance: r.distanceFromUser,
        isAlternative: r.isAlternative 
      })));
    }
    console.log("=== END DEBUG ===");
  }, [results, isLoading, requestedDistance]);
  
  // Handle case where results is undefined or null
  const safeResults = results || [];
  
  // Check if all results are alternatives
  const allAlternatives = safeResults.length > 0 && safeResults.every(result => result.isAlternative);
  const hasAlternatives = safeResults.length > 0 && safeResults.some(result => result.isAlternative);
  const isSingleResult = safeResults.length === 1;
  const noExactMatches = allAlternatives || safeResults.length === 0;
  
  // Get the subset of results to display
  const displayedResults = safeResults.slice(0, displayCount);
  
  // Check if there are more results to show
  const hasMoreResults = safeResults.length > displayCount;
  
  // Check if any restaurant has reservation links
  const hasReservationLinks = safeResults.some(r => r.resyLink || r.openTableLink);
  
  // Check if any restaurant has map coordinates for map links
  const hasMapLinks = safeResults.some(r => r.coordinates || r.address);
  
  // Check if results include distance information
  const hasDistanceInfo = safeResults.some(r => r.distanceFromUser !== undefined);
  
  // Function to handle showing more results
  const handleShowMore = () => {
    setDisplayCount(prev => prev + 3);
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-4xl mx-auto px-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-red-500">
            Finding Your Perfect Nashville Restaurants...
          </h1>
          <p className="text-zinc-300 text-lg">
            We're searching for the best matches based on your preferences.
          </p>
        </div>
        <ResultLoadingSkeleton />
        <ResetButton onReset={onReset} />
      </motion.div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto px-4"
    >
      <ResultHeader
        isSingleResult={isSingleResult}
        hasReservationLinks={hasReservationLinks}
        hasMapLinks={hasMapLinks}
        results={safeResults}
        displayedResults={displayedResults}
      />

      {/* Add banner ad after header */}
      {safeResults.length > 0 && (
        <BannerAd className="mb-2" />
      )}

      {safeResults.length > 0 ? (
        <>
          <ResultAlerts 
            noExactMatches={noExactMatches}
            hasAlternatives={hasAlternatives}
            allAlternatives={allAlternatives}
            hasDistanceInfo={hasDistanceInfo}
            onRetry={onRetry}
            results={safeResults}
            requestedDistance={requestedDistance}
          />
          
          <ResultsGrid results={displayedResults} />
          
          {hasMoreResults && (
            <ShowMoreButton onShowMore={handleShowMore} />
          )}
        </>
      ) : (
        <NoResultsMessage />
      )}

      <ResetButton onReset={onReset} />
    </motion.div>
  );
};

export default ResultScreen;
