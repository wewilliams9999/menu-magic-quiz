
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
}

const INITIAL_DISPLAY_COUNT = 6; // Increased from 3 to show more alternatives

const ResultScreen = ({ results, onReset, onRetry, isLoading = false }: ResultScreenProps) => {
  // State to track how many restaurants to show
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  
  // Debug output to check results
  useEffect(() => {
    console.log("Results in ResultScreen:", results);
    if (results.length > 0) {
      console.log("First result sample:", results[0]);
      console.log("All results are alternatives:", results.every(r => r.isAlternative));
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
      <ResultHeader
        isSingleResult={isSingleResult}
        hasReservationLinks={hasReservationLinks}
        hasMapLinks={hasMapLinks}
        results={results}
        displayedResults={displayedResults}
      />

      {/* Add banner ad after header */}
      {results.length > 0 && (
        <BannerAd className="mb-8" />
      )}

      {isLoading ? (
        <ResultLoadingSkeleton />
      ) : results.length > 0 ? (
        <>
          <ResultAlerts 
            noExactMatches={noExactMatches}
            hasAlternatives={hasAlternatives}
            allAlternatives={allAlternatives}
            hasDistanceInfo={hasDistanceInfo}
            onRetry={onRetry}
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
