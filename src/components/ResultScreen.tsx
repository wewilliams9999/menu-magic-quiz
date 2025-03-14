
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, MapPin, RefreshCw, AlertCircle } from "lucide-react";
import { QuizResult } from "@/utils/quizData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ResultScreenProps {
  results: QuizResult[];
  onReset: () => void;
  isLoading?: boolean;
}

const ResultScreen = ({ results, onReset, isLoading = false }: ResultScreenProps) => {
  // Check if all results are alternatives
  const allAlternatives = results.length > 0 && results.every(result => result.isAlternative);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-2xl mx-auto px-4"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center p-2 bg-nashville-accent/20 rounded-full mb-5">
          <span className="text-nashville-accent text-2xl">✦</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Nashville Restaurant Matches</h2>
        <p className="text-nashville-600 dark:text-nashville-400 max-w-md mx-auto">
          Based on your preferences, we think you'll enjoy these Nashville gems.
        </p>
      </div>

      {allAlternatives && results.length > 0 && (
        <Alert className="mb-6 border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertTitle className="text-amber-800 dark:text-amber-400">No exact matches found</AlertTitle>
          <AlertDescription className="text-amber-700 dark:text-amber-300">
            We couldn't find restaurants that match all your criteria, but we found these alternatives you might enjoy!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6 mb-10">
        {isLoading ? (
          // Loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <Card key={`loading-${index}`} className="overflow-hidden border border-nashville-200 dark:border-nashville-800">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/3 h-48 md:h-auto">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="md:w-2/3 p-6 space-y-4">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : results.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-2">Hmm, no results found</h3>
            <p className="text-nashville-600 dark:text-nashville-400 mb-4">
              We're having trouble finding perfect matches. Try adjusting your preferences for more options.
            </p>
            <Button onClick={onReset} variant="default" className="bg-nashville-accent hover:bg-nashville-accent/90">
              Start Over
            </Button>
          </div>
        ) : (
          // Results list
          results.map((result, index) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
            >
              <Card className={`overflow-hidden border ${
                result.isAlternative
                  ? "border-amber-200 dark:border-amber-800"
                  : "border-nashville-200 dark:border-nashville-800"
              } hover:shadow-lg transition-all duration-300`}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto relative overflow-hidden">
                    <img
                      src={result.image}
                      alt={result.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{result.name}</h3>
                        <div className="flex items-center text-nashville-500 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span className="text-sm">{result.address}</span>
                        </div>
                      </div>
                      <span className="text-nashville-accent font-medium">{result.priceRange}</span>
                    </div>
                    
                    <p className="text-nashville-600 dark:text-nashville-400 mb-4">
                      {result.description}
                    </p>
                    
                    <div className="mt-auto flex flex-wrap gap-2 mb-4">
                      {result.tags.map(tag => (
                        <span key={tag} className="inline-block px-2 py-1 bg-nashville-100 dark:bg-nashville-800 rounded-md text-xs">
                          {tag.replace('-', ' ')}
                        </span>
                      ))}
                    </div>
                    
                    {result.website && (
                      <a 
                        href={result.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-nashville-accent hover:text-nashville-accent/80 transition-colors"
                      >
                        Visit Website <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="text-center">
        <Button
          onClick={onReset}
          variant="outline"
          className="border-nashville-300 hover:bg-nashville-100 dark:hover:bg-nashville-800 flex items-center"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>
    </motion.div>
  );
};

export default ResultScreen;
